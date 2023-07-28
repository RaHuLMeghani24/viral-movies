import { User, Movie, PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import {
  CreateMovieArgs,
  UpdateMovieArgs,
  DeleteMovieArgs,
  LoginArgs,
  SignUpArgs,
  ChangePasswordArgs,
} from "../interface/argsInterface";

import {
  signUpValidation,
  changePasswordValidation,
  deleteMovieValidation,
  updateMovieValidation,
  createMovieValidation,
  loginValidation,
} from "../utils/dataValidation";
import { UserInputError } from "apollo-server";
import { AnyARecord } from "dns";

const prisma = new PrismaClient();

const dummyData: any = {
  user_id: 1,
  movie_name: "test",
  description: "test",
  director_name: "test",
  release_date: new Date("2020-02-02"),
};
export const signUp = async (
  _: any,
  { user_name, email, password }: SignUpArgs
): Promise<User> => {
  const { error } = signUpValidation.validate({ user_name, email, password });

  if (error) {
    throw new UserInputError("Validation error", {
      validationErrors: error.details,
    });
  }
  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      user_name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const login = async (
  _: any,
  { email, password }: LoginArgs
): Promise<String> => {
  return "dummy";
};

export const changePassword = async (
  _: any,
  { old_password, new_password }: ChangePasswordArgs,
  context: any
): Promise<boolean> => {
  return true;
};

export const createMovie = async (
  _: any,
  args: CreateMovieArgs,
  context: any
): Promise<any> => {
  return dummyData;
};

export const updateMovie = async (
  _: any,
  args: UpdateMovieArgs,
  context: any
): Promise<any> => {
  return dummyData;
};

export const deleteMovie = async (
  _: any,
  { id }: DeleteMovieArgs,
  context: any
): Promise<boolean> => {
  return false;
};
