import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addTeammate, createTeamController, getTeamsController, viewTeamController } from "../controllers/team-controllers.js";
import { check } from "express-validator";
const router = express.Router();

// Get All Teams
router.get("/get-teams", authMiddleware,getTeamsController )

// Get the teams joined by the particular user
router.get("/view-team", authMiddleware, viewTeamController);
// Create a new Team
router.post(
  "/create-team",
  authMiddleware,
  [
    check("teamName").notEmpty().withMessage("Team name cannot be empty"),
    check("techStack")
      .notEmpty()
      .withMessage("Mention at least 3 major technologies you are working on"),
  ],
  createTeamController
);


// Add a new Teammate
router.post("/add-teammate", authMiddleware, [
  check("email").notEmpty().withMessage("Please enter the email of the teammate to add")
],
addTeammate
)


//router.get("/join-team", authMiddleware, joinTeamController);

// team-related routes
export default router;
