import { PrismaClient, Movie } from "@prisma/client";
import { MoviesArgs, MovieArgs } from "../interface/argsInterface";
import { UserInputError } from "apollo-server";
import {
  getMovieValidation,
  moviesArgsValidation,
} from "../utils/dataValidation";

const prisma = new PrismaClient();

export const movies = async (_: any, args: MoviesArgs) => {
  const { error, value } = moviesArgsValidation.validate(args);
  if (error) {
    throw new Error(
      `Invalid input parameters: ${error.details
        .map((d) => d.message)
        .join(", ")}`
    );
  }

  const { page, limit, search, sortBy, sortOrder } = value;

  const offset = (page - 1) * limit;

  const where: any = search
    ? {
        OR: [
          { movie_name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const orderBy = sortBy
    ? { [sortBy]: sortOrder === "desc" ? "desc" : "asc" }
    : {};

  const movies = await prisma.movie.findMany({
    skip: offset,
    take: limit,
    where,
    orderBy,
  });

  return movies;
};

export const movie = async (_: any, args: MovieArgs) => {
  const { id } = args;

  const { error } = getMovieValidation.validate({ id });

  if (error) {
    throw new UserInputError("Validation error", {
      validationErrors: error.details,
    });
  }
  const movie = await prisma.movie.findUnique({ where: { id } });

  if (!movie) {
    throw new UserInputError("Movie not found", {
      code: "MOVIE_NOT_FOUND",
      customMessage: "Movie with the provided ID was not found",
    });
  }

  return movie;
};
