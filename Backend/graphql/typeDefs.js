const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    description: String!
    addedBy: User!
    reviews: [Review!]
    createdAt: String!
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String!
    bookId: ID!
    userId: ID!
    user: User!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getBooks: [Book!]!
    getBook(id: ID!): Book
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addBook(title: String!, author: String!, description: String!): Book!
    addReview(bookId: ID!, rating: Int!, comment: String!): Review!
    deleteReview(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
