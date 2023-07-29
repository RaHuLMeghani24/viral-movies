import { PrismaClient, Movie } from "@prisma/client";
import { MoviesArgs, MovieArgs } from "../interface/argsInterface";
import { UserInputError } from "apollo-server";
import {
  getMovieValidation,
  moviesArgsValidation,
} from "../utils/dataValidation";

// Initialize prisma client
const prisma = new PrismaClient();

// Function to fetch movies based on various parameters
export const movies = async (_: any, args: MoviesArgs) => {
  // Validate the arguments
  const { error, value } = moviesArgsValidation.validate(args);

  // If validation fails, throw an error
  if (error) {
    throw new Error(
      `Invalid input parameters: ${error.details
        .map((d) => d.message)
        .join(", ")}`
    );
  }

  // Destructure the validated parameters
  const { page, limit, search, sortBy, sortOrder } = value;

  // Calculate the offset for pagination
  const offset = (page - 1) * limit;

  // Prepare the 'where' clause for Prisma based on search input
  const where: any = search
    ? {
        OR: [
          { movie_name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  // Prepare the 'orderBy' clause for Prisma based on sort parameters
  const orderBy = sortBy
    ? { [sortBy]: sortOrder === "desc" ? "desc" : "asc" }
    : {};

  // Fetch movies using prisma client with specified conditions
  const movies = await prisma.movie.findMany({
    skip: offset,
    take: limit,
    where,
    orderBy,
  });

  return movies;
};

// Function to fetch a single movie based on ID
export const movie = async (_: any, args: MovieArgs) => {
  // Destructure the movie ID from the arguments
  const { id } = args;

  // Validate the movie ID
  const { error } = getMovieValidation.validate({ id });

  // If validation fails, throw an error
  if (error) {
    throw new UserInputError("Validation error", {
      validationErrors: error.details,
    });
  }

  // Fetch the movie using prisma client
  const movie = await prisma.movie.findUnique({ where: { id } });

  // If movie doesn't exist, throw an error
  if (!movie) {
    throw new UserInputError("Movie not found", {
      code: "MOVIE_NOT_FOUND",
      customMessage: "Movie with the provided ID was not found",
    });
  }

  return movie;
};
