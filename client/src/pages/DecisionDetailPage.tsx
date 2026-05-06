import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Criterion = {
  id: string;
  name: string;
  weight: number;
};

type Option = {
  id: string;
  name: string;
  description?: string;
  scores: {
    id: string;
    value: number;
    criterionId: string;
    optionId: string;
  }[];
};

type Decision = {
  id: string;
  title: string;
  description?: string;
  status: string;
  criteria: Criterion[];
  options: Option[];
};

type Results = {
  recommendedOption: {
    id: string;
    name: string;
    totalScore: number;
  } | null;
  ranking: {
    id: string;
    name: string;
    totalScore: number;
  }[];
};

export default function DecisionDetailPage() {
  const { id } = useParams();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDecision = () => {
    fetch(`http://localhost:3000/api/decisions/${id}`)
      .then((res) => res.json())
      .then((data) => setDecision(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const loadResults = () => {
    fetch(`http://localhost:3000/api/decisions/${id}/results`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadDecision();
    loadResults();
  }, [id]);

  if (loading) return <p style={{ padding: "30px" }}>Cargando detalle...</p>;
  if (!decision) return <p>Decisión no encontrada</p>;

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "900px" }}>
      <Link to="/">← Volver</Link>

      <h1>{decision.title}</h1>
      <p>{decision.description}</p>

      <h2>Criterios</h2>
      {decision.criteria.map((criterion) => (
        <div key={criterion.id}>
          {criterion.name} - peso {criterion.weight}
        </div>
      ))}

      <h2>Opciones</h2>
      {decision.options.map((option) => (
        <div
          key={option.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginTop: "10px",
            borderRadius: "10px",
          }}
        >
          <h3>{option.name}</h3>
          <p>{option.description}</p>

          <h4>Puntuaciones</h4>
          {option.scores.length === 0 ? (
            <p>Sin puntuaciones todavía.</p>
          ) : (
            option.scores.map((score) => {
              const criterion = decision.criteria.find(
                (c) => c.id === score.criterionId
              );

              return (
                <p key={score.id}>
                  {criterion?.name}: {score.value}
                </p>
              );
            })
          )}
        </div>
      ))}

      <h2>Resultado</h2>

      {results?.recommendedOption ? (
        <div
          style={{
            border: "2px solid green",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <strong>Opción recomendada:</strong>{" "}
          {results.recommendedOption.name} con{" "}
          {results.recommendedOption.totalScore} puntos
        </div>
      ) : (
        <p>Todavía no hay resultado.</p>
      )}

      <h3>Ranking</h3>
      {results?.ranking.map((item, index) => (
        <p key={item.id}>
          {index + 1}. {item.name} - {item.totalScore} puntos
        </p>
      ))}
    </div>
  );
}