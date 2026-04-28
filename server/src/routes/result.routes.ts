import { Router } from "express";
import { getDecisionResults } from "../controllers/result.controller";

const router = Router();

router.get("/decisions/:id/results", getDecisionResults);

export default router;