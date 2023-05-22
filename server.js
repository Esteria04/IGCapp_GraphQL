import { ApolloServer, gql } from "apollo-server";

const typeDef = gql`
    type Query {
        type User {
            id: ID,
            name: String,
            articles: [Article],
            comments: [Comment]
        }
        type Article {
            id: ID,
            author: User,
            publish-date: String,
            modify-date: String,
            title: String,
            content: String,
            comments: [Comment]
        }
        type Comment {
            id: ID,
            author: User,
            article: Article,
            content: String
        }
    }
`;
const server = new ApolloServer({ typeDef });
server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
});