require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const recordingRoutes = require('./routes/recordingRoutes');
const { protect } = require("./middlewares/authMiddleware");

const app = express();

//middleware to handle cors
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

connectDB()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/recordings', recordingRoutes);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})