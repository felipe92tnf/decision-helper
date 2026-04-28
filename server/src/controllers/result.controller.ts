import { Request, Response } from "express";
import * as resultService from "../services/result.service";

export const getDecisionResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const results = await resultService.getDecisionResults(id);

    if (!results) {
      return res.status(404).json({ message: "Decisión no encontrada" });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error al calcular resultados",
      error,
    });
  }
};