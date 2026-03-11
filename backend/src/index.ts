import "dotenv/config";
import express from "express";
import prisma from "../lib/db.js";

const app = express();
const PORT = 4000;

app.use(express.json());



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});