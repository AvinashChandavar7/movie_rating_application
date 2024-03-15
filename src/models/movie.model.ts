import { Schema, models, model } from "mongoose";

export type MovieReviewType = {
  user: Schema.Types.ObjectId;
  rating: number;
  text: string;
}

export interface MovieType {
  title: string;
  director: string;
  genre: string;
  releaseYear: number;
  description: string;
  reviews: MovieReviewType[];
}

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true, index: true },
    releaseYear: { type: Number, required: true, index: true },
    description: { type: String, required: true },
    reviews: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, min: 0, max: 5 },
      text: { type: String, },
    }],
  },
  { timestamps: true }
);

movieSchema.index({ genre: 1, releaseYear: 1 });

const Movie = models.Movie || model<MovieType>("Movie", movieSchema);

export default Movie;