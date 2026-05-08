import { prisma } from "../lib/prisma.js";

export const getAllDecisions = async () => {
  return prisma.decision.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getDecisionById = async (id: string) => {
  return prisma.decision.findUnique({
    where: { id },
    include: {
      criteria: true,
      options: {
        include: {
          scores: true,
        },
      },
    },
  });
};

export const createDecision = async (data: {
  title: string;
  description?: string;
}) => {
  return prisma.decision.create({
    data,
  });
};

export const deleteDecision = async (id: string) => {
  return prisma.decision.delete({
    where: { id },
  });
};