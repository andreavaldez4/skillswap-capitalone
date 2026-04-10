'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SkillChip } from '@/components/shared/SkillChip';
import { XPBadge } from '@/components/shared/XPBadge';
import { useUser } from '@/contexts/UserContext';
import { SKILLS, Skill } from '@/lib/mockData';
import { getProgressToNextLevel, getNextLevelTitle, getXPToNextLevel } from '@/lib/xpSystem';
import { User, Briefcase, CalendarDays, Bell, Globe, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

type Section = 'perfil' | 'habilidades' | 'disponibilidad' | 'notificaciones' | 'idioma' | 'cuenta';
type TimeSlot = 'Mañana' | 'Tarde' | 'Noche';
type Day = 'Lun' | 'Mar' | 'Mié' | 'Jue' | 'Vie' | 'Sáb' | 'Dom';

const DAYS: Day[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const TIME_SLOTS: TimeSlot[] = ['Mañana', 'Tarde', 'Noche'];

const sections = [
  { id: 'perfil' as Section, label: 'Perfil', icon: User },
  { id: 'habilidades' as Section, label: 'Mis habilidades', icon: Briefcase },
  { id: 'disponibilidad' as Section, label: 'Disponibilidad', icon: CalendarDays },
  { id: 'notificaciones' as Section, label: 'Notificaciones', icon: Bell },
  { id: 'idioma' as Section, label: 'Idioma', icon: Globe },
  { id: 'cuenta' as Section, label: 'Cuenta', icon: LogOut },
];

export default function AjustesPage() {
  const { user, updateUser } = useUser();
  const [activeSection, setActiveSection] = useState<Section>('perfil');
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  const [skillsToTeach, setSkillsToTeach] = useState<Skill[]>(user.skillsToTeach);
  const [skillsToLearn, setSkillsToLearn] = useState<Skill[]>(user.skillsToLearn);
  const [availability, setAvailability] = useState<Set<string>>(
    new Set(user.availability.map((a) => `${a.day}-${a.time}`))
  );
  const [notifications, setNotifications] = useState({
    newMatches: true,
    messages: true,
    communities: false,
  });
  const [language, setLanguage] = useState('es');

  const progress = getProgressToNextLevel(user.xp);
  const nextLevel = getNextLevelTitle(user.xp);
  const xpToNext = getXPToNextLevel(user.xp);

  const toggleSkillToTeach = (skill: Skill) => {
    setSkillsToTeach((prev) =>
      prev.includes(skill) ? prev.filter((s) => s.id !== skill.id) : [...prev, skill]
    );
  };

  const toggleSkillToLearn = (skill: Skill) => {
    setSkillsToLearn((prev) =>
      prev.includes(skill) ? prev.filter((s) => s.id !== skill.id) : [...prev, skill]
    );
  };

  const toggleAvailability = (day: Day, time: TimeSlot) => {
    const key = `${day}-${time}`;
    setAvailability((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    updateUser({
      name,
      bio,
      location,
      skillsToTeach,
      skillsToLearn,
    });
    alert('Cambios guardados');
  };

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ajustes</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar de secciones - Desktop */}
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <Card className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left',
                        activeSection === section.id
                          ? 'bg-orange-50 text-orange-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Selector móvil */}
          <div className="md:hidden">
            <Select value={activeSection} onValueChange={(v) => setActiveSection(v as Section)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contenido */}
          <div className="flex-1 space-y-6">
            {/* Perfil */}
            {activeSection === 'perfil' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Información del perfil</h2>
                  <div className="space-y-4">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold text-2xl">
                        {initial}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <XPBadge xp={user.xp} />
                      </div>
                    </div>

                    {/* Barra de progreso XP */}
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progreso hacia {nextLevel || 'máximo nivel'}
                        </span>
                        <span className="text-sm text-gray-600">
                          {nextLevel ? `${xpToNext} XP restantes` : 'Nivel máximo alcanzado'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-orange-500 h-3 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Campos editables */}
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleSave}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Guardar cambios
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Habilidades */}
            {activeSection === 'habilidades' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Habilidades que puedo enseñar</h2>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        skill={skill}
                        selected={skillsToTeach.some((s) => s.id === skill.id)}
                        onClick={() => toggleSkillToTeach(skill)}
                      />
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Habilidades que quiero aprender</h2>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        skill={skill}
                        selected={skillsToLearn.some((s) => s.id === skill.id)}
                        onClick={() => toggleSkillToLearn(skill)}
                      />
                    ))}
                  </div>
                </Card>

                <Button
                  onClick={handleSave}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Guardar cambios
                </Button>
              </div>
            )}

            {/* Disponibilidad */}
            {activeSection === 'disponibilidad' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Mi disponibilidad</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2 text-sm font-medium text-gray-600"></th>
                        {DAYS.map((day) => (
                          <th key={day} className="p-2 text-sm font-medium text-gray-600">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map((time) => (
                        <tr key={time}>
                          <td className="p-2 text-sm text-gray-600">{time}</td>
                          {DAYS.map((day) => {
                            const key = `${day}-${time}`;
                            const isSelected = availability.has(key);
                            return (
                              <td key={key} className="p-1">
                                <button
                                  onClick={() => toggleAvailability(day, time)}
                                  className={cn(
                                    'w-full h-10 rounded-md border-2 transition-colors',
                                    isSelected
                                      ? 'bg-orange-500 border-orange-600'
                                      : 'bg-white border-gray-200 hover:border-orange-300'
                                  )}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Notificaciones */}
            {activeSection === 'notificaciones' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Preferencias de notificaciones</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Nuevos matches</p>
                      <p className="text-sm text-gray-600">
                        Recibir notificaciones cuando tengas nuevos matches
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newMatches}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newMatches: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Mensajes</p>
                      <p className="text-sm text-gray-600">
                        Recibir notificaciones de nuevos mensajes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.messages}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, messages: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Comunidades</p>
                      <p className="text-sm text-gray-600">
                        Recibir actualizaciones de tus comunidades
                      </p>
                    </div>
                    <Switch
                      checked={notifications.communities}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, communities: checked })
                      }
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Idioma */}
            {activeSection === 'idioma' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Idioma de la aplicación</h2>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">Inglés</SelectItem>
                    <SelectItem value="fr">Francés</SelectItem>
                    <SelectItem value="pt">Portugués</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            )}

            {/* Cuenta */}
            {activeSection === 'cuenta' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cuenta</h2>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Si cierras sesión, tendrás que iniciar sesión nuevamente para acceder a tu
                    cuenta.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => alert('Sesión cerrada (mock)')}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
