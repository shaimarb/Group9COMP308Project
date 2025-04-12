import BusinessProfile from '../models/BusinessProfile.js';
import Deal from '../models/Deal.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { analyzeReviewSentiment } from './geminiResolver.js';

// Helper function to check if the user role is allowed
const checkUserRole = async (userId, allowedRoles) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return false;
        }
        return allowedRoles.includes(user.role);
    } catch (error) {
        console.error('Error in checkUserRole:', error);
        return false;
    }
};

const businessResolver = {
    Query: {
        getAllBusinessProfiles: async () => {
            return await BusinessProfile.find().populate('author');
        },
        getDealsByBusiness: async (_, { businessId }) => {
            return await Deal.find({ businessId }).sort({ validUntil: 1 });
        },
        getReviewsByBusiness: async (_, { businessId }) => {
            return await Review.find({ businessId }).populate('author').sort({ createdAt: -1 });
        },
        getBusinessProfile: async (_, { id }) => {
            // Try to fetch the business profile by ID
            const businessProfile = await BusinessProfile.findById(id)
                .populate('author') // If you want to include the author details, populate the author field.
                .populate('deals') // If you want to include the deals associated with the business
                .populate('reviews'); // If you want to include reviews associated with the business

            if (!businessProfile) {
                throw new Error('Business profile not found');
            }
            return businessProfile;
        },
    },

    Mutation: {
        createBusinessProfile: async (_, { author, name, description, category, address }) => {
            // Check if the user has the 'business_owner' role
            const hasPermission = await checkUserRole(author, ['business_owner', 'resident', 'community_organizer']);
            console.log(`Checking role for user ${author}`);
            console.log(`Permission granted? ${hasPermission}`);

            if (!hasPermission) throw new Error('Insufficient permissions to create a business profile.');

            // Create a new business profile and save it
            const newProfile = new BusinessProfile({
                author,
                name,
                description,
                category,
                address,
            });
            return await newProfile.save();
        },

        createDeal: async (_, { businessId, title, description, validUntil }) => {
            // Fetch the business profile
            const business = await BusinessProfile.findById(businessId);
            if (!business) throw new Error('Business not found');

            // Check permission based on the business profile's author
            const hasPermission = await checkUserRole(business.author, ['business_owner']);
            if (!hasPermission) throw new Error('Insufficient permissions to create a deal.');

            // Create and save the deal
            const newDeal = new Deal({ businessId, title, description, validUntil });
            return await newDeal.save();
        },

        createReview: async (_, { businessId, author, comment, rating }) => {
            const hasPermission = await checkUserRole(author, ['resident', 'community_organizer']);
            if (!hasPermission) throw new Error('Only customers can leave reviews.');

            try {
                const business = await BusinessProfile.findById(businessId);
                if (!business) throw new Error('Business not found');

                const sentiment = await analyzeReviewSentiment(comment);

                const newReview = new Review({
                    businessId,  // ✅ correct key name
                    author,
                    comment,
                    rating,
                    sentiment,
                });

                await newReview.save();

                // Optionally save business if you later want to push review IDs
                business.reviews.push(newReview._id);
                await business.save();

                return await newReview.populate('author');
            } catch (error) {
                console.error('Error creating review:', error);
                throw new Error('Failed to create review');
            }
        },

        addResponseToReview: async (_, { reviewId, response, author }) => {
            const hasPermission = await checkUserRole(author, ['business_owner']);
            if (!hasPermission) throw new Error('Only business owners can respond to reviews.');

            const review = await Review.findById(reviewId);
            if (!review) throw new Error('Review not found');

            review.response = response;
            return await review.save();
        },

        removeDeal: async (_, { dealId }) => {
            try {
                // Attempt to delete the deal by its ID
                const deletedDeal = await Deal.findByIdAndDelete(dealId);

                // If the deal was deleted, return true
                if (deletedDeal) {
                    return true;
                } else {
                    return false; // Return false if no deal was found to delete
                }
            } catch (error) {
                console.error("Error deleting deal:", error);
                return false; // Return false in case of an error
            }
        },
      
  },

BusinessProfile: {
    deals: async (parent) => {
        return await Deal.find({ businessId: parent._id });
    },
        reviews: async (parent) => {
            return await Review.find({ businessId: parent._id }).populate('author');
        },
  },

Review: {
    author: async (parent) => {
        return await User.findById(parent.author);
    },
  },
};

export default businessResolver;
