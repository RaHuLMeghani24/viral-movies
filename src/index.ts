import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { customDateScalar } from "./utils/customDateScalar";
import { movies, movie } from "./resolvers/queryResolvers";
import { NotFoundError, CustomApolloError } from "./utils/errors";
import express from "express";
import {
  signUp,
  login,
  changePassword,
  createMovie,
  updateMovie,
  deleteMovie,
} from "./resolvers/mutationResolver";

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      movies,
      movie,
    },
    Mutation: {
      signUp,
      login,
      changePassword,
      createMovie,
      updateMovie,
      deleteMovie,
    },
    Date: customDateScalar,
  },
  context: ({ req }: { req: express.Request }) => {
    //
    // pass the request object in the context
    return { request: req };
  },
  formatError: (error) => {
    if (error.originalError instanceof NotFoundError) {
      return new CustomApolloError(error.message);
    }
    return error;
  },
});

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
