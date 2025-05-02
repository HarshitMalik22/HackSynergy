import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Blacklist from "../models/Blacklist.js";
import { validationResult } from "express-validator";

export const signUpController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation Error", errors: errors.array() });
  }
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      return res.status(400).json({ message: "Error in hashing password" });
    }

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const user = await User.create(newUser);

    if (!user) {
      return res.status(400).json({ message: "Error in creating user" });
    }

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    if (!token) {
      return res.status(400).json({ message: "Error in generating token" });
    }

    return res
      .status(200)
      .json({ message: "Signup Successful", token: token, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation Error", errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    if (!token) {
      return res.status(400).json({ message: "Error in generating Token" });
    }

    return res
      .status(200)
      .json({ message: "Login Successful", token: token, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutController = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  

    if (!decodedToken) {
      return res.status(400).json({ message: "Couldn't verify the token" });
    }

    const userID = decodedToken.id;

    const blacklistedToken = await Blacklist.create({ token });

    if (!blacklistedToken) {
      return res.status(400).json({ message: "Error in Logout" });
    }

    const deleted = await User.findByIdAndDelete(userID);

    if(!deleted){
      return res.status(400).json({message:"User not found or already deleted"});
    }

    return res
      .status(200)
      .json({ message: "Logout Successful", success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
