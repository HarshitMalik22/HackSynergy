import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUserController } from "../controllers/user-controllers.js";
const router = express();

// get the profile for the specific user.
router.get("/getUser", authMiddleware, getUserController);



export default router;
