import { PrismaClient } from "@prisma/client";
import { MoviesArgs, MovieArgs } from "../interface/argsInterface";
const prisma = new PrismaClient();

export const movies = async (_: any, args: MoviesArgs) => {};

export const movie = async (_: any, args: MovieArgs) => {};
