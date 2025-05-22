import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import mailRoutes from "./mails/route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.DB_URL;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI environment variable");
  process.exit(1);
}
app.use(express.json());
app.use(cors("*"));
app.use(express.json());
//not using async
// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // exit if connection fails
  }
}
connectDB();
app.use("/api/mail", mailRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
