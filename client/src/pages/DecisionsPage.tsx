import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Decision = {
  id: string;
  title: string;
  description?: string;
  status: string;
};

export default function DecisionsPage() {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();

  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);

  const loadDecisions = () => {
    fetch(`http://localhost:3000/api/decisions?userId=${user?.uid}`)
      .then((res) => res.json())
      .then((data) => setDecisions(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  const handleCreateDecision = async (
    event: FormEvent
  ) => {
    event.preventDefault();
  
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }
  
    if (!title.trim()) {
      alert("El título es obligatorio");
      return;
    }
  
    setCreating(true);
  
    try {
      const response = await fetch(
        "http://localhost:3000/api/decisions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            userId: user.uid,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(
          "Error al crear decisión"
        );
      }
  
      setTitle("");
      setDescription("");
  
      loadDecisions();
    } catch (error) {
      console.error(error);
  
      alert(
        "No se pudo crear la decisión"
      );
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

  if (authLoading || loading) {
    return (
      <p className="p-10 text-center text-lg text-slate-100">
        Cargando...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="mb-12 flex flex-col gap-6 rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Decision Helper
            </h1>

            <p className="mt-3 text-slate-400">
              Compara opciones y toma mejores decisiones.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Usuario"}
                    className="h-11 w-11 rounded-full border border-slate-600"
                  />
                )}

                <div className="hidden text-right md:block">
                  <p className="text-sm font-semibold">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-600"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Iniciar sesión con Google
              </button>
            )}
          </div>
        </header>

        {!user ? (
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-10 text-center shadow-xl">
            <h2 className="text-2xl font-bold">
              Inicia sesión para gestionar tus decisiones
            </h2>
            <p className="mt-3 text-slate-400">
              Usa tu cuenta de Google para acceder a la aplicación.
            </p>

            <button
              onClick={loginWithGoogle}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Entrar con Google
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
              <h2 className="mb-6 text-2xl font-bold">
                Nueva decisión
              </h2>

              <form onSubmit={handleCreateDecision} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Título
                  </label>

                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ej: Elegir portátil"
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Descripción
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe la decisión"
                    className="min-h-[120px] w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                  {creating ? "Creando..." : "Crear decisión"}
                </button>
              </form>
            </div>

            <div className="mt-14">
              <h2 className="mb-6 text-3xl font-bold">
                Mis decisiones
              </h2>

              {decisions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
                  No hay decisiones todavía.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {decisions.map((decision) => (
                    <div
                      key={decision.id}
                      className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl transition hover:-translate-y-1 hover:border-blue-500"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {decision.title}
                          </h3>

                          <p className="mt-2 text-slate-400">
                            {decision.description || "Sin descripción"}
                          </p>
                        </div>

                        <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
                          {decision.status}
                        </span>
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        <Link
                          to={`/decisions/${decision.id}`}
                          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                        >
                          Ver detalle
                        </Link>

                        <button
                          onClick={() => handleDeleteDecision(decision.id)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}