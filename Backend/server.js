const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Forum API KADA Is Running!",
  });
});

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

// Server Running
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});