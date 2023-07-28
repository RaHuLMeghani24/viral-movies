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

const prisma = new PrismaClient();

export const signup = async (
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
