'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwappyHelper } from '@/components/shared/SwappyHelper';
import { MOCK_COMMUNITIES } from '@/lib/mockData';
import {
  GraduationCap,
  Code,
  Music,
  Camera,
  Languages,
  Users,
  Book,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'aprendizaje' | 'enseñanza';

// Mapeo de habilidades a íconos
const skillIcons: Record<string, React.ElementType> = {
  Francés: Languages,
  Guitarra: Music,
  Python: Code,
  Yoga: GraduationCap,
  Fotografía: Camera,
  Inglés: Languages,
  Cocina: Book,
  Diseño: Palette,
};

export default function ComunidadesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('aprendizaje');
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());

  const learningCommunities = MOCK_COMMUNITIES.filter((c) => c.type === 'learning');
  const teachingCommunities = MOCK_COMMUNITIES.filter((c) => c.type === 'teaching');

  const communities = activeTab === 'aprendizaje' ? learningCommunities : teachingCommunities;

  const toggleJoin = (communityId: string) => {
    setJoinedCommunities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(communityId)) {
        newSet.delete(communityId);
      } else {
        newSet.add(communityId);
      }
      return newSet;
    });
  };

  const getIcon = (skillName: string) => {
    const Icon = skillIcons[skillName] || Users;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comunidades</h1>
          <p className="text-gray-600">Únete a grupos para aprender o enseñar en comunidad</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('aprendizaje')}
            className={cn(
              'pb-3 px-4 font-medium transition-colors',
              activeTab === 'aprendizaje'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Aprendizaje
          </button>
          <button
            onClick={() => setActiveTab('enseñanza')}
            className={cn(
              'pb-3 px-4 font-medium transition-colors',
              activeTab === 'enseñanza'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Enseñanza
          </button>
        </div>

        {/* Grid de comunidades */}
        {communities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((community) => {
              const Icon = getIcon(community.skill.name);
              const isJoined = joinedCommunities.has(community.id);

              return (
                <Card key={community.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4">
                    {/* Ícono y nombre */}
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {community.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {community.members} miembros
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-gray-600">{community.description}</p>

                    {/* Badge de habilidad */}
                    <Badge
                      variant="secondary"
                      className="w-fit bg-orange-100 text-orange-700"
                    >
                      {community.skill.name}
                    </Badge>

                    {/* Botón */}
                    <Button
                      onClick={() => toggleJoin(community.id)}
                      variant={isJoined ? 'outline' : 'default'}
                      className={cn(
                        'w-full',
                        isJoined
                          ? 'border-orange-500 text-orange-600 hover:bg-orange-50'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      )}
                    >
                      {isJoined ? 'Unido' : 'Unirme'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-12">
            <SwappyHelper
              image="idle"
              message="No hay comunidades aún. Sé el primero en crear una."
              className="justify-center max-w-md mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
