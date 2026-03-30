import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);