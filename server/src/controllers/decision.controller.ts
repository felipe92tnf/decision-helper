import { Request, Response } from "express";
import * as decisionService from "../services/decision.service.js";

export const getDecisions = async (
  req: Request,
  res: Response
) => {
  try {
    const decisions =
      await decisionService.getAllDecisions();

    res.json(decisions);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener decisiones",
      error,
    });
  }
};

export const getDecisionById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const decision =
      await decisionService.getDecisionById(id);

    if (!decision) {
      return res.status(404).json({
        message: "Decisión no encontrada",
      });
    }

    res.json(decision);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener decisión",
      error,
    });
  }
};

export const createDecision = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "El título es obligatorio",
      });
    }

    const decision =
      await decisionService.createDecision({
        title,
        description,
      });

    res.status(201).json(decision);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear decisión",
      error,
    });
  }
};

export const deleteDecision = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    await decisionService.deleteDecision(id);

    res.json({
      message:
        "Decisión eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar decisión",
      error,
    });
  }
};