//typeDefs from Community
//removed   updatedAt: String! from CommunityPost and HelpRequest

const typeDefs = `#graphql
  #graphql
  type User @key(fields: "id") {
    id: ID! @external
    username: String! @external
    email: String! @external
    role: String! @external
  }

type CommunityPost {
  id: ID!
  author: User! @external
  title: String!
  content: String!
  category: String!
  aiSummary: String
  createdAt: String!
}

type HelpRequest {
  id: ID!
  author: User! @external
  description: String!
  location: String
  isResolved: Boolean!
  volunteers: [User!]! @external
  createdAt: String!
}

type EmergencyAlert {
  id: ID!
  type: String!
  description: String!
  location: String!
  reportedAt: String!
  reporterId: ID!
}

type AIResponse {
    text: String!
    suggestedQuestions: [String]!
    retrievedPosts: [CommunityPost]!
}

# BUSINESS_OWNER TYPES

type BusinessProfile {
  id: ID!
  name: String!
  description: String
  category: String
  address: String
  author: User! @external
  createdAt: String!
  deals: [Deal!]!
  reviews: [Review!]!
}

type Deal {
  id: ID!
  title: String!
  description: String
  validUntil: String
  createdAt: String!
}

type Review {
  id: ID!
  author: User! @external
  rating: Int!
  comment: String
  sentiment: String
  response: String
  createdAt: String!
}


# Queries
type Query {
  getCommunityPosts: [CommunityPost!]!
  getHelpRequests: [HelpRequest!]!
  communityAIQuery(input: String!, userId: ID!): AIResponse!
  getDiscussionById(postId: ID!) : CommunityPost

  getEmergencyAlerts: [EmergencyAlert!]!

# BUSINESS QUERIES

  getAllBusinessProfiles: [BusinessProfile!]!
  getReviewsByBusiness(businessId: ID!): [Review!]!
  getDealsByBusiness(businessId: ID!): [Deal!]!
  getBusinessProfilesByAuthor(authorId: ID!): [BusinessProfile!]! # Added query for business owner
  getBusinessProfile(id: ID!): BusinessProfile

}

# Mutations
# removed field    aiSummary: String from createCommunityPost

type Mutation {
  createCommunityPost(
    author: ID!,
    title: String!,
    content: String!,
    category: String!
  ): CommunityPost!

  createHelpRequest(
    author: ID!,
    description: String!,
    aiSummary:String,
    location: String
  ): Boolean

  markHelpRequestResolved(id: ID!): Boolean
  
  addVolunteerToHelpRequest(id: ID!, volunteerId: ID!): Boolean

  updateCommunityPost(
    id: ID!,
    title: String,
    content: String,
    aiSummary: String,
    category: String
  ): CommunityPost!

  deleteCommunityPost(id: ID!): Boolean

  updateHelpRequest(
    id: ID!,
    description: String,
    location: String,
    isResolved: Boolean
  ): HelpRequest!

  deleteHelpRequest(id: ID!): Boolean

  logout: Boolean

  createEmergencyAlert(input: EmergencyAlertInput!): EmergencyAlert!
  deleteEmergencyAlert(id: ID!): Boolean

  # BUSINESS MUTATIONS:

  createBusinessProfile(
  name: String!,
  description: String,
  category: String,
  address: String
  author: ID!  
): BusinessProfile!


  createDeal(
    businessId: ID!,
    title: String!,
    description: String,
    validUntil: String
  ): Deal!

  removeDeal(dealId: ID!): Boolean!

  createReview(
    businessId: ID!,
    author: ID!,
    rating: Int!,
    comment: String,
    sentiment: String
  ): Review!

  addResponseToReview(
    reviewId: ID!,
    response: String!
    author: ID! 
  ): Review!
}

input EmergencyAlertInput {
  type: String!
  description: String!
  location: String!
  reporterId: ID!
}

`

export default typeDefs;