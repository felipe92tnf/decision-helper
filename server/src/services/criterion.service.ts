import { prisma } from "../lib/prisma";

export const createCriterion = async (
  decisionId: string,
  data: { name: string; weight: number }
) => {
  return prisma.criterion.create({
    data: {
      name: data.name,
      weight: data.weight,
      decisionId,
    },
  });
};

export const updateCriterion = async (
  id: string,
  data: { name?: string; weight?: number }
) => {
  return prisma.criterion.update({
    where: { id },
    data,
  });
};

export const deleteCriterion = async (id: string) => {
  return prisma.criterion.delete({
    where: { id },
  });
};