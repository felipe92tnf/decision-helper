import { Router } from "express";
import {
  getDecisions,
  getDecisionById,
  createDecision,
  deleteDecision,
} from "../controllers/decision.controller.js";

const router = Router();

router.get("/", getDecisions);

router.get("/:id", getDecisionById);

router.post("/", createDecision);

router.delete("/:id", deleteDecision);

export default router;