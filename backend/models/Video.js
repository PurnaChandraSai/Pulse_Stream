const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    filename: { type: String, required: true }, 
    cloudinaryUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    originalPath: { type: String },
    processedPath: { type: String },
    status: { 
      type: String, 
      enum: ["uploaded", "processing", "safe", "flagged", "failed"],
      default: "safe"
    },
    progress: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
