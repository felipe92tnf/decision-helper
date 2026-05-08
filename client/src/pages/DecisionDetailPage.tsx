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

  const [criterionName, setCriterionName] = useState("");
  const [criterionWeight, setCriterionWeight] = useState(1);

  const [optionName, setOptionName] = useState("");
  const [optionDescription, setOptionDescription] = useState("");

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

      if (!response.ok) throw new Error("Error al crear criterio");

      setCriterionName("");
      setCriterionWeight(1);
      refreshPageData();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear el criterio");
    }
  };

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

      if (!response.ok) throw new Error("Error al crear opción");

      setOptionName("");
      setOptionDescription("");
      refreshPageData();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la opción");
    }
  };

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

      if (!response.ok) throw new Error("Error al crear puntuación");

      setScoreValue(1);
      refreshPageData();
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la puntuación");
    }
  };

  const handleDeleteCriterion = async (criterionId: string) => {
    if (!confirm("¿Eliminar este criterio?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/criteria/${criterionId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Error al eliminar criterio");

      refreshPageData();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el criterio");
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (!confirm("¿Eliminar esta opción?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/options/${optionId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Error al eliminar opción");

      refreshPageData();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la opción");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-10 text-center text-slate-100">
        Cargando detalle...
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="min-h-screen bg-slate-900 p-10 text-center text-slate-100">
        Decisión no encontrada
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/" className="text-sm font-medium text-blue-400 hover:text-blue-300">
          ← Volver
        </Link>

        <header className="mt-8 rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-2xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300">
                Decisión
              </span>

              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                {decision.title}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                {decision.description || "Sin descripción"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5 text-center">
              <p className="text-sm text-slate-400">Mejor opción</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {results?.recommendedOption?.name || "Pendiente"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {results?.recommendedOption
                  ? `${results.recommendedOption.totalScore} puntos`
                  : "Añade opciones y puntuaciones"}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleCreateCriterion}
            className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold">Añadir criterio</h2>
            <p className="mt-1 text-sm text-slate-400">
              Define qué aspectos vas a valorar.
            </p>

            <label className="mt-5 block text-sm font-medium text-slate-300">
              Nombre
            </label>
            <input
              value={criterionName}
              onChange={(event) => setCriterionName(event.target.value)}
              placeholder="Ej: Precio"
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
            />

            <label className="mt-4 block text-sm font-medium text-slate-300">
              Peso
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={criterionWeight}
              onChange={(event) => setCriterionWeight(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500">
              Crear criterio
            </button>
          </form>

          <form
            onSubmit={handleCreateOption}
            className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold">Añadir opción</h2>
            <p className="mt-1 text-sm text-slate-400">
              Añade alternativas para comparar.
            </p>

            <label className="mt-5 block text-sm font-medium text-slate-300">
              Nombre
            </label>
            <input
              value={optionName}
              onChange={(event) => setOptionName(event.target.value)}
              placeholder="Ej: Asus Zenbook"
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
            />

            <label className="mt-4 block text-sm font-medium text-slate-300">
              Descripción
            </label>
            <textarea
              value={optionDescription}
              onChange={(event) => setOptionDescription(event.target.value)}
              placeholder="Ej: 16GB RAM, buena batería"
              className="mt-2 min-h-[96px] w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500">
              Crear opción
            </button>
          </form>

          <form
            onSubmit={handleCreateScore}
            className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold">Añadir puntuación</h2>
            <p className="mt-1 text-sm text-slate-400">
              Puntúa una opción según un criterio.
            </p>

            {decision.options.length === 0 || decision.criteria.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-600 p-5 text-sm text-slate-400">
                Necesitas al menos una opción y un criterio.
              </div>
            ) : (
              <>
                <label className="mt-5 block text-sm font-medium text-slate-300">
                  Opción
                </label>
                <select
                  value={selectedOptionId}
                  onChange={(event) => setSelectedOptionId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Selecciona una opción</option>
                  {decision.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label className="mt-4 block text-sm font-medium text-slate-300">
                  Criterio
                </label>
                <select
                  value={selectedCriterionId}
                  onChange={(event) => setSelectedCriterionId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Selecciona un criterio</option>
                  {decision.criteria.map((criterion) => (
                    <option key={criterion.id} value={criterion.id}>
                      {criterion.name}
                    </option>
                  ))}
                </select>

                <label className="mt-4 block text-sm font-medium text-slate-300">
                  Puntuación
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={scoreValue}
                  onChange={(event) => setScoreValue(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                />

                <button className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold transition hover:bg-emerald-500">
                  Guardar puntuación
                </button>
              </>
            )}
          </form>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">Criterios</h2>

            {decision.criteria.length === 0 ? (
              <p className="mt-4 text-slate-400">No hay criterios todavía.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {decision.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-4"
                  >
                    <div>
                      <p className="font-semibold">{criterion.name}</p>
                      <p className="text-sm text-slate-400">
                        Peso {criterion.weight}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteCriterion(criterion.id)}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium transition hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">Ranking</h2>

            {results?.ranking.length ? (
              <div className="mt-5 space-y-3">
                {results.ranking.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold">
                        {index + 1}
                      </span>
                      <span className="font-semibold">{item.name}</span>
                    </div>

                    <span className="font-bold text-emerald-400">
                      {item.totalScore} pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">Todavía no hay ranking.</p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
          <h2 className="text-2xl font-bold">Opciones</h2>

          {decision.options.length === 0 ? (
            <p className="mt-4 text-slate-400">No hay opciones todavía.</p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {decision.options.map((option) => (
                <div
                  key={option.id}
                  className="rounded-3xl border border-slate-700 bg-slate-900 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{option.name}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {option.description || "Sin descripción"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteOption(option.id)}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium transition hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </div>

                  <h4 className="mt-5 font-semibold text-slate-300">
                    Puntuaciones
                  </h4>

                  {option.scores.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Sin puntuaciones todavía.
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {option.scores.map((score) => {
                        const criterion = decision.criteria.find(
                          (c) => c.id === score.criterionId
                        );

                        return (
                          <span
                            key={score.id}
                            className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-200"
                          >
                            {criterion?.name}: {score.value}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}