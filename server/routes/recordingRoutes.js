const express = require("express");
const path = require("path");
const multer = require("multer");
const Recording = require("../models/Recording");
const { protect } = require("../middlewares/authMiddleware");
const { processRecording } = require("../controllers/recordingController");

const router = express.Router();

// Local storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "audio/mpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only MP3 files are allowed."));
    }
  },
});

// Upload a new recording (MP3 only)
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Only MP3 files are allowed." });
    }

    const processing = await Recording.findOne({
      userId: req.user.id,
      status: "processing",
    });
    if (processing) {
      return res
        .status(400)
        .json({ message: "A recording is already being processed." });
    }

    const recording = await Recording.create({
      userId: req.user.id,
      fileUrl: path.join(__dirname, "../uploads", req.file.filename), // ✅ always gives full path
      status: "processing",
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({
        id: recording._id,
        message: "Recording uploaded and processing started.",
      });

    // Start processing in background
    setImmediate(() => processRecording(recording)); // ✅ now works
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get paginated recordings for user
router.get("/", protect, async (req, res) => {
  try {
    const { cursor, limit = 20 } = req.query;
    const query = { userId: req.user.id, status: "completed" };
    const options = {
      sort: { createdAt: -1 },
      limit: parseInt(limit),
      ...(cursor && { _id: { $lt: cursor } }),
    };

    const recordings = await Recording.find(query, null, options);
    const nextCursor =
      recordings.length === parseInt(limit)
        ? recordings[recordings.length - 1]._id
        : undefined;

    res.json({ items: recordings, nextCursor });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get status of a recording
router.get("/:id/status", protect, async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!recording) return res.status(404).json({ message: "Not found." });

    res.json({ status: recording.status });
  } catch (err) {
    console.error("Status error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get details of a recording
router.get("/:id", protect, async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!recording) return res.status(404).json({ message: "Not found." });

    res.json(recording);
  } catch (err) {
    console.error("Detail error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
