import { prisma } from "../lib/prisma.js";

export const createOrUpdateScore = async (
  optionId: string,
  data: { criterionId: string; value: number }
) => {
  return prisma.score.upsert({
    where: {
      optionId_criterionId: {
        optionId,
        criterionId: data.criterionId,
      },
    },
    update: {
      value: data.value,
    },
    create: {
      value: data.value,
      optionId,
      criterionId: data.criterionId,
    },
  });
};