import { Movie } from "@prisma/client";
export interface MoviesArgs {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof Movie;
  sortOrder?: "asc" | "desc";
}

export interface MovieArgs {
  id: number;
}

export interface SignUpArgs {
  user_name: string;
  email: string;
  password: string;
}

export interface LoginArgs {
  email: string;
  password: string;
}

export interface ChangePasswordArgs {
  old_password: string;
  new_password: string;
}

export interface CreateMovieArgs {
  movie_name: string;
  description: string;
  director_name: string;
  release_date: Date;
}

export interface UpdateMovieArgs extends CreateMovieArgs {
  id: number;
}

export interface DeleteMovieArgs {
  id: number;
}
