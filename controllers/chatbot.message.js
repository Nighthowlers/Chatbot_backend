
import Chat from "../models/chat.model.js";
import { getAIResponse } from "../services/ai.service.js";

export const Message = async (req, res) => {
  try {
    const { text,mode } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }

    // Save user message
    await Chat.create({
      sender: "user",
      text
    });

    // Build conversation memory
    const history = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(6);

    // system prompt
    const systemPrompt =
  mode === "interview"
    ? "You are an expert interviewer helping candidates prepare."
    : mode === "coding"
    ? "You are a senior software engineer helping with coding."
    : "You are a helpful chatbot.";
    
    const messages = [
      { role: "system", content: systemPrompt },

      ...history.reverse().map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      })),

      { role: "user", content: text }
    ];

    //  AI call
    let Response = await getAIResponse(messages);

    // Fallback system (VERY IMPORTANT)
    if (!Response) {
      Response = "AI is currently unavailable. Please try again later.";
    }

    // Save bot response
    await Chat.create({
      sender: "assistant",
      text: Response
    });

    return res.status(200).json({
      userMessage: text,
      botMessage: Response
    });

  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};