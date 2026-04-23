import { Request, Response } from "express";
import * as decisionService from "../services/decision.service";

export const getDecisions = async (_req: Request, res: Response) => {
  const decisions = await decisionService.getAllDecisions();
  res.json(decisions);
};

export const getDecision = async (req: Request, res: Response) => {
  const decision = await decisionService.getDecisionById(req.params.id);

  if (!decision) {
    return res.status(404).json({ message: "Decisión no encontrada" });
  }

  res.json(decision);
};

export const createDecision = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "El título es obligatorio" });
  }

  const decision = await decisionService.createDecision({
    title,
    description,
  });

  res.status(201).json(decision);
};

export const updateDecision = async (req: Request, res: Response) => {
  const updatedDecision = await decisionService.updateDecision(
    req.params.id,
    req.body
  );

  res.json(updatedDecision);
};

export const deleteDecision = async (req: Request, res: Response) => {
  await decisionService.deleteDecision(req.params.id);
  res.status(204).send();
};