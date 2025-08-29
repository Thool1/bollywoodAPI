// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import BollywoodNews from "./models/bollywoodNews.js";
import morgan from "morgan";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(morgan("dev")); // logs API calls

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Bollywood News API is running... 🎬");
});

// 👉 Get all Bollywood news
app.get("/bollywood", async (req, res, next) => {
  try {
    const news = await BollywoodNews.find().sort({ publishedAt: -1 });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// 👉 Create new Bollywood news
app.post("/bollywood", async (req, res, next) => {
  try {
    const news = new BollywoodNews(req.body);
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (err) {
    next(err);
  }
});

// 👉 Get single news by slug
app.get("/bollywood/:slug", async (req, res, next) => {
  try {
    const news = await BollywoodNews.findOne({ slug: req.params.slug });
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// 👉 Update news
app.put("/bollywood/:id", async (req, res, next) => {
  try {
    const updatedNews = await BollywoodNews.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedNews) return res.status(404).json({ error: "News not found" });
    res.json(updatedNews);
  } catch (err) {
    next(err);
  }
});

// 👉 Delete news
app.delete("/bollywood/:id", async (req, res, next) => {
  try {
    const deletedNews = await BollywoodNews.findByIdAndDelete(req.params.id);
    if (!deletedNews) return res.status(404).json({ error: "News not found" });
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
