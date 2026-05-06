import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

type Decision = {
  id: string;
  title: string;
  description?: string;
  status: string;
};

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const loadDecisions = () => {
    fetch("http://localhost:3000/api/decisions")
      .then((res) => res.json())
      .then((data) => setDecisions(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  const handleCreateDecision = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("El título es obligatorio");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("http://localhost:3000/api/decisions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear decisión");
      }

      setTitle("");
      setDescription("");

      loadDecisions();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la decisión");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando...</p>;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "900px" }}>
      <h1>Decision Helper</h1>
      <p>Compara opciones y toma mejores decisiones.</p>

      <form
        onSubmit={handleCreateDecision}
        style={{
          marginTop: "30px",
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2>Nueva decisión</h2>

        <div style={{ marginBottom: "10px" }}>
          <label>Título</label>
          <br />
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej: Elegir portátil"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Descripción</label>
          <br />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe la decisión"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <button type="submit" disabled={creating}>
          {creating ? "Creando..." : "Crear decisión"}
        </button>
      </form>

      <h2>Mis decisiones</h2>

      {decisions.length === 0 ? (
        <p>No hay decisiones todavía.</p>
      ) : (
        decisions.map((decision) => (
          <div
            key={decision.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginTop: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>{decision.title}</h3>

            <p>{decision.description}</p>

            <small>Estado: {decision.status}</small>

            <br />

            <Link to={`/decisions/${decision.id}`}>
              Ver detalle
            </Link>
          </div>
        ))
      )}
    </div>
  );
}