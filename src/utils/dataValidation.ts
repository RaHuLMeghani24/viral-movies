import Joi from "joi";

// validation schema for signUp
export const signUpValidation = Joi.object({
  user_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),

  //minimum of 6 letters, has to have one specialCharacter and one Uppercase character
  password: Joi.string().pattern(
    new RegExp("^(?=.*[!@#$&*])(?=.*[A-Z]).{6,}$")
  ),
});

// validation schema for createMovie
export const createMovieValidation = Joi.object({
  movie_name: Joi.string().min(1).required(),
  description: Joi.string().min(1).optional(),
  director_name: Joi.string().min(1).optional(),
  release_date: Joi.date().optional(),
});

// validation schema for updateMovie
export const updateMovieValidation = Joi.object({
  id: Joi.number().required(),
  movie_name: Joi.string().min(1).optional(),
  description: Joi.string().min(1).optional(),
  director_name: Joi.string().min(1).optional(),
  release_date: Joi.date().optional(),
});

// validation schema for login
export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
});

// validation schema for changePassword
export const changePasswordValidation = Joi.object({
  new_password: Joi.string().pattern(
    new RegExp("^(?=.*[!@#$&*])(?=.*[A-Z]).{6,}$")
  ),
});

// validation schema for deleteMovie
export const deleteMovieValidation = Joi.object({
  id: Joi.number().required(),
});

//validation for get movie by Id query
export const getMovieValidation = Joi.object({
  id: Joi.number().required(),
});

export const moviesArgsValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  search: Joi.string().min(1).optional(),
  sortBy: Joi.string()
    .valid("movie_name", "description", "director_name", "release_date")
    .optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
});
