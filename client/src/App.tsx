import { useEffect, useState } from "react";

type Decision = {
  id: string;
  title: string;
  description?: string;
  status: string;
};

function App() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/decisions")
      .then((res) => res.json())
      .then((data) => setDecisions(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando...</p>;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Decision Helper</h1>
      <p>Compara opciones y toma mejores decisiones.</p>

      {decisions.map((decision) => (
        <div
          key={decision.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginTop: "15px",
            borderRadius: "10px",
          }}
        >
          <h2>{decision.title}</h2>
          <p>{decision.description}</p>
          <small>Estado: {decision.status}</small>
        </div>
      ))}
    </div>
  );
}

export default App;