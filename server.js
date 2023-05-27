import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    school: String!
    articles: [Article]!
    comments: [Comment]!
  }

  type Article {
    id: ID!
    author: User!
    type: Boolean!
    publishDate: String!
    modifyDate: String
    title: String!
    content: String!
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    author: User!
    type: Boolean!
    publishDate: String!
    modifyDate: String
    article: Article!
    content: String!
  }

  type Query {
    users: [User!]!
    articles: [Article!]!
    comments: [Comment!]!
    user(id: ID): User!
    article(id: ID): Article
    comment(id: ID): Comment
  }
  
  type Mutation {
    postArticle()
  }
`;

const prisma = new PrismaClient();

const resolvers = {};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
