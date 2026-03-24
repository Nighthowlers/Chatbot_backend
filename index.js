import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatbotRoutes from './routes/chatbot.route.js';
import cors from 'cors';  

dotenv.config()
const app=express();



// Middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// to check if backend is running
app.get('/', (req, res) => {
  res.send("Backend is running");
});
// chatbot routes
app.use('/bot/v1/', chatbotRoutes);

// Start server ONLY after DB connects
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");

    app.listen(port, () => {
      console.log(`The app is running on port: ${port}`);
    });

  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

startServer();