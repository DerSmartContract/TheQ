"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizePrompt = optimizePrompt;
const zod_1 = require("zod");
// Validierung für Prompts
const promptSchema = zod_1.z.string().min(5, "Die Anfrage muss mindestens 5 Zeichen enthalten.");
function optimizePrompt(userInput) {
    const result = promptSchema.safeParse(userInput);
    if (!result.success) {
        return "Bitte stelle eine genauere Frage!";
    }
    return `Gib eine präzise, fundierte Antwort auf die folgende Frage: ${userInput.trim()}`;
}
