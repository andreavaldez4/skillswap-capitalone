'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SwappyHelper } from '@/components/shared/SwappyHelper';
import { SkillChip } from '@/components/shared/SkillChip';
import { SKILLS, Skill } from '@/lib/mockData';
import { UserSquare, GraduationCap, Users, CalendarDays, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'aprender' | 'enseñar' | 'ambos';
type TimeSlot = 'Mañana' | 'Tarde' | 'Noche';
type Day = 'Lun' | 'Mar' | 'Mié' | 'Jue' | 'Vie' | 'Sáb' | 'Dom';

const DAYS: Day[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const TIME_SLOTS: TimeSlot[] = ['Mañana', 'Tarde', 'Noche'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [skillsToTeach, setSkillsToTeach] = useState<Skill[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<Skill[]>([]);
  const [availability, setAvailability] = useState<Set<string>>(new Set());
  const [locationType, setLocationType] = useState<'presencial' | 'remoto' | null>(null);
  const [city, setCity] = useState('');

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

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

  const handleNext = () => {
    if (step === 1 && role === 'aprender') {
      setStep(3); // Saltar a aprender
    } else if (step === 2 && role === 'enseñar') {
      setStep(4); // Saltar disponibilidad
    } else if (step === totalSteps) {
      router.push('/inicio');
    } else {
      setStep(step + 1);
    }
  };

  const canProceed = () => {
    if (step === 1) return role !== null;
    if (step === 2) return skillsToTeach.length > 0;
    if (step === 3) return skillsToLearn.length > 0;
    if (step === 4) return availability.size > 0;
    if (step === 5) return locationType !== null && (locationType === 'remoto' || city.trim() !== '');
    return false;
  };

  const getSwappyMessage = () => {
    switch (step) {
      case 1:
        return '¡Hola! Soy Swappy. Voy a ayudarte a configurar tu perfil. ¿Qué te gustaría hacer?';
      case 2:
        return 'Genial! ¿Qué habilidades puedes compartir con otros?';
      case 3:
        return 'Perfecto! Ahora dime, ¿qué te gustaría aprender?';
      case 4:
        return '¿Cuándo tienes tiempo disponible para intercambiar habilidades?';
      case 5:
        return 'Por último, ¿prefieres conectar en persona o de forma remota?';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Barra de progreso */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Paso {step} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-orange-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Swappy Helper */}
          <SwappyHelper image="estudio" message={getSwappyMessage()} />

          {/* Paso 1: Rol */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={cn(
                  'p-6 cursor-pointer transition-all hover:shadow-md',
                  role === 'aprender' && 'border-2 border-orange-500 bg-orange-50'
                )}
                onClick={() => setRole('aprender')}
              >
                <GraduationCap className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                <h3 className="text-center font-semibold text-lg">Aprender</h3>
              </Card>
              <Card
                className={cn(
                  'p-6 cursor-pointer transition-all hover:shadow-md',
                  role === 'enseñar' && 'border-2 border-orange-500 bg-orange-50'
                )}
                onClick={() => setRole('enseñar')}
              >
                <UserSquare className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                <h3 className="text-center font-semibold text-lg">Enseñar</h3>
              </Card>
              <Card
                className={cn(
                  'p-6 cursor-pointer transition-all hover:shadow-md',
                  role === 'ambos' && 'border-2 border-orange-500 bg-orange-50'
                )}
                onClick={() => setRole('ambos')}
              >
                <Users className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                <h3 className="text-center font-semibold text-lg">Ambos</h3>
              </Card>
            </div>
          )}

          {/* Paso 2: Habilidades para enseñar */}
          {step === 2 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">¿Qué puedes enseñar?</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <SkillChip
                    key={skill.id}
                    skill={skill}
                    selected={skillsToTeach.includes(skill)}
                    onClick={() => toggleSkillToTeach(skill)}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Paso 3: Habilidades para aprender */}
          {step === 3 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">¿Qué quieres aprender?</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <SkillChip
                    key={skill.id}
                    skill={skill}
                    selected={skillsToLearn.includes(skill)}
                    onClick={() => toggleSkillToLearn(skill)}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Paso 4: Disponibilidad */}
          {step === 4 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-semibold">¿Cuándo tienes tiempo?</h2>
              </div>
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

          {/* Paso 5: Ubicación */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={cn(
                    'p-6 cursor-pointer transition-all hover:shadow-md',
                    locationType === 'presencial' && 'border-2 border-orange-500 bg-orange-50'
                  )}
                  onClick={() => setLocationType('presencial')}
                >
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                  <h3 className="text-center font-semibold text-lg">Presencial</h3>
                </Card>
                <Card
                  className={cn(
                    'p-6 cursor-pointer transition-all hover:shadow-md',
                    locationType === 'remoto' && 'border-2 border-orange-500 bg-orange-50'
                  )}
                  onClick={() => setLocationType('remoto')}
                >
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                  <h3 className="text-center font-semibold text-lg">Solo remoto</h3>
                </Card>
              </div>
              {locationType === 'presencial' && (
                <Card className="p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿En qué ciudad?
                  </label>
                  <Input
                    type="text"
                    placeholder="Escribe tu ciudad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full"
                  />
                </Card>
              )}
            </div>
          )}

          {/* Pantalla final */}
          {step === totalSteps + 1 && (
            <div className="text-center space-y-6">
              <SwappyHelper
                image="saludo"
                message="¡Todo listo! Vamos a encontrar tus matches."
                className="justify-center"
              />
              <Button
                onClick={() => router.push('/inicio')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              >
                Ir al inicio
              </Button>
            </div>
          )}

          {/* Botones de navegación */}
          {step <= totalSteps && (
            <div className="flex gap-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Atrás
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === totalSteps ? 'Finalizar' : 'Siguiente'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
