import express from "express";
import BollywoodNews from "../models/bollywoodNews.js";

const router = express.Router();

// ✅ Test route to create 1 Bollywood article
router.post("/add-test", async (req, res) => {
  try {
    const article = new BollywoodNews({
      title: "Test Bollywood News",
      slug: "test-bollywood-news",
      content: "This is just a test article for Bollywood collection.",
      excerpt: "This is a short test excerpt.",
      author: {
        id: "66dff02e7f39a93d2c1b1234", // any ObjectId string for now
        name: "Test Author"
      },
      category: "Bollywood",
      tags: ["Test", "Bollywood"]
    });

    await article.save(); // 🔹 This creates the collection
    res.status(201).json({ message: "Bollywood collection created!", article });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
