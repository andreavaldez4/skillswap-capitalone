'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCard } from '@/components/shared/UserCard';
import { SwappyHelper } from '@/components/shared/SwappyHelper';
import { MOCK_USERS } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { Users, MessageCircle, Globe, TrendingUp, Bell } from 'lucide-react';

export default function InicioPage() {
  const router = useRouter();
  const {
    pendingIncomingRequests,
    pendingSentRequests,
    acceptedRequests,
    sendMatchRequest,
    getMatchStatusWithUser,
  } = useUser();
  const matchesCount = pendingSentRequests.length;
  const communitiesCount = 2;
  const newMessagesCount = acceptedRequests.length;

  // Primeros 3 usuarios como matches recientes
  const recentMatches = MOCK_USERS.slice(0, 3);

  // Habilidades populares esta semana
  const popularSkills = ['Guitarra', 'Python', 'Francés', 'Yoga', 'Fotografía'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Sección Hero */}
        <Card className="bg-gradient-to-r from-orange-100 to-orange-50 border-none p-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Intercambia habilidades, crece junto a otros
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Enseña lo que sabes. Aprende lo que amas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push('/matches')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Encontrar Match
              </Button>
              <Button
                onClick={() => router.push('/comunidades')}
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                Unirme a Comunidad
              </Button>
            </div>
          </div>
        </Card>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible">
          <Card
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/matches')}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{matchesCount}</p>
                <p className="text-sm text-gray-600">Solicitudes enviadas</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/comunidades')}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{communitiesCount}</p>
                <p className="text-sm text-gray-600">Comunidades</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/mensajes')}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{newMessagesCount}</p>
                <p className="text-sm text-gray-600">Chats habilitados</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones de match</h3>
          </div>
          {pendingIncomingRequests.length + pendingSentRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingIncomingRequests.map((request) => {
                const sender = MOCK_USERS.find((u) => u.id === request.fromUserId);
                if (!sender) return null;

                return (
                  <div
                    key={request.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3"
                  >
                    <p className="text-sm text-orange-900">
                      {sender.name} te envió una solicitud de match.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => router.push('/mensajes')}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Revisar en mensajes
                    </Button>
                  </div>
                );
              })}

              {pendingSentRequests.map((request) => {
                const receiver = MOCK_USERS.find((u) => u.id === request.toUserId);
                if (!receiver) return null;

                return (
                  <div
                    key={request.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3"
                  >
                    <p className="text-sm text-gray-700">
                      Solicitud enviada a {receiver.name}. En espera de aceptación.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => router.push('/mensajes')}>
                      Ver estado
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No tienes notificaciones nuevas por ahora.</p>
          )}
        </Card>

        {/* Matches recientes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Matches recientes</h2>
            <Button
              variant="ghost"
              onClick={() => router.push('/matches')}
              className="text-orange-600 hover:text-orange-700"
            >
              Ver todos
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMatches.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                profileHref={`/perfil/${user.id}`}
                connectLabel={
                  getMatchStatusWithUser(user.id) === 'pending_sent'
                    ? 'Solicitud enviada'
                    : getMatchStatusWithUser(user.id) === 'accepted'
                      ? 'Ir a mensajes'
                      : 'Conectar'
                }
                disableConnect={getMatchStatusWithUser(user.id) === 'pending_sent'}
                onConnect={() => {
                  if (getMatchStatusWithUser(user.id) === 'accepted') {
                    router.push('/mensajes');
                    return;
                  }

                  sendMatchRequest(user.id);
                }}
              />
            ))}
          </div>
        </div>

        {/* Habilidades populares esta semana */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Habilidades populares esta semana
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Tip de Swappy */}
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-white">
          <SwappyHelper
            image="idle"
            message="Los usuarios que enseñan ganan el doble de Skill XP."
          />
        </Card>
      </div>
    </div>
  );
}
