import { prisma } from "../lib/prisma";

export const createScore = async (
  optionId: string,
  data: { criterionId: string; value: number }
) => {
  return prisma.score.create({
    data: {
      value: data.value,
      optionId,
      criterionId: data.criterionId,
    },
  });
};