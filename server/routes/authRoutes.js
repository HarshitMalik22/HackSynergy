import express from "express";
import dotenv from "dotenv";
import { check } from "express-validator";
import {
  loginController,
  logoutController,
  signUpController,
} from "../controllers/auth-controllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express();
dotenv.config();

// Signup Route
router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name should be atleast 3 characters")
      .notEmpty()
      .withMessage("Please enter your full name"),
    check("email")
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .withMessage("Please enter a valid email address")
      .notEmpty()
      .withMessage("Please enter your email address"),

    check("password")
      .isLength({ min: 3 })
      .withMessage("Password should be at least 3 characters long")
      .notEmpty()
      .withMessage("Please enter your password"),
  ],
  signUpController
);

// Login Route

router.post(
  "/login",
  [
    check("email")
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .withMessage("Please enter a valid email address")
      .notEmpty()
      .withMessage("Please enter your email address"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("Password should be at least 3 characters long")
      .notEmpty()
      .withMessage("Please enter your password"),
  ],
  loginController
);

// Logout Route
router.post("/logout", authMiddleware, logoutController);

export default router;
