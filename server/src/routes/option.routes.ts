import { Router } from "express";
import {
  createOption,
  updateOption,
  deleteOption,
} from "../controllers/option.controller";

const router = Router();

router.post("/decisions/:decisionId/options", createOption);
router.put("/options/:id", updateOption);
router.delete("/options/:id", deleteOption);

export default router;