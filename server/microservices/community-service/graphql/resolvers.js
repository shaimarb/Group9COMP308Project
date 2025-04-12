import CommunityPost from '../models/CommunityPost.js';
import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';
import EmergencyAlert from '../models/EmergencyAlert.js';
import { getSummary } from './geminiResolver.js';
import businessResolver from './businessResolver.js';

const checkUserRole = async (userId, allowedRoles) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;
    return allowedRoles.includes(user.role);
  } catch (error) {
    console.error('Error in checkUserRole:', error);
    return false;
  }
};

const resolvers = {
  Query: {
    ...businessResolver.Query,

    getCommunityPosts: async () => {
      return await CommunityPost.find().populate('author').sort({ createdAt: -1 });
    },

    getHelpRequests: async () => {
      return await HelpRequest.find().populate('author volunteers');
    },

    getDiscussionById: async (_, { postId }) => {
      return await CommunityPost.findById(postId).populate('author');
    },

    communityAIQuery: async (_, { input, userId }) => {
      try {
        const response = await aiAgentLogic(input, userId);
        return {
          text: response.text,
          suggestedQuestions: response.suggestedQuestions,
          retrievedPosts: response.retrievedPosts.map(post => ({
            id: post.metadata.postId,
            author: post.metadata.author,
            title: post.metadata.title,
            content: post.pageContent,
            category: post.metadata.category,
            aiSummary: post.metadata.aiSummary,
            createdAt: post.metadata.createdAt,
          })),
        };
      } catch (error) {
        console.error("Error in AI Query:", error);
        throw new Error("Failed to process AI query.");
      }
    },

    getEmergencyAlerts: async () => {
      return await EmergencyAlert.find().sort({ reportedAt: -1 });
    },
  },

  Mutation: {
    ...businessResolver.Mutation,

    createCommunityPost: async (_, { author, title, content, category }) => {
      const hasPermission = await checkUserRole(author, ['resident', 'community_organizer']);
      if (!hasPermission) throw new Error('Insufficient permissions');

      const aiSummary = await getSummary(content);
      const newPost = new CommunityPost({ author, title, content, category, aiSummary });
      return await newPost.save();
    },

    createHelpRequest: async (_, { author, description, location }) => {
      const hasPermission = await checkUserRole(author, ['resident', 'business_owner', 'community_organizer']);
      if (!hasPermission) throw new Error('Insufficient permissions');

      const newRequest = new HelpRequest({
        author,
        description,
        location,
        isResolved: false,
        volunteers: [],
      });
      await newRequest.save();
      return true;
    },

    markHelpRequestResolved: async (_, { id }) => {
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) throw new Error('Help request not found');

      const hasPermission = await checkUserRole(helpRequest.author, ['community_organizer']);
      if (!hasPermission) throw new Error('Insufficient permissions');

      helpRequest.isResolved = !helpRequest.isResolved;
      await helpRequest.save();
      return true;
    },

    addVolunteerToHelpRequest: async (_, { id, volunteerId }) => {
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) throw new Error('Help request not found');

      const volunteer = await User.findById(volunteerId);
      if (!volunteer) throw new Error('Volunteer not found');

      if (volunteer.role !== 'community_organizer') {
        throw new Error('Insufficient permissions');
      }

      await HelpRequest.findByIdAndUpdate(
        id,
        { $push: { volunteers: volunteerId } },
        { new: true }
      ).populate('volunteers');

      return true;
    },

    updateCommunityPost: async (_, { id, title, content, category, aiSummary }) => {
      const post = await CommunityPost.findById(id);
      if (!post) throw new Error('Community post not found');

      const hasPermission = await checkUserRole(post.author, ['resident', 'community_organizer']);
      if (!hasPermission) throw new Error('Insufficient permissions');

      post.title = title || post.title;
      post.content = content || post.content;
      post.category = category || post.category;
      post.aiSummary = aiSummary || post.aiSummary;

      const updatedPost = await post.save();
      return await updatedPost.populate('author');
    },

    deleteCommunityPost: async (_, { id }) => {
      const post = await CommunityPost.findById(id);
      if (!post) throw new Error('Community post not found');

      const hasPermission = await checkUserRole(post.author, ['resident', 'community_organizer']);
      if (!hasPermission) throw new Error('Insufficient permissions');

      await post.deleteOne();
      return true;
    },

    updateHelpRequest: async (_, { id, description, location, isResolved }) => {
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) throw new Error('Help request not found');

      const hasPermission = await checkUserRole(helpRequest.author, ['resident', 'business_owner', 'community_organizer']);
      if (!hasPermission) throw new Error('Insufficient permissions');

      helpRequest.description = description || helpRequest.description;
      helpRequest.location = location || helpRequest.location;
      helpRequest.isResolved = (isResolved !== undefined) ? isResolved : helpRequest.isResolved;

      const updatedHelpRequest = await helpRequest.save();
      await updatedHelpRequest.populate('author');
      return updatedHelpRequest;
    },

    deleteHelpRequest: async (_, { id }) => {
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) throw new Error('Help request not found');

      const hasPermission = await checkUserRole(helpRequest.author, ['resident', 'business_owner', 'community_organizer']);
      if (!hasPermission) throw new Error('Insufficient permissions');

      await helpRequest.deleteOne();
      return true;
    },

    createEmergencyAlert: async (_, { input }) => {
      const hasPermission = await checkUserRole(input.reporterId, ['resident', 'community_organizer']);
      if (!hasPermission) throw new Error('Insufficient permissions');

      const alert = new EmergencyAlert({
        ...input,
        reportedAt: new Date(),
      });

      return await alert.save();
    },

    logout: (_, __, { res }) => {
      res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
      return true;
    }
  },

  BusinessProfile: businessResolver.BusinessProfile,
  Review: businessResolver.Review
};

export default resolvers;
