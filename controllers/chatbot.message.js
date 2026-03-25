import User from "../models/user.model.js";
import Bot from "../models/bot.model.js";
import OpenAI from "openai";


export const Message=async(req,res)=>{
try {
    const {text}= req.body;
    if(!text?.trim()){
        return res.status(400).json({error:"Text cannot be empty"});
    }
 const user= await User.create({
        sender:"user",
        text
    })
    const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const aiResponse = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful chatbot." },
    { role: "user", content: text }
  ]
});

const Response = aiResponse.choices[0].message.content;
 
if (!Response) {
  return res.status(500).json({ error: "AI failed" });
}

const bot = await Bot.create({
    text :Response,
    sender:"bot"
})

return res.status(200).json({
    userMessage:user.text,
    botMessage:bot.text
})
}
   catch (error){
    console.error("Error processing message:", error);
    return res.status(500).json({error:"An error occurred while processing your message"});

}

}