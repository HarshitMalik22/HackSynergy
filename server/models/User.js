import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phoneNo: {
      type: String,
    },

    about:{
      type:String,
    },

    languages:{
      type:[String],
      enum:["English","Spanish","German","French","Japanese"],
    },

    technicalSkills:{
      type:[String],

    },

    tools:{
      type:[String]
    },

    domain:{
      type:[String]
    },

    githubLink:{
      type:String,
    },

    linkedinLink:{
      type:String,
    }


  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
