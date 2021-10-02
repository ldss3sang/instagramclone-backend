require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";

const PORT = process.env.PORT;

(async () => {
  const apollo = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => {
      console.log("token:", req.headers.token);
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
  });

  await apollo.start();

  const app = express();
  app.use(logger("tiny"));
  app.use(graphqlUploadExpress());
  apollo.applyMiddleware({ app });
  app.use("/static", express.static("uploads"));
  app.listen(PORT, () =>
    console.log(`🚀 Server is running on http://localhost:${PORT}/`)
  );
})();
