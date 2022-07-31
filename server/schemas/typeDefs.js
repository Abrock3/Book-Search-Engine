const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    _id: ID!
    authors: [String]
    bookId: String!
    image: String
    link: String
    title: String!
    description: String!
  }

  input BookInput {
    authors: [String]
    bookId: String!
    image: String
    link: String
    title: String!
    description: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User!
  }

  type Query {
    user: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String, password: String!): Auth
    saveBook(bookToSave: BookInput!, userId: String!): User
    deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
