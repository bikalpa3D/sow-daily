import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, logout);
router.route("/current-user").get(verifyJwt, getMe);

export default router;
