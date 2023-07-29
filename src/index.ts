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

// Instantiate Apollo server with type definitions, resolvers, custom scalar and context
const server = new ApolloServer({
  // The GraphQL schema
  typeDefs,

  // The resolvers that provide the instructions for turning a GraphQL operation
  // (a query, mutation, or subscription) into data
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
    // Custom date scalar
    Date: customDateScalar,
  },

  // Context is an object shared by all resolvers in a GraphQL operation.
  // We use it to pass the request object in the context for resolvers to access
  context: ({ req }: { req: express.Request }) => {
    return { request: req };
  },

  // Error formatter to handle custom errors
  formatError: (error) => {
    if (error.originalError instanceof NotFoundError) {
      return new CustomApolloError(error.message);
    }
    return error;
  },
});

// Server starts listening on a default port or port that is set in environment variables
server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
