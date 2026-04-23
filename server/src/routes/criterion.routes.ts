import { Router } from "express";
import {
  createCriterion,
  updateCriterion,
  deleteCriterion,
} from "../controllers/criterion.controller";

const router = Router();

router.post("/decisions/:decisionId/criteria", createCriterion);
router.put("/criteria/:id", updateCriterion);
router.delete("/criteria/:id", deleteCriterion);

export default router;