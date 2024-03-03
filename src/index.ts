import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // graphql server
  const server = new ApolloServer({
    typeDefs: `
    type Query {
        hello : String,
        say(name : String) : String
    }

    type Mutation{
        createUser(firstName:String! , lastName : String!, email:String! , password:String! ): Boolean
    }
    `,
    resolvers: {
      Query: {
        hello: () => "hello there i am graphql",
        say: (_, { name }) => `my name is ${name}`,
      },

      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
            salt
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            salt :string
          }
        ) => {
            
           let userData = await prismaClient.user.create({
                data : {
                    firstName,
                    lastName,
                    email,
                    password, 
                    salt :"random_salt"
                }
            });
            console.log(userData);
            return true
            
            
        },
      },
      
    },
  });

  // starting the graphql server
  await server.start();

  app.get("/", (req, res) => {
    res.json({
      message: "this is the homepage",
    });
  });

  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`server is started at port ${PORT}`);
  });
}

init();
