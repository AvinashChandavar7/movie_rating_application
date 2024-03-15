import { NextFunction, Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse";
import jwt, { JwtPayload } from "jsonwebtoken";


declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_Token"];

  if (!token) {
    return res.status(401).json(new ApiResponse(401, "Un-Authorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);

    req.userId = (decoded as JwtPayload).userId;

    next();

  } catch (error) {
    return res.status(401).json(new ApiResponse(401, "unauthorized"));
  }
}

export default verifyToken;