

import { Router } from 'express';
import prisma from "../../lib/db.js";
const router = Router();

router.get('/', async (_req, res) => {
  const games = await prisma.game.findMany({ orderBy: { name: 'asc' } });
  res.json(games);
});

export default router;