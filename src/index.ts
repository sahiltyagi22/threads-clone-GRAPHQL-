import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import graphqlApolloServer from "./graphql";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      message: "this is the homepage",
    });
  });

  app.use("/graphql", expressMiddleware(await graphqlApolloServer()));

  app.listen(PORT, () => {
    console.log(`server is started at port ${PORT}`);
  });
}

init();
