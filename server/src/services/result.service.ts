import { prisma } from "../lib/prisma";
import { calculateResults } from "../utils/resultCalculator";

export const getDecisionResults = async (decisionId: string) => {
  const decision = await prisma.decision.findUnique({
    where: { id: decisionId },
    include: {
      criteria: true,
      options: {
        include: {
          scores: true,
        },
      },
    },
  });

  if (!decision) return null;

  return {
    decisionId: decision.id,
    decisionTitle: decision.title,
    ...calculateResults(decision.options, decision.criteria),
  };
};