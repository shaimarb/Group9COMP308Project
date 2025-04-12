const typeDefs = `#graphql
extend type User @key(fields: "id") {
  id: ID! @external
  username: String @external
  email: String @external
  role: String @external
}

type CommunityPost {
  id: ID!
  author: User!
  title: String!
  content: String!
  category: String!
  aiSummary: String
  createdAt: String!
}

type HelpRequest {
  id: ID!
  author: User!
  description: String!
  location: String
  isResolved: Boolean!
  volunteers: [User!]!
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
  owner: User!
  name: String!
  description: String
  category: String
  contactInfo: ContactInfo
  createdAt: String!
}

type ContactInfo {
  phone: String
  email: String
  address: String
}

type Deal {
  id: ID!
  business: BusinessProfile!
  title: String!
  description: String
  validUntil: String
  createdAt: String!
}

type Review {
  id: ID!
  business: BusinessProfile!
  author: User!
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
  getDiscussionById(postId: ID!): CommunityPost

  getEmergencyAlerts: [EmergencyAlert!]!
  getMatchedVolunteers(helpRequestId: ID!): [User!]!

  getAllBusinesses: [BusinessProfile!]!
  getBusinessById(id: ID!): BusinessProfile
  getDealsByBusiness(businessId: ID!): [Deal!]!
  getReviewsByBusiness(businessId: ID!): [Review!]!
}

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
    aiSummary: String,
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

  createEmergencyAlert(input: EmergencyAlertInput!): EmergencyAlert!

  logout: Boolean

  createBusinessProfile(
    ownerId: ID!,
    name: String!,
    description: String,
    category: String,
    contactInfo: ContactInfoInput
  ): BusinessProfile!

  createDeal(
    businessId: ID!,
    title: String!,
    description: String,
    validUntil: String
  ): Deal!

  createReview(
    businessId: ID!,
    authorId: ID!,
    rating: Int!,
    comment: String
  ): Review!

  respondToReview(
    reviewId: ID!,
    response: String!
  ): Review!
}

input ContactInfoInput {
  phone: String
  email: String
  address: String
}

input EmergencyAlertInput {
  type: String!
  description: String!
  location: String!
  reporterId: ID!
}
`;

export default typeDefs;
