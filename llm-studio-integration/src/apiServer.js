"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)(); // ✅ Explizite Typisierung
app.use(express_1.default.json());
const PORT = process.env.PORT || 8080;
app.post("/generate", async (req, res) => {
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
