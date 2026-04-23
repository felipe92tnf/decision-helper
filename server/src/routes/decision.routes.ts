import { Router } from "express";
import {
  getDecisions,
  getDecision,
  createDecision,
  updateDecision,
  deleteDecision,
} from "../controllers/decision.controller";

const router = Router();

router.get("/", getDecisions);
router.get("/:id", getDecision);
router.post("/", createDecision);
router.put("/:id", updateDecision);
router.delete("/:id", deleteDecision);

export default router;