import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  timeout: 30000 // 30 second timeout
});

export const getAIResponse = async (messages) => {
  try {
    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY not configured");
      return null;
    }

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("AI Service Error:", error.message || error);
    return null; // important for fallback
  }
};