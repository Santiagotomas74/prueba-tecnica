"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ user: "", pass: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // Guardar usuario en sesión
      sessionStorage.setItem("user", data.user);

      // Redirigir
      router.push("/dashboard");
    } catch (err) {
      setError("Error en el servidor");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-gray-600 text-sm">Usuario</label>
            <input
              type="text"
              name="user"
              onChange={handleChange}
              className="w-full  text-gray-600 mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm">Contraseña</label>
            <input
              type="password"
              name="pass"
              onChange={handleChange}
              className="w-full text-gray-600 mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-gray-500 hover:underline">
            Volver al inicio
          </a>
        </div>
      </div>
    </main>
  );
}
