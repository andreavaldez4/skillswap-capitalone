'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserCard } from '@/components/shared/UserCard';
import { SwappyHelper } from '@/components/shared/SwappyHelper';
import { MOCK_USERS } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

type Filter = 'todos' | 'enseñan' | 'aprenden' | 'cerca' | 'remoto';
type CategoryFilter = 'all' | 'languages' | 'tech' | 'arts' | 'wellness' | 'other';
type ModalityFilter = 'all' | 'presencial' | 'llamada';

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: 'Todas las categorías',
  languages: 'Idiomas',
  tech: 'Tecnología',
  arts: 'Arte',
  wellness: 'Bienestar',
  other: 'Otros',
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function MatchesPage() {
  const router = useRouter();
  const { sendMatchRequest, getMatchStatusWithUser } = useUser();
  const [activeFilter, setActiveFilter] = useState<Filter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>('all');
  const [lastConnectedName, setLastConnectedName] = useState<string | null>(null);

  const filters: { value: Filter; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'enseñan', label: 'Enseñan' },
    { value: 'aprenden', label: 'Aprenden' },
    { value: 'cerca', label: 'Cerca de mí' },
    { value: 'remoto', label: 'Remoto' },
  ];

  const availableSkills = Array.from(
    new Map(
      MOCK_USERS.flatMap((user) => [...user.skillsToTeach, ...user.skillsToLearn]).map((skill) => [
        skill.id,
        skill,
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const availableCategoryOptions =
    categoryFilter === 'all'
      ? availableSkills
      : availableSkills.filter((skill) => skill.category === categoryFilter);

  const handleConnect = (userId: string, userName: string) => {
    sendMatchRequest(userId);
    setLastConnectedName(userName);
  };

  const filteredUsers = MOCK_USERS.filter((user) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'enseñan') return user.skillsToTeach.length > 0;
    if (activeFilter === 'aprenden') return user.skillsToLearn.length > 0;
    if (activeFilter === 'cerca') return !user.isRemote;
    if (activeFilter === 'remoto') return user.isRemote;
    return true;
  })
    .filter((user) => {
      if (modalityFilter === 'all') return true;
      if (modalityFilter === 'presencial') return !user.isRemote;
      return user.isRemote;
    })
    .filter((user) => {
      if (categoryFilter === 'all') return true;

      const allSkills = [...user.skillsToTeach, ...user.skillsToLearn];
      return allSkills.some((skill) => skill.category === categoryFilter);
    })
    .filter((user) => {
      if (skillFilter === 'all') return true;

      const allSkills = [...user.skillsToTeach, ...user.skillsToLearn];
      return allSkills.some((skill) => skill.id === skillFilter);
    })
    .filter((user) => {
      const query = normalizeText(searchQuery.trim());
      if (!query) return true;

      const searchableText = normalizeText(
        [
          user.name,
          user.location,
          user.bio,
          ...user.skillsToTeach.map((skill) => skill.name),
          ...user.skillsToLearn.map((skill) => skill.name),
        ].join(' ')
      );

      return searchableText.includes(query);
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

        {lastConnectedName && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-orange-800">
              Solicitud enviada a <span className="font-semibold">{lastConnectedName}</span>. Te
              notificaremos cuando la acepten para habilitar el chat.
            </p>
            <Button
              onClick={() => router.push('/mensajes')}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              Ir a mensajes
            </Button>
          </div>
        )}

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar por habilidad, idioma o ciudad..."
              className="pl-9 bg-white"
            />
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              const nextCategory = value as CategoryFilter;
              setCategoryFilter(nextCategory);

              if (
                skillFilter !== 'all' &&
                !availableSkills.some(
                  (skill) =>
                    skill.id === skillFilter &&
                    (nextCategory === 'all' || skill.category === nextCategory)
                )
              ) {
                setSkillFilter('all');
              }
            }}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map((category) => (
                <SelectItem key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Habilidad o lenguaje" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las habilidades</SelectItem>
              {availableCategoryOptions.map((skill) => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={modalityFilter} onValueChange={(value) => setModalityFilter(value as ModalityFilter)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las modalidades</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
              <SelectItem value="llamada">Llamada / Remoto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de matches */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const status = getMatchStatusWithUser(user.id);

              return (
                <UserCard
                  key={user.id}
                  user={user}
                  connectLabel={
                    status === 'accepted'
                      ? 'Ir a mensajes'
                      : status === 'pending_sent'
                        ? 'Solicitud enviada'
                        : status === 'pending_incoming'
                          ? 'Tienes solicitud pendiente'
                          : 'Conectar'
                  }
                  disableConnect={status === 'pending_sent' || status === 'pending_incoming'}
                  onConnect={() => {
                    if (status === 'accepted') {
                      router.push('/mensajes');
                      return;
                    }

                    handleConnect(user.id, user.name);
                  }}
                />
              );
            })}
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
