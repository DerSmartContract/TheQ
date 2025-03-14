import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { optimizePrompt } from "./promptOptimizer";
import axios from "axios";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();  // Lädt Umgebungsvariablen

const LLM_API_URL = process.env.LLM_API_URL || "http://localhost:8080/generate";

const server = new McpServer({
    name: "Optimized LLM Service",
    version: "1.0.0",
});

// ✅ MCP benötigt ein einfaches `ZodRawShape`
server.tool(
    "getOptimizedResponse",
    { query: z.string() },  // MCP akzeptiert KEINE `ZodObject`
    async (args: { query: string }) => {  // **Explizite Typisierung**
        const query = args.query;  // ✅ Jetzt existiert query sicher

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

        const optimizedQuery = optimizePrompt(query);

        try {
            const response = await axios.post(LLM_API_URL, {
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
        } catch (error) {
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
    }
);

async function startServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("✅ Server läuft und ist verbunden!");
}

startServer().catch(console.error);
