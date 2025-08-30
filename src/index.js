import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import BollywoodNews from "./models/bollywoodNews.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Rate limiting (to prevent abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Root route
app.get("/", (req, res) => {
  res.send("Bollywood API is running 🚀");
});

// ==================== CATEGORY ROUTES ==================== //

// All news
app.get("/bollywood", async (req, res, next) => {
  try {
    const news = await BollywoodNews.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Trending
app.get("/bollywood/trending", async (req, res, next) => {
  try {
    const news = await BollywoodNews.find({ category: "trending" });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Movies
app.get("/bollywood/movies", async (req, res, next) => {
  try {
    const news = await BollywoodNews.find({ category: "movies" });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Celebrities
app.get("/bollywood/celebrities", async (req, res, next) => {
  try {
    const news = await BollywoodNews.find({ category: "celebrities" });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Box office
app.get("/bollywood/boxoffice", async (req, res, next) => {
  try {
    const news = await BollywoodNews.find({ category: "boxoffice" });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Tags
app.get("/bollywood/tags/:tag", async (req, res, next) => {
  try {
    const news = await BollywoodNews.find({ tags: req.params.tag });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Single news by slug
app.get("/bollywood/:slug", async (req, res, next) => {
  try {
    const news = await BollywoodNews.findOne({ slug: req.params.slug });
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// ==================== CRUD ROUTES ==================== //

// Create news
app.post("/bollywood", async (req, res, next) => {
  try {
    const news = new BollywoodNews(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    next(err);
  }
});

// Update news
app.put("/bollywood/:id", async (req, res, next) => {
  try {
    const news = await BollywoodNews.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Delete news
app.delete("/bollywood/:id", async (req, res, next) => {
  try {
    const news = await BollywoodNews.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted" });
  } catch (err) {
    next(err);
  }
});

// ==================== ERROR HANDLING ==================== //
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// ==================== DATABASE CONNECTION ==================== //
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
  })
  .catch((err) => console.error("MongoDB connection failed ❌", err));

