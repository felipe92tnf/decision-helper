import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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

  // criterio
  const [criterionName, setCriterionName] = useState("");
  const [criterionWeight, setCriterionWeight] = useState(1);

  // opción
  const [optionName, setOptionName] = useState("");
  const [optionDescription, setOptionDescription] = useState("");

  // score
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [selectedCriterionId, setSelectedCriterionId] = useState("");
  const [scoreValue, setScoreValue] = useState(1);

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

  const refreshPageData = () => {
    loadDecision();
    loadResults();
  };

  useEffect(() => {
    refreshPageData();
  }, [id]);

  // crear criterio
  const handleCreateCriterion = async (event: FormEvent) => {
    event.preventDefault();

    if (!criterionName.trim()) {
      alert("El nombre del criterio es obligatorio");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/decisions/${id}/criteria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: criterionName,
            weight: Number(criterionWeight),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear criterio");
      }

      setCriterionName("");
      setCriterionWeight(1);

      refreshPageData();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear el criterio");
    }
  };

  // crear opción
  const handleCreateOption = async (event: FormEvent) => {
    event.preventDefault();

    if (!optionName.trim()) {
      alert("El nombre de la opción es obligatorio");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/decisions/${id}/options`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: optionName,
            description: optionDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear opción");
      }

      setOptionName("");
      setOptionDescription("");

      refreshPageData();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la opción");
    }
  };

  // crear o actualizar score
  const handleCreateScore = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedOptionId || !selectedCriterionId) {
      alert("Selecciona opción y criterio");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/options/${selectedOptionId}/scores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            criterionId: selectedCriterionId,
            value: Number(scoreValue),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear puntuación");
      }

      setScoreValue(1);

      refreshPageData();
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la puntuación");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando detalle...</p>;
  }

  if (!decision) {
    return <p>Decisión no encontrada</p>;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "900px" }}>
      <Link to="/">← Volver</Link>

      <h1>{decision.title}</h1>

      <p>{decision.description}</p>

      {/* añadir criterio */}
      <section
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h2>Añadir criterio</h2>

        <form onSubmit={handleCreateCriterion}>
          <div style={{ marginBottom: "10px" }}>
            <label>Nombre</label>
            <br />

            <input
              value={criterionName}
              onChange={(event) => setCriterionName(event.target.value)}
              placeholder="Ej: Precio"
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Peso</label>
            <br />

            <input
              type="number"
              min="1"
              max="10"
              value={criterionWeight}
              onChange={(event) =>
                setCriterionWeight(Number(event.target.value))
              }
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>

          <button type="submit">Crear criterio</button>
        </form>
      </section>

      {/* añadir opción */}
      <section
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h2>Añadir opción</h2>

        <form onSubmit={handleCreateOption}>
          <div style={{ marginBottom: "10px" }}>
            <label>Nombre</label>
            <br />

            <input
              value={optionName}
              onChange={(event) => setOptionName(event.target.value)}
              placeholder="Ej: Asus Zenbook"
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Descripción</label>
            <br />

            <textarea
              value={optionDescription}
              onChange={(event) =>
                setOptionDescription(event.target.value)
              }
              placeholder="Ej: 16GB RAM, buena batería"
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>

          <button type="submit">Crear opción</button>
        </form>
      </section>

      {/* añadir score */}
      <section
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h2>Añadir puntuación</h2>

        {decision.options.length === 0 ||
        decision.criteria.length === 0 ? (
          <p>
            Necesitas al menos una opción y un criterio.
          </p>
        ) : (
          <form onSubmit={handleCreateScore}>
            <div style={{ marginBottom: "10px" }}>
              <label>Opción</label>
              <br />

              <select
                value={selectedOptionId}
                onChange={(event) =>
                  setSelectedOptionId(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                }}
              >
                <option value="">
                  Selecciona una opción
                </option>

                {decision.options.map((option) => (
                  <option
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Criterio</label>
              <br />

              <select
                value={selectedCriterionId}
                onChange={(event) =>
                  setSelectedCriterionId(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                }}
              >
                <option value="">
                  Selecciona un criterio
                </option>

                {decision.criteria.map((criterion) => (
                  <option
                    key={criterion.id}
                    value={criterion.id}
                  >
                    {criterion.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Puntuación</label>
              <br />

              <input
                type="number"
                min="1"
                max="10"
                value={scoreValue}
                onChange={(event) =>
                  setScoreValue(Number(event.target.value))
                }
                style={{
                  width: "100%",
                  padding: "10px",
                }}
              />
            </div>

            <button type="submit">
              Guardar puntuación
            </button>
          </form>
        )}
      </section>

      {/* criterios */}
      <h2>Criterios</h2>

      {decision.criteria.length === 0 ? (
        <p>No hay criterios todavía.</p>
      ) : (
        decision.criteria.map((criterion) => (
          <div key={criterion.id}>
            {criterion.name} - peso {criterion.weight}
          </div>
        ))
      )}

      {/* opciones */}
      <h2>Opciones</h2>

      {decision.options.length === 0 ? (
        <p>No hay opciones todavía.</p>
      ) : (
        decision.options.map((option) => (
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
                const criterion =
                  decision.criteria.find(
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
        ))
      )}

      {/* resultado */}
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

      {/* ranking */}
      <h3>Ranking</h3>

      {results?.ranking.map((item, index) => (
        <p key={item.id}>
          {index + 1}. {item.name} -{" "}
          {item.totalScore} puntos
        </p>
      ))}
    </div>
  );
}