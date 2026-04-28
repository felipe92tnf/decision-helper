export const calculateResults = (options: any[], criteria: any[]) => {
    const ranking = options
      .map((option) => {
        const totalScore = criteria.reduce((sum, criterion) => {
          const score = option.scores.find(
            (s: any) => s.criterionId === criterion.id
          );
  
          if (!score) return sum;
  
          return sum + score.value * criterion.weight;
        }, 0);
  
        return {
          id: option.id,
          name: option.name,
          totalScore,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  
    return {
      recommendedOption: ranking[0] || null,
      ranking,
    };
  };