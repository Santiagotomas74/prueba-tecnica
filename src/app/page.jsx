export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Prueba Técnica – Autenticación y Automatización
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Bienvenido. Esta aplicación está desarrollada en Next.js y cumple con los 
          requisitos solicitados: login, dashboard, registro de accesos en Google Sheets 
          y automatización con Make.
        </p>

        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </a>

        <div className="mt-10 text-sm text-gray-500">
          <p>Desarrollado por Santiago Taher • {new Date().getFullYear()}</p>
        </div>
      </div>
    </main>
  );
}
