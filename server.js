import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID
    name: String
    articles: [Article]
    comments: [Comment]
  }
  type Article {
    id: ID
    author: User
    publishDate: String
    modifyDate: String
    title: String
    content: String
    comments: [Comment]
  }
  type Comment {
    id: ID
    author: User
    article: Article
    content: String
  }
  type Query {
    users: [User]
    articles: [Article]
  }
`;
const server = new ApolloServer({ typeDefs });
server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
   