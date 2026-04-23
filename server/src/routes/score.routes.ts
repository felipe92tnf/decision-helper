import { Router } from "express";
import { createScore } from "../controllers/score.controller";

const router = Router();

router.post("/options/:optionId/scores", createScore);

export default router;