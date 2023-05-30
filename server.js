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
    board: Board!
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
    board: Board!
    type: Boolean!
    publishDate: String!
    modifyDate: String
    article: Article!
    content: String!
  }
  type Board {
    id: ID!
    name: String!
    articles: [Article]!
    comments: [Comment]!
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
    createBoard(name: String!): Boolean!
    deleteBoard(boardId: String!): Boolean!
    postArticle(
      authorId: ID!
      boardId: ID!
      type: Boolean!
      title: String!
      content: String!
    ): Boolean!
    modifyArticle(
      authorId: ID!
      boardId: ID!
      type: Boolean
      title: String
      content: String
      articleId: ID!
    ): Article!
    deleteArticle(authorId: ID!, articleId: ID!): Boolean!

    postComment(
      authorId: ID!
      boardId: ID!
      articleId: ID!
      type: Boolean!
      content: String!
    ): Comment!
    modifyComment(
      authorId: ID!
      boardId: ID!
      type: Boolean
      content: String
      commentId: ID!
    ): Comment!
    deleteComment(authorId: ID!, commentId: ID!): Boolean!

    createUser(name: String!, nickname: String!, school: String!): Boolean!
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
    async user(_, { id }) {
      const user = await prisma.user.findUnique({ where: { id: id } });
      return user;
    },
    async users() {
      const users = await prisma.user.findMany({});
      return users;
    },
    async board(_, { boardId }) {
      const board = await prisma.board.findUnique({ where: { id: boardId } });
      return board;
    },
    async boards() {
      const boards = await prisma.board.findMany({});
      return boards;
    },
    async article(_, { articleId }) {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });
      return article;
    },
    async articlesFromUser(_, { userId }) {
      const articles = await prisma.article.findMany({
        where: { authorId: userId },
      });
      return articles;
    },
    async articlesFromBoard(_, { boardId }) {
      const articles = await prisma.article.findMany({ where: { boardId } });
      return articles;
    },
    async comment(_, { commentId }) {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
      return comment;
    },
    async commentsFromUser(_, { userId }) {
      const comments = await prisma.comment.findMany({
        where: { authorId: userId },
      });
      return comments;
    },
    async commentsFromArticle(_, { articleId }) {
      const comments = await prisma.comment.findMany({
        where: { articleId },
      });
      return comments;
    },
  },

  Mutation: {
    async createUser(_, { name, nickname, school }) {
      try {
        const user = await prisma.user.create({
          data: {
            name,
            nickname,
            school,
          },
        });
        return user !== null;
      } catch {
        return false;
      }
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

    async createBoard(_, { name }) {
      try {
        const board = await prisma.board.create({
          data: { name },
        });
        return board !== null;
      } catch {
        return false;
      }
    },
    async deleteBoard(_, { boardId }) {
      try {
        const board = await prisma.board.delete({
          where: { id: boardId },
        });
        return board !== null;
      } catch {
        return false;
      }
    },

    async postArticle(_, { authorId, boardId, type, title, content }) {
      const article = await prisma.article.create({
        data: {
          authorId,
          boardId,
          type,
          title,
          content,
        },
      });
      return article;
    },
    async modifyArticle(
      _,
      { articleId, authorId, boardId, type, title, content }
    ) {
      const article = await prisma.article.update({
        where: {
          id: parseInt(articleId),
        },
        data: {
          authorId,
          boardId,
          type,
          title,
          content,
        },
      });
      return article;
    },
    async deleteArticle(_, { articleId, authorId }) {
      try {
        const article = await prisma.article.delete({
          where: {
            id: parseInt(articleId),
            authorId: parseInt(authorId),
          },
        });
        return article !== null;
      } catch {
        return false;
      }
    },

    async postComment(_, { authorId, articleId, type, title, content }) {
      const comment = await prisma.comment.create({
        data: {
          authorId,
          articleId,
          type,
          title,
          content,
        },
      });
      return comment;
    },
    async modifyComment(_, { commentId, authorId, type, title, content }) {
      const comment = await prisma.comment.update({
        where: {
          id: parseInt(commentId),
          authorId: parseInt(authorId),
        },
        data: {
          type,
          title,
          content,
        },
      });
      return comment;
    },
    async deleteComment(_, { commentId, authorId }) {
      try {
        const comment = await prisma.comment.delete({
          where: {
            id: parseInt(commentId),
            authorId: parseInt(authorId),
          },
        });
        return comment !== null;
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
