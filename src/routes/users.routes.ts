import { Router } from "express";

const router = Router();

import {
  registerUser,
  getCurrentUser,
  loginUser,
  tokenValidation,
  logoutUser
} from "../controllers/user.controller";

import verifyToken from "../middleware/auth.middleware";


router.post('/register', registerUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser)

router.get("/validate-token", verifyToken, tokenValidation);
router.get("/current-user", verifyToken, getCurrentUser);


export default router;
