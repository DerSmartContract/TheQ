import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.post("/generate", async (req: Request, res: Response) => {  // ✅ Richtige Typisierung
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Fehlende Anfrage" });
    }

    return res.json({
        content: [{ type: "text", text: `Das Wetter in ${query} ist sonnig! ☀️` }]
    });
});

app.listen(PORT, () => {
    console.log(`✅ API läuft auf http://localhost:${PORT}`);
});
