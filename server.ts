import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
}

// API Endpoints
app.post("/api/chat", async (req: any, res: any) => {
  if (!ai) {
    return res.status(503).json({ error: "Gemini API is not configured yet. Please add your GEMINI_API_KEY in Settings > Secrets." });
  }
  try {
    const { messages, systemInstruction } = req.body;
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : m.role === "model" ? "model" : "user",
      parts: [{ text: m.content || "" }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: systemInstruction || "You are Mentra, a thoughtful, professional, and supportive AI companion for software developers and technology learners. You help them learn tech, review code, brainstorm, check in on goals, handle stress, and stay motivated. Keep responses elegant, structured, helpful, and technically accurate. Limit responses to 150 words.",
      }
    });

    res.json({ text: response.text || "I am here to support you!" });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI Companion" });
  }
});

app.post("/api/code-review", async (req: any, res: any) => {
  if (!ai) {
    return res.status(503).json({ error: "Gemini API is not configured yet. Please add your GEMINI_API_KEY in Settings > Secrets." });
  }
  try {
    const { code, challengeTitle, difficulty, language } = req.body;
    const prompt = `Review this solution in ${language} for the challenge "${challengeTitle}" (Difficulty: ${difficulty}):\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide constructive feedback in clean Markdown formatting. Highlight:
- Time & Space Complexity (using big O)
- Performance & style optimizations
- One specific improvement suggestion.
Keep it concise, encouraging, and extremely expert.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Mentra Code Mentor, an elite technical interviewer and tech lead. You review code with absolute precision, encouraging tone, and clear insights.",
      }
    });

    res.json({ text: response.text || "Code review completed." });
  } catch (error: any) {
    console.error("Code Review API error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI Code Review" });
  }
});

// Vite Integration
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
