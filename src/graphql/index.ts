import { ApolloServer } from "@apollo/server";
import { prismaClient } from "./../lib/db";
import { User } from "./users";

async function graphqlApolloServer() {
  const server = new ApolloServer({
    typeDefs: `
      type Query {
        hello :String
      }
      type Mutation {
        ${User.mutations}
      }
      
        `,

    resolvers: {
      Query : {
        ...User.resolvers.queries
      },

      Mutation : {
        ...User.resolvers.mutations
      }
    },
  });

  // starting the graphql server
  await server.start();

  return server;
}

export default graphqlApolloServer;
