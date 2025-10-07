import { GoogleGenAI } from "@google/genai";

export async function analyzeActivity(activities: any[]): Promise<any> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });
  try {
    const completion = ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI verifier for **VeloChain**, a blockchain-powered "cycle-to-earn" platform.

              You will receive multiple Strava activity records in JSON format. 
              For each record, return a score from **0–100** representing **human effort** and **environmental benefit**.
              
              Rules:
              - If activity data looks unrealistic (e.g. too high/low speed, too short, or bot-like), return **score: 0**.
              - Do not skip or reorder activities — return one result per input.
              - Only include **id** and **score** in the response.
              - Return valid JSON only.`,
            },
          ],
        },
      ],
    });

    const response = await completion.sendMessage({
      message: JSON.stringify(activities, null, 2),
    });

    console.log("AI response:", response.text);
    if (!response.text) {
      return [];
    }
    return JSON.parse(
      response.text.replace(/^```json\n/, "").replace(/\n```$/, "")
    );
  } catch (error) {
    console.error("AI status analysis failed:", error);

    // MODIFIED: Fallback never returns "completed" for staff
    return [];
  }
}
