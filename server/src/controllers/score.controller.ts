import { Request, Response } from "express";
import * as scoreService from "../services/score.service.js";

export const createScore = async (req: Request, res: Response) => {
  try {
    const { optionId } = req.params;
    const { criterionId, value } = req.body;

    if (!criterionId) {
      return res.status(400).json({ message: "criterionId obligatorio" });
    }

    if (typeof value !== "number") {
      return res.status(400).json({ message: "value debe ser número" });
    }

    const score = await scoreService.createOrUpdateScore(optionId as string, {
      criterionId,
      value,
    });

    res.status(201).json(score);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar score", error });
  }
};