import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const getUserController = async(req,res)=>{

   try{

        const token = req?.headers?.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const userID = decodedToken.id;

        const existingUser = await User.findById(userID);

        if(!existingUser){
            return res.status(404).json({message:"Profile not found. Please signup!"});
        }

        return res.status(201).json({message:"Profile fetched successfully", success:true, data: existingUser});

   }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}