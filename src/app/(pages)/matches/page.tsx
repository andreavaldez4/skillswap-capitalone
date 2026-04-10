'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/shared/UserCard';
import { SwappyHelper } from '@/components/shared/SwappyHelper';
import { MOCK_USERS } from '@/lib/mockData';
import { cn } from '@/lib/utils';

type Filter = 'todos' | 'enseñan' | 'aprenden' | 'cerca' | 'remoto';

export default function MatchesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>('todos');

  const filters: { value: Filter; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'enseñan', label: 'Enseñan' },
    { value: 'aprenden', label: 'Aprenden' },
    { value: 'cerca', label: 'Cerca de mí' },
    { value: 'remoto', label: 'Remoto' },
  ];

  const filteredUsers = MOCK_USERS.filter((user) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'enseñan') return user.skillsToTeach.length > 0;
    if (activeFilter === 'aprenden') return user.skillsToLearn.length > 0;
    if (activeFilter === 'cerca') return !user.isRemote;
    if (activeFilter === 'remoto') return user.isRemote;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matches</h1>
          <p className="text-gray-600">
            Encuentra personas con habilidades complementarias
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'whitespace-nowrap',
                activeFilter === filter.value
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-orange-50'
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Grid de matches */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onConnect={() => {
                  router.push('/mensajes');
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <SwappyHelper
              image="idle"
              message="Aún no hay matches disponibles. Completa tu perfil para encontrar personas."
              className="justify-center max-w-md mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
