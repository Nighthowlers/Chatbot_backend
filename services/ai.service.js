import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

export const getAIResponse = async (messages) => {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("AI Service Error:", error.message);
    return null; // important for fallback
  }
};