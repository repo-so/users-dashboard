import express from 'express';
import cors from "cors";
import usersRoute from './routes/users';

import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
    })); 

app.use(express.json());


const MONGO_URI = process.env.MONGO_URI as string; // local db
  if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
  }

    async function connectToDB() {
      try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");
      } catch (err) {
        console.error("MongoDB connection error:", err);
      }
    }

connectToDB();

app.use('/users', usersRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
