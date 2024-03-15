import { Router } from "express";

const router = Router();

import {
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
} from "../controllers/movie.controller";


import verifyToken from "../middleware/auth.middleware";


// Movies
router.post('/', verifyToken, addMovie);

router.put('/:id', verifyToken, updateMovie);

router.delete('/:id', verifyToken, deleteMovie);

router.get('/:id', getMovieDetails);

router.get('/', listMovies);

// Ratings and Reviews


router.post('/:id/reviews', verifyToken, rateAndReviewMovie);

router.put('/:movieId/reviews/:reviewId', updateReview);

router.delete('/:movieId/reviews/:reviewId', deleteReview);

router.get('/:id/reviews', listReviews);

router.get('/:id/averageRating', averageRating);

export default router;


