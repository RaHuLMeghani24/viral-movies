// Import all necessary modules and types
import { User, Movie, PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server";
import { verify } from "jsonwebtoken";
import {
  CreateMovieArgs,
  UpdateMovieArgs,
  DeleteMovieArgs,
  LoginArgs,
  SignUpArgs,
  ChangePasswordArgs,
} from "../interface/argsInterface";
import { Context, AuthToken } from "../interface/contextInterface";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Set JWT Secret Key
const JWT_SECRET = "your-secret-key"; //ideally it should be in .env file but keeping it here for simplicity

// Import validation functions
import {
  signUpValidation,
  changePasswordValidation,
  deleteMovieValidation,
  updateMovieValidation,
  createMovieValidation,
  loginValidation,
} from "../utils/dataValidation";

// Function to get user ID from JWT
const getUserId = (context: Context) => {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const verifiedToken = verify(token, JWT_SECRET);
    if (typeof verifiedToken === "object") {
      const { userId } = verifiedToken as AuthToken;
      return userId;
    }
  }

  throw new AuthenticationError("Not authenticated");
};

// SignUp mutation resolver
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

// Login mutation resolver
export const login = async (
  _: any,
  { email, password }: LoginArgs
): Promise<string> => {
  const { error } = loginValidation.validate({ email });
  if (error) {
    throw new UserInputError("Validation error", {
      validationErrors: error.details,
    });
  }
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UserInputError("Invalid email or password", {
      errorCode: "INVALID_CREDENTIALS",
    });
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new UserInputError("Invalid email or password", {
      errorCode: "INVALID_CREDENTIALS",
    });
  }

  const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return token;
};

// ChangePassword mutation resolver
export const changePassword = async (
  _: any,
  { old_password, new_password }: ChangePasswordArgs,
  context: any
): Promise<boolean> => {
  const { error } = changePasswordValidation.validate({
    new_password,
  });
  if (error) {
    throw new UserInputError("Validation error", {
      validationErrors: error.details,
    });
  }

  if (old_password === new_password) {
    throw new UserInputError("Old Password and new password cannot be same.");
  }
  const userId = getUserId(context);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AuthenticationError("User not found", {
      errorCode: "USER_NOT_FOUND",
    });
  }

  const passwordMatch = await compare(old_password, user.password);

  if (!passwordMatch) {
    throw new UserInputError("Invalid old password", {
      errorCode: "INVALID_OLD_PASSWORD",
    });
  }

  const hashedNewPassword = await hash(new_password, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return true;
};

// CreateMovie mutation resolver
export const createMovie = async (
  _: any,
  args: CreateMovieArgs,
  context: any
): Promise<Movie> => {
  const { error } = createMovieValidation.validate(args);
  if (error) {
    throw new UserInputError("Validation error", {
      validationErrors: error.details,
    });
  }
  const userId = getUserId(context);

  const movie = await prisma.movie.create({
    data: {
      ...args,
      user: { connect: { id: userId } },
    },
  });

  return movie;
};

// UpdateMovie mutation resolver
export const updateMovie = async (
  _: any,
  args: UpdateMovieArgs,
  context: any
): Promise<Movie> => {
  const { error } = updateMovieValidation.validate(args);
  if (error) {
    throw new UserInputError("Validation error", {
      validationErrors: error.details,
    });
  }
  const userId = getUserId(context);

  const { id, ...updateFields } = args;

  const movie = await prisma.movie.findUnique({ where: { id } });

  if (!movie) {
    throw new UserInputError("Movie not found", {
      errorCode: "MOVIE_NOT_FOUND",
    });
  }

  if (movie.user_id !== userId) {
    throw new AuthenticationError("Not authorized to update this movie", {
      errorCode: "UNAUTHORIZED",
    });
  }

  const updatedMovie = await prisma.movie.update({
    where: { id },
    data: updateFields,
  });

  return updatedMovie;
};

// DeleteMovie mutation resolver
export const deleteMovie = async (
  _: any,
  { id }: DeleteMovieArgs,
  context: any
): Promise<boolean> => {
  const { error } = deleteMovieValidation.validate({ id });

  if (error) {
    throw new UserInputError("Validation error", {
      validationErrors: error.details,
    });
  }
  const userId = getUserId(context);

  const movie = await prisma.movie.findUnique({ where: { id } });

  if (!movie) {
    throw new UserInputError("Movie not found", {
      errorCode: "MOVIE_NOT_FOUND",
    });
  }

  if (movie.user_id !== userId) {
    throw new AuthenticationError("Not authorized to delete this movie", {
      errorCode: "UNAUTHORIZED",
    });
  }

  await prisma.movie.delete({ where: { id } });

  return true;
};
