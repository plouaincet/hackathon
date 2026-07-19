import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const model = process.env.HF_MODEL || "Qwen/Qwen2.5-1.5B-Instruct:featherless-ai";

        const response = await client.chat.completions.create({
            model,
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            temperature: 0.8,
            max_tokens: 180,
        });

        const content = response?.choices?.[0]?.message?.content || "";

        res.json({
            choices: [
                {
                    message: {
                        content,
                    },
                },
            ],
        });
    } catch (err) {
        console.error("Hugging Face request failed:", err);
        res.status(500).json({ error: err.message || "Something went wrong" });
    }
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});