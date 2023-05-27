import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    nickname: String!
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
    articles(userId: ID): [Article!]!
    comments: [Comment!]!
    user(id: ID): User
    article(id: ID): Article
    comment(id: ID): Comment
  }

  type Mutation {
    postArticle(
      authorId: ID!
      type: Boolean!
      title: String!
      content: String!
    ): Article!
    modifyArticle(
      authorId: ID!
      type: Boolean
      title: String
      content: String
      articleId: ID!
    ): Article!
    deleteArticle(authorId: ID!, articleId: ID!): Boolean!

    postComment(authorId: ID!, type: Boolean!, content: String!): Comment!
    modifyComment(
      authorId: ID!
      type: Boolean
      content: String
      commentId: ID!
    ): Comment!
    deleteComment(authorId: ID!, commentId: ID!): Boolean!

    createUser(name: String!, nickname: String!, school: String!): User!
    modifyUser(
      userId: ID!
      name: String
      nickname: String
      school: String
    ): User!
    deleteUser(userId: ID!): Boolean!
  }
`;

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    async users() {
      const users = await prisma.user.findMany({});
      return users;
    },
    async user(_, { id }) {
      const user = await prisma.user.findUnique({ where: { id: id } });
      return user;
    },
    async articles(_, { userId }) {
      const articles = await prisma.article.findMany({
        where: { authorId: userId },
      });
      return articles;
    },
    async article(_, { articleId }) {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });
      return article;
    },
  },
  Mutation: {
    async createUser(_, { name, nickname, school }) {
      const user = await prisma.user.create({
        data: {
          name,
          nickname,
          school,
        },
      });
      return user;
    },
    async modifyUser(_, { userId, name, nickname, school }) {
      const user = await prisma.user.update({
        where: {
          id: parseInt(userId),
        },
        data: {
          name,
          nickname,
          school,
        },
      });
      return user;
    },
    async deleteUser(_, { userId }) {
      try {
        const user = await prisma.user.delete({
          where: {
            id: parseInt(userId),
          },
        });
        return user !== null;
      } catch {
        return false;
      }
    },

    async postArticle(_, { name, nickname, school }) {
      const article = await prisma.article.create({
        data: {
          name,
          nickname,
          school,
        },
      });
      return article;
    },
    async modifyArticle(_, { articleId, name, nickname, school }) {
      const article = await prisma.article.update({
        where: {
          id: parseInt(articleId),
        },
        data: {
          name,
          nickname,
          school,
        },
      });
      return article;
    },
    async deleteArticle(_, { articleId }) {
      try {
        const article = await prisma.article.delete({
          where: {
            id: parseInt(articleId),
          },
        });
        return article !== null;
      } catch {
        return false;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
