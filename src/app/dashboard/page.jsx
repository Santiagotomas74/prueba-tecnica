"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica si hay sesión
  useEffect(() => {
    const loggedUser = sessionStorage.getItem("user");

    if (!loggedUser) {
      router.push("/login");
      return;
    }

    setUser(loggedUser);
    setLoading(false);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("loggedUser");
    router.push("/login");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">

        <h1 className="text-2xl font-bold mb-4 text-gray-700">
          Dashboard
        </h1>

        <p className="text-gray-600 mb-6">
          Bienvenido, <span className="font-semibold">{user}</span> 👋
        </p>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
