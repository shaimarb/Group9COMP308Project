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

type AIResponse {
    text: String!
    suggestedQuestions: [String]!
    retrievedPosts: [CommunityPost]!
}

# BUSINESS_OWNER TYPES

type BusinessProfile {
  id: ID!
  owner: User! @external
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

# BUSINESS QUERIES

  getAllBusinesses: [BusinessProfile!]!
  getBusinessById(id: ID!): BusinessProfile
  getDealsByBusiness(businessId: ID!): [Deal!]!
  getReviewsByBusiness(businessId: ID!): [Review!]!
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

  # BUSINESS MUTATIONS:

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



`

export default typeDefs;
