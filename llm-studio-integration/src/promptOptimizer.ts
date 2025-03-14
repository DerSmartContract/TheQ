import { z } from "zod";

// Validierung für Prompts
const promptSchema = z.string().min(5, "Die Anfrage muss mindestens 5 Zeichen enthalten.");

export function optimizePrompt(userInput: string): string {
    const result = promptSchema.safeParse(userInput);
    if (!result.success) {
        return "Bitte stelle eine genauere Frage!";
    }

    return `Gib eine präzise, fundierte Antwort auf die folgende Frage: ${userInput.trim()}`;
}
