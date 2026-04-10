"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LoginResponse = {
  error?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      await response.json() as LoginResponse;

      if (!response.ok) {
        throw new Error("Email o contraseña incorrectos.");
      }

      router.push("/success");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="pt-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Inicia sesión</h1>
              <p className="mt-1 text-sm text-gray-600">Usa tu email y contraseña para continuar.</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu.email@ejemplo.com"
                  autoComplete="email"
                  required
                  className="border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="contraseña"
                  autoComplete="current-password"
                  required
                  className="border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400"
                />
              </div>

              {statusMessage ? <p className="text-sm text-red-600">{statusMessage}</p> : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 py-3 font-semibold hover:bg-orange-700"
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link href="/signup" className="font-semibold text-orange-600 hover:text-orange-700">
                Crear una
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
