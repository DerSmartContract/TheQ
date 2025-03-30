"use strict";
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const LLM_URL = process.env.LLM_URL || "http://192.168.178.40:1234/v1/chat/completions";

app.post("/generate", async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Fehlende Anfrage" });
    }

    try {
        const response = await axios.post(LLM_URL, {
            model: "deepseek-r1-distill-llama-8b", // oder dein Modellname
            messages: [
                { role: "system", content: "Antworte bitte immer in Reimen. Heute ist Donnerstag." },
                { role: "user", content: query }
            ],
            temperature: 0.7,
            max_tokens: 500,
            stream: false
        });

        const llmText = response.data.choices?.[0]?.message?.content?.trim() || "Keine Antwort vom Modell.";

        return res.json({
            content: [{ type: "text", text: llmText }]
        });
    } catch (error) {
        console.error("❌ Fehler beim LLM-Request:", error.message);
        return res.status(500).json({ error: "LLM-Verbindung fehlgeschlagen." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ API läuft auf http://localhost:${PORT}`);
});