import { validationResult } from "express-validator";
import Team from "../models/Teams.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Teams from "../models/Teams.js";

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
    const id = jwt.verify(token,process.env.JWT_SECRET);

    
    const { teamName, techStack, description } = req.body;
    
    const user = await User.findById(id.id);

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    const memberID = id.id;

    const existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const newTeam = new Team({
      teamName,
      description,
      techStack,
      members: [memberID],  
    });

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

export const addTeammate = async(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({message:"Error in Validation of email"});
  }

  try{
    if(!req.headers || !req.headers.authorization){
      return res.status(401).json({message:"Unauthorized"});
    }
    
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const teamLeaderId = decodedToken.id;

    const {email} = req.body;

    // Find the team where the requesting user is the first member (team leader)
    const team = await Team.findOne({ members: { $elemMatch: { $eq: teamLeaderId } } });
    
    if(!team){
      return res.status(404).json({message:"Team not found or you are not the team leader"});
    }

    // Check if the requesting user is the first member (team leader)
    if(team.members[0].toString() !== teamLeaderId.toString()){
      return res.status(403).json({message:"Only team leader can add members"});
    }

    // Find the user to be added
    const newMember = await User.findOne({email});
    if(!newMember){
      return res.status(404).json({message:"User not found"});
    }

    // Check if user is already a member
    if(team.members.includes(newMember._id)){
      return res.status(400).json({message:"User is already a member of this team"});
    }

    // Add the new member to the team
    team.members.push(newMember._id);
    team.memberCount = team.members.length;
    await team.save();

    return res.status(200).json({
      message: "Teammate added successfully",
      success: true,
      data: team
    });

  }catch(err){
    console.error(err);
    return res.status(500).json({message:"Internal Server Error"});
  }
}


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