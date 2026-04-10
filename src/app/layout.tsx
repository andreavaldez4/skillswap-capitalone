import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { UserProvider } from "@/contexts/UserContext";

// Fuente para headings/títulos
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

// Fuente para cuerpo/texto
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Skill Swap - Intercambia habilidades, crece junto a otros",
  description: "Plataforma comunitaria para intercambiar habilidades sin dinero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, inter.variable)}
    >
      <body className="min-h-full flex flex-col font-sans bg-white">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
