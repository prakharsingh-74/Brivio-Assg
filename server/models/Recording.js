// server/models/recordingModel.js
const mongoose = require("mongoose");

const RecordingSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    title: { type: String, default: "" },
    summary: { type: String, default: "" },
    transcription: { type: String, default: "" },
    fileUrl: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["processing", "completed"], 
      default: "processing" 
    },
    durationSec: { type: Number },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Recording", RecordingSchema);
