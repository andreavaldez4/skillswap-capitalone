import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileSummary } from '@/components/shared/ProfileSummary';
import { CURRENT_USER } from '@/lib/mockData';
import { getAllProfileUsers, getUserById } from '@/lib/profile';

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};

export function generateStaticParams() {
  return getAllProfileUsers().map((user) => ({ userId: user.id }));
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const user = getUserById(userId);

  if (!user) {
    notFound();
  }

  const isOwnProfile = user.id === CURRENT_USER.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="w-fit px-0 text-gray-600 hover:text-gray-900">
            <Link href="/matches">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a matches
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
            <p className="text-sm text-gray-600">
              {isOwnProfile
                ? 'Así se ve tu perfil para el resto de usuarios.'
                : `Información pública de ${user.name}.`}
            </p>
          </div>
        </div>

        <ProfileSummary
          user={user}
          actionHref={isOwnProfile ? '/ajustes' : undefined}
          actionLabel={isOwnProfile ? 'Editar perfil' : undefined}
        />
      </div>
    </div>
  );
}