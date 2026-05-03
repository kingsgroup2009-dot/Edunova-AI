const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_API_KEY_HERE";

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    let systemPrompt = "You are a helpful AI tutor.";

    // 🧠 SMART MODE DETECTION
    if (userMessage.toLowerCase().includes("quiz")) {
      systemPrompt =
        "You are a smart teacher. Create quiz with questions, 4 options and correct answers clearly.";
    } else if (
      userMessage.toLowerCase().includes("explain") ||
      userMessage.length > 100
    ) {
      systemPrompt =
        "You are a teacher. Explain the given text in very simple words for students. Use examples.";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No response from AI 😢";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error 😢" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});