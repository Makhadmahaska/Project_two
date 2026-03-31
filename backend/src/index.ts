import "dotenv/config";
import express from "express";
import cors from "cors";

import gamesRouter from "./routes/games.js";
import usersRouter from "./routes/user.js";
import sessionsRouter from "./routes/session.js";
import statsRouter from "./routes/stats.js";

const app = express();

const PORT = Number(process.env.PORT ?? 4004);

const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedLocalOrigin(origin: string) {
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || isAllowedLocalOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRouter);
app.use("/games", gamesRouter);
app.use("/sessions", sessionsRouter);
app.use("/stats", statsRouter);

app.use((error: unknown, _req: express.Request, res: express.Response) => {
  console.error(error);

  res.status(500).json({
    message: error instanceof Error ? error.message : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});