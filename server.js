import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await axios.post(
            "https://api.fireworks.ai/inference/v1/chat/completions",
            {
                model: "accounts/fireworks/models/deepseek-v4-pro",
                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
                reasoning_effort: "none",
                max_tokens: 180,
                temperature: 0.8,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});