import { redirect } from 'next/navigation';

export default function HomePage() {
  // Mock: redirigir siempre a /inicio
  // En producción, aquí verificarías si el usuario completó onboarding
  redirect('/inicio');
}
