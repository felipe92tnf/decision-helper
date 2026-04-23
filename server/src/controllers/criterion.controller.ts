import { Request, Response } from "express";
import * as criterionService from "../services/criterion.service";

export const createCriterion = async (req: Request, res: Response) => {
  try {
    const { name, weight } = req.body;
    const { decisionId } = req.params;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    if (typeof weight !== "number") {
      return res.status(400).json({ message: "El peso debe ser un número" });
    }

    const criterion = await criterionService.createCriterion(decisionId, {
      name,
      weight,
    });

    res.status(201).json(criterion);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el criterio", error });
  }
};

export const updateCriterion = async (req: Request, res: Response) => {
  try {
    const { name, weight } = req.body;
    const { id } = req.params;

    const updatedCriterion = await criterionService.updateCriterion(id, {
      name,
      weight,
    });

    res.json(updatedCriterion);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el criterio", error });
  }
};

export const deleteCriterion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await criterionService.deleteCriterion(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el criterio", error });
  }
};