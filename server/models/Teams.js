import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {

    teamName: {
      type: String,
      required: true,
      unique: true,
    },

    memberCount: {
      type: Number,
      default: 0,
    },

    members:
    
    [{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    
    }],

    techStack: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
