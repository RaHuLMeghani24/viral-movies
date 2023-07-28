import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { customDateScalar } from "./utils/customDateScalar";
import { movies, movie } from "./resolvers/queryResolvers";
import {
  signUp,
  login,
  changePassword,
  createMovie,
  updateMovie,
  deleteMovie,
} from "./resolvers/mutationResolver";

import express from "express";
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      movies,
      movie,
    },
    Mutation: {
      signUp,
    },
    Date: customDateScalar,
  },

  context: ({ req }: { req: express.Request }) => {
    //
    // pass the request object in the context
    return { request: req };
  },
});
server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
