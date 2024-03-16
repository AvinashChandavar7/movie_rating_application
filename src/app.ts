import express from 'express';
import cors from 'cors';
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from 'path';


import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./json/swagger_output.json";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

import userRoutes from "./routes/users.routes"
import movieRoutes from "./routes/movies.routes"

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/movies", movieRoutes)


const options = { explorer: true, }
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput, options));


export { app };