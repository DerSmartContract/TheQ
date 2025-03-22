"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const promptOptimizer_1 = require("./promptOptimizer");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config(); // Lädt Umgebungsvariablen
const LLM_API_URL = process.env.LLM_API_URL || "http://localhost:8080/generate";
const server = new mcp_js_1.McpServer({
    name: "Optimized LLM Service",
    version: "1.0.0",
});
// ✅ MCP benötigt ein einfaches `ZodRawShape`
server.tool("getOptimizedResponse", { query: zod_1.z.string() }, // MCP akzeptiert KEINE `ZodObject`
async (args) => {
    const query = args.query; // ✅ Jetzt existiert query sicher
    if (!query) {
        return {
            content: [
                {
                    type: "text",
                    text: "Fehlende Anfrage. Bitte gib eine Frage ein.",
                },
            ],
        };
    }
    const optimizedQuery = (0, promptOptimizer_1.optimizePrompt)(query);
    try {
        const response = await axios_1.default.post(LLM_API_URL, {
            prompt: optimizedQuery,
            max_tokens: 100,
        });
        return {
            content: [
                {
                    type: "text",
                    text: response.data.text,
                },
            ],
        };
    }
    catch (error) {
        console.error("❌ Fehler bei der Anfrage an LLM Studio:", error);
        return {
            content: [
                {
                    type: "text",
                    text: "Fehler bei der Anfrage an LLM Studio. Bitte später versuchen.",
                },
            ],
        };
    }
});
async function startServer() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.log("✅ Server läuft und ist verbunden!");
}
startServer().catch(console.error);
