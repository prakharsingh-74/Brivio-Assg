const fs = require("fs");
const { createClient } = require("@deepgram/sdk");
const OpenAI = require("openai");
const Recording = require("../models/Recording");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Utility: format duration in mm:ss
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Process a recording
const processRecording = async (recording) => {
  try {
    let audioBuffer;

    if (recording.buffer) {
      audioBuffer = recording.buffer;
    } else if (recording.path) {
      audioBuffer = fs.readFileSync(recording.path);
    } else {
      throw new Error("No audio buffer or path provided to processRecording");
    }

    const transcription = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      { model: "nova-2", language: "en" }
    );

    // Step 3: Save transcript + summary in MongoDB
    const newRecording = new Recording({
      filename: recording.filename,
      duration: formatDuration(transcription.metadata?.duration || 0),
      transcription: transcriptText,
      summary,
      createdAt: new Date(),
    });

    await newRecording.save();

    return newRecording;
  } catch (error) {
    console.error("Error processing recording:", error.message);
    throw error;
  }
};

// Controller: Get all recordings
const getRecordings = async (req, res) => {
  try {
    const recordings = await Recording.find().sort({ createdAt: -1 });
    res.json(recordings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recordings" });
  }
};

// Controller: Get single recording by ID
const getRecordingById = async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);
    if (!recording) return res.status(404).json({ error: "Recording not found" });
    res.json(recording);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recording" });
  }
};

module.exports = {
  processRecording,
  getRecordings,
  getRecordingById,
};
