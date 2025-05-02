import { validationResult } from "express-validator";
import Team from "../models/Teams.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Teams from "../models/Teams.js";


// CREATE A NEW TEAM
export const createTeamController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Mention all  details " });
  }
  try {

    if(!req.headers || !req.headers.authorization){
      return res.status(401).json({message:"Unauthorized"});
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken =  jwt.verify(token,process.env.JWT_SECRET);

    
    const { leader,teamName, techStack, description, member1,member2 } = req.body;
    
    
    const user = await User.findOne({email:leader});

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    const teammate1 = await User.findOne({email:member1});
    if(!teammate1){
      return res.status(404).json({message:"Teammate 1 doesn't have account"});
    }

    const teammate2 = await User.findOne({email:member2});

    if(!teammate2){
      return req.status(400).json({message:"Teammate 2 doesn't have an account"});
    }

   const memberID = decodedToken.id;

    const existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const newTeam = new Team({
      teamName,
      description,
      techStack,
      leader:user
    });

    const membersArray = [teammate1,teammate2];
    newTeam.members = membersArray;
    newTeam.memberCount=membersArray.length;

    await newTeam.save();

    return res.status(201).json({
      message: "Team created successfullly",
      success: true,
      data: newTeam,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ADD A SINGLE TEAMMATE
export const addTeammateController = async(req,res)=>{

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({message:"Validation Error"});
  }

  try{

    
    

  }catch(err){
    console.error(err);
    return res.status(500).json({message:"Internal Server Error"});
  }
}

// RETURN ALL TEAMS
export const getTeamsController = async(req,res)=>{

  try{

    const teams = await Teams.find();

    if(!teams){
      return res.status(400).json({message:"Error getting teams "});
    }

    return res.status(201).json({message:"Fetch successful", data: teams, success:true});


  }catch(err){
    console.error(err)
      return res.status(500).json({message:"Internal Server Error"});
    
  }
}

/*
export const joinTeamController = async(req,res)=>{

  try{
        if(!req.headers || !req.headers.authorization){
          return res.status(400).json({message:"Unauthorized"});
        }

      
      

        const team = await Team.findById(teamID);
        console.log(userTeam);
  }catch(err){
    console.error(err);
    return res.status(500).json({message:"Internal Server Error"});
  }
}

*/


// VIEW THE TEAMS THAT THE USER IS PART OF
export const viewTeamController = async(req,res)=>{

  try{

      if(!req.headers || !req.headers.authorization){
        return res.status(400).json({message:"Unauthorized"});
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token,process.env.JWT_SECRET);

      const userID = decodedToken.id;

      const userTeams = await Teams.find({members:userID});
      console.log(userTeams);
  }catch(err){  
    console.error(err);
    return res.status(500).json({message:"Internal Server Error"});
  }
}