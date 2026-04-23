import { prisma } from "../lib/prisma";

export const createOption = async (
  decisionId: string,
  data: { name: string; description?: string }
) => {
  return prisma.option.create({
    data: {
      name: data.name,
      description: data.description,
      decisionId,
    },
  });
};

export const updateOption = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  return prisma.option.update({
    where: { id },
    data,
  });
};

export const deleteOption = async (id: string) => {
  return prisma.option.delete({
    where: { id },
  });
};