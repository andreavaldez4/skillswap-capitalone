import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-orange-100">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="text-2xl font-bold text-orange-600">SkillSwap</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-orange-100 p-3">
            <svg className="h-12 w-12 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">¡Registro exitoso!</h1>
          <p className="mb-8 text-gray-600">Tu cuenta ha sido creada correctamente. Ahora puedes comenzar a intercambiar habilidades con otros.</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Ir al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
