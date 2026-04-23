import { Request, Response } from "express";
import * as optionService from "../services/option.service";

export const createOption = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const { decisionId } = req.params;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const option = await optionService.createOption(decisionId, {
      name,
      description,
    });

    res.status(201).json(option);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la opción", error });
  }
};

export const updateOption = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const updatedOption = await optionService.updateOption(id, {
      name,
      description,
    });

    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la opción", error });
  }
};

export const deleteOption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await optionService.deleteOption(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la opción", error });
  }
};