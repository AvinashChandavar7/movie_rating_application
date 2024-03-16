
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


import Movie from "../models/movie.model";

const addMovie = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies']
  const {
    title, director, genre,
    releaseYear, description
  } = req.body;

  if (!title || !director || !genre || !releaseYear || !description) {
    throw new ApiError(400, "All fields are required");
  }

  const existingMovie = await Movie.findOne({ title });

  if (existingMovie) {
    throw new ApiError(400, "A movie with this title already exists");
  }


  const newMovie = await Movie.create(
    { title, director, genre, releaseYear, description }
  );

  return res.status(201)
    .json(new ApiResponse(201, { newMovie }, "Movie Added successfully"));
});


const updateMovie = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies']
  const movieId = req.params.id;

  const {
    title, director, genre, releaseYear, description
  } = req.body;

  const movie = await Movie.findByIdAndUpdate(
    movieId,
    { title, director, genre, releaseYear, description },
    { new: true }
  );

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  return res.status(200)
    .json(new ApiResponse(200, { movie }, "Movie updated successfully"));
});

const deleteMovie = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies']

  const movieId = req.params.id;

  const movie = await Movie.findByIdAndDelete(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  return res.status(200)
    .json(new ApiResponse(200, {}, "Movie deleted successfully"));
});

const getMovieDetails = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies']

  const movieId = req.params.id;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }


  return res.status(200)
    .json(new ApiResponse(200, { movie }, "Movie details retrieved successfully"));
});

const listMovies = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies']

  // const movies = await Movie.find({}).select("");
  const movies = await Movie.find(
    {},
    { __v: 0, createdAt: 0, updatedAt: 0 }
  );

  return res.status(200)
    .json(new ApiResponse(200, movies, "List of movies retrieved successfully"));
});

// Ratings and Reviews

const rateAndReviewMovie = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies -  Ratings and Reviews']

  const movieId = req.params.id;
  const userId = req.userId;
  const { rating, text } = req.body;

  if (!rating || rating < 0 || rating > 5) {
    throw new ApiError(400, "Invalid rating. Rating must be between 0 and 5.");
  }

  // const existingReview = await Movie.findOne({
  //   _id: movieId,
  //   'reviews.user': userId
  // });

  // if (existingReview) {
  //   throw new ApiError(400, "You have already reviewed this movie.");
  // }

  const movie = await Movie.findByIdAndUpdate(
    movieId,
    { $push: { reviews: { user: userId, rating, text } } },
    { new: true }
  );

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }
  const reviews = movie.reviews


  return res.status(201)
    .json(new ApiResponse(201, movie, "Review added successfully"));
});


const updateReview = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies -  Ratings and Reviews']

  const { movieId, reviewId } = req.params;
  const { rating, text } = req.body;

  if (!rating || !text || rating < 0 || rating > 5) {
    throw new ApiError(400, "Invalid rating. Rating must be between 0 and 5.");
  }

  const movie = await Movie.findOneAndUpdate(
    { _id: movieId, "reviews._id": reviewId },
    { $set: { "reviews.$.rating": rating, "reviews.$.text": text } },
    { new: true }
  );


  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const reviews = movie.reviews


  return res.status(200)
    .json(new ApiResponse(200, { reviews }, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies -  Ratings and Reviews']

  const { movieId, reviewId } = req.params;

  const movie = await Movie.findByIdAndUpdate(
    movieId,
    { $pull: { reviews: { _id: reviewId } } },
    { new: true }
  );

  if (!movie) {
    throw new ApiError(404, "Review not found");
  }

  return res.status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

const listReviews = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies -  Ratings and Reviews']

  const movieId = req.params.id;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  return res.status(200)
    .json(new ApiResponse(200, movie.reviews, "List of reviews retrieved successfully"));
});

const averageRating = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Movies -  Ratings and Reviews']

  const movieId = req.params.id;

  if (!movieId) {
    throw new ApiError(404, "MovieId not found");
  }

  const movie = await Movie.findById(movieId);

  console.log(movie);

  if (!movie || !movie.reviews || movie.reviews.length === 0) {
    throw new ApiError(404, "Movie not found or no ratings available");
  }

  const totalRating: number = movie.reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
  const averageRating: number = totalRating / movie.reviews.length;

  return res.status(200).json(new ApiResponse(200, { averageRating }, "Average rating calculated successfully"));
});



export {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovieDetails,
  listMovies,


  rateAndReviewMovie,
  updateReview,
  deleteReview,
  listReviews,
  averageRating,
}