import express from "express";
import hackathonController from "../controllers/hackathonController.js";

const router = express.Router();

// Get all hackathons
router.get("/", hackathonController.getAllHackathons);

// Create a new hackathon
router.post("/", hackathonController.createHackathon);

export default router;