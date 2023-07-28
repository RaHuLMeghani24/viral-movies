import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date

  type User {
    id: Int!
    user_name: String!
    email: String!
    password: String!
  }

  type Movie {
    id: Int!
    movie_name: String!
    description: String
    director_name: String
    release_date: Date
  }

  type Query {
    movies(
      page: Int
      limit: Int
      search: String
      sortBy: String
      sortOrder: String
    ): [Movie!]!
    movie(id: Int!): Movie
  }

  type Mutation {
    signUp(user_name: String!, email: String!, password: String!): User

    login(email: String!, password: String!): String

    changePassword(old_password: String!, new_password: String!): Boolean

    createMovie(
      movie_name: String!
      description: String
      director_name: String
      release_date: Date
    ): Movie

    updateMovie(
      id: Int!
      movie_name: String
      description: String
      director_name: String
      release_date: Date
    ): Movie

    deleteMovie(id: Int!): Boolean
  }
`;
