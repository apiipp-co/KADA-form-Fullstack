const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors"); // Ditulis konsisten menggunakan require
const connectDB = require("./config/db");
const Post = require("./models/Post");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const PORT = process.env.PORT || 5002;

app.use(express.json());

// Konfigurasi CORS agar mengizinkan Frontend Vite kamu mengakses API ini
app.use(cors({
  origin: "http://localhost:5173", // Port default jalannya Frontend Vite
  credentials: true
}));

// Call the Database
connectDB();

// Endpoint home - Health Check
app.get("/", (req, res) => {
  res.send({ message: "Forum API KADA Is Running!" });
});

app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log("Port is running on ", PORT);
});