"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", description: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Función para obtener items del backend
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/items`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
        setError(null);
      } else {
        setError("Error al cargar los items");
      }
    } catch (err) {
      setError("Error de conexión con el backend");
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo item
  const createItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.description) return;

    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        setNewItem({ name: "", description: "" });
        fetchItems(); // Recargar los items
      } else {
        setError("Error al crear el item");
      }
    } catch (err) {
      setError("Error de conexión con el backend");
    }
  };

  // Función para eliminar un item
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchItems(); // Recargar los items
      } else {
        setError("Error al eliminar el item");
      }
    } catch (err) {
      setError("Error de conexión con el backend");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority
          />
          <span className="text-xl font-bold">+</span>
          <h1 className="text-xl font-bold">FastAPI Backend</h1>
        </div>

        <div className="bg-white/[.02] dark:bg-black/[.05] border border-black/[.08] dark:border-white/[.145] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Demo del Monorepo</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Esta página consume la API de FastAPI que está ejecutándose en el
            backend. Prueba crear, ver y eliminar items para ver la integración
            en acción.
          </p>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Formulario para crear items */}
          <form onSubmit={createItem} className="mb-6">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nombre del item"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Crear Item
            </button>
          </form>

          {/* Lista de items */}
          {loading ? (
            <div className="text-center py-4">
              <span className="text-gray-500">Cargando items...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold">Items del Backend:</h3>
              {items.length === 0 ? (
                <p className="text-gray-500">No hay items disponibles</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Información del proyecto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/[.02] dark:bg-black/[.05] border border-black/[.08] dark:border-white/[.145] rounded-lg p-4">
            <h3 className="font-semibold mb-2">🌐 Frontend (NextJS)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ejecutándose en:{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded">
                http://localhost:3000
              </code>
            </p>
          </div>
          <div className="bg-white/[.02] dark:bg-black/[.05] border border-black/[.08] dark:border-white/[.145] rounded-lg p-4">
            <h3 className="font-semibold mb-2">🐍 Backend (FastAPI)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ejecutándose en:{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded">
                http://localhost:8000
              </code>
            </p>
          </div>
        </div>

        {/* Enlaces útiles */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 Ver API Docs
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="http://localhost:8000/health"
            target="_blank"
            rel="noopener noreferrer"
          >
            ❤️ Health Check
          </a>
        </div>
      </main>
    </div>
  );
}
