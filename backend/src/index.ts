import "dotenv/config";
import express from "express";
import prisma from "../lib/db.js";
import gamesRouter from "./routes/games.js"
import usersRouter from "./routes/user.js"
import sessionsRouter from "./routes/session.js"
import statsRouter from "./routes/stats.js"
const app = express();
const PORT = 4000;

app.use(express.json());

app.use('/users', usersRouter);
app.use('/games', gamesRouter);
app.use('/sessions', sessionsRouter);
app.use('/stats', statsRouter);









app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});