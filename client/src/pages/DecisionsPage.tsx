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

  const handleDeleteDecision = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar esta decisión?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/decisions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      loadDecisions();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando...</p>;
  }

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "760px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Decision Helper
      </h1>

      <p
        style={{
          fontSize: "20px",
          opacity: 0.8,
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Compara opciones y toma mejores decisiones.
      </p>

      <form
        onSubmit={handleCreateDecision}
        style={{
          border: "1px solid #ddd",
          padding: "30px",
          borderRadius: "14px",
          marginTop: "30px",
          backgroundColor: "#16181f",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Nueva decisión</h2>

        <div style={{ marginBottom: "15px" }}>
          <label>Título</label>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej: Elegir portátil"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#24262d",
              color: "white",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Descripción</label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe la decisión"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#24262d",
              color: "white",
              minHeight: "90px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {creating ? "Creando..." : "Crear decisión"}
        </button>
      </form>

      <h2 style={{ marginTop: "40px", textAlign: "center" }}>Mis decisiones</h2>

      {decisions.length === 0 ? (
        <p style={{ textAlign: "center" }}>No hay decisiones todavía.</p>
      ) : (
        decisions.map((decision) => (
          <div
            key={decision.id}
            style={{
              border: "1px solid #ddd",
              padding: "25px",
              borderRadius: "14px",
              marginTop: "20px",
              backgroundColor: "#16181f",
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            <h3 style={{ textAlign: "center", fontSize: "24px" }}>
              {decision.title}
            </h3>

            <p style={{ textAlign: "center", opacity: 0.85 }}>
              {decision.description || "Sin descripción"}
            </p>

            <p style={{ textAlign: "center", fontSize: "14px", opacity: 0.7 }}>
              Estado: {decision.status}
            </p>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <Link to={`/decisions/${decision.id}`}>Ver detalle</Link>

              <button
                onClick={() => handleDeleteDecision(decision.id)}
                style={{
                  backgroundColor: "crimson",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}