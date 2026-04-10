import { User } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { XPBadge } from './XPBadge';

type UserCardProps = {
  user: User;
  onConnect?: () => void;
};

export function UserCard({ user, onConnect }: UserCardProps) {
  const initial = user.name.charAt(0).toUpperCase();
  const commonInterests = user.skillsToTeach.length > 0 ? user.skillsToTeach[0] : null;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        {/* Avatar y nombre */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold text-lg flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{user.location}</span>
              {user.isRemote && (
                <Badge variant="outline" className="ml-1 text-xs">
                  Remoto
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Habilidades */}
        <div className="space-y-1">
          {user.skillsToTeach.length > 0 && (
            <p className="text-sm">
              <span className="text-gray-600">Enseña:</span>{' '}
              <span className="text-gray-900 font-medium">
                {user.skillsToTeach.map((s) => s.name).join(', ')}
              </span>
            </p>
          )}
          {user.skillsToLearn.length > 0 && (
            <p className="text-sm">
              <span className="text-gray-600">Quiere aprender:</span>{' '}
              <span className="text-gray-900 font-medium">
                {user.skillsToLearn.map((s) => s.name).join(', ')}
              </span>
            </p>
          )}
        </div>

        {/* Badge XP */}
        <div>
          <XPBadge xp={user.xp} />
        </div>

        {/* Interés común */}
        {commonInterests && (
          <Badge variant="secondary" className="w-fit bg-orange-100 text-orange-700">
            Interés en común: {commonInterests.name}
          </Badge>
        )}

        {/* Botón conectar */}
        {onConnect && (
          <Button
            onClick={onConnect}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Conectar
          </Button>
        )}
      </div>
    </Card>
  );
}
