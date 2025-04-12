import BusinessProfile from '../models/BusinessProfile.js';
import Deal from '../models/Deal.js';
import Review from '../models/Review.js';
import { analyzeReviewSentiment } from './geminiResolver.js'; // Import the sentiment analysis function

const createReview = async (_, { businessId, authorId, rating, comment }) => {
    try {
        // First, perform sentiment analysis on the comment
        const sentiment = await analyzeReviewSentiment(comment).catch(() => {
            // Fallback to rating-based sentiment analysis if sentiment API fails
            return getSentimentFromRating(rating);
        });

        // Create the new review in the database (Mongoose example)
        const newReview = new Review({
            businessId,
            authorId,
            rating,
            comment,
            sentiment,  // Store the sentiment in the review
            createdAt: new Date(),
        });

        // Save the review
        await newReview.save();

        return newReview;
    } catch (error) {
        console.error("Error creating review:", error);
        throw new Error("Failed to create review.");
    }
};

export const businessResolver = {
  Query: {
    getAllBusinesses: async () => {
      return await BusinessProfile.find();
    },

    getBusinessById: async (_, { id }) => {
      return await BusinessProfile.findById(id);
    },

    getDealsByBusiness: async (_, { businessId }) => {
      return await Deal.find({ business: businessId });
    },

    getReviewsByBusiness: async (_, { businessId }) => {
      return await Review.find({ business: businessId });
    },
  },

  Mutation: {
    createBusinessProfile: async (_, { ownerId, name, description, category, contactInfo }) => {
      const business = new BusinessProfile({
        owner: { id: ownerId },
        name,
        description,
        category,
        contactInfo,
        createdAt: new Date().toISOString(),
      });
      return await business.save();
    },

    createDeal: async (_, { businessId, title, description, validUntil }) => {
      const deal = new Deal({
        business: businessId,
        title,
        description,
        validUntil,
        createdAt: new Date().toISOString(),
      });
      return await deal.save();
    },

    createReview: async (_, { businessId, authorId, rating, comment }) => {
        try {
            // First, perform sentiment analysis on the comment
            const sentiment = await analyzeReviewSentiment(comment).catch(() => {
                // Fallback to rating-based sentiment analysis if sentiment API fails
                return getSentimentFromRating(rating);
            });
    
            // Create the new review in the database (Mongoose example)
            const newReview = new Review({
                businessId,
                authorId,
                rating,
                comment,
                sentiment,  // Store the sentiment in the review
                createdAt: new Date(),
            });
    
            // Save the review
            await newReview.save();
    
            return newReview;
        } catch (error) {
            console.error("Error creating review:", error);
            throw new Error("Failed to create review.");
        }
    },

    respondToReview: async (_, { reviewId, response }) => {
      const review = await Review.findById(reviewId);
      if (!review) throw new Error("Review not found");

      review.response = response;
      return await review.save();
    },
  },

  BusinessProfile: {
    __resolveReference: async (reference) => {
      return await BusinessProfile.findById(reference.id);
    },
  },

  Review: {
    __resolveReference: async (reference) => {
      return await Review.findById(reference.id);
    },
  },
};

// Optional sentiment helper
function getSentimentFromRating(rating) {
  if (rating >= 4) return "Positive";
  if (rating === 3) return "Neutral";
  return "Negative";
}


export default businessResolver;
