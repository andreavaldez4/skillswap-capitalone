"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LoginProvider = "email" | "google";

type ApiResponse = {
  message?: string;
  error?: string;
};

const interestOptions = [
  "cocina",
  "deportes",
  "lectura",
  "musica",
  "programacion",
  "viajes",
  "videojuegos",
  "fitness",
  "arte",
  "fotografia",
];

const learningTopicOptions = [
  "programacion",
  "diseno",
  "oratoria",
  "musica",
  "idiomas",
  "escritura",
  "fotografia",
  "fitness",
];

const learningStyleOptions = [
  "paso a paso",
  "aprendizaje rapido",
  "practico",
  "visual",
  "uno a uno",
  "sesiones grupales",
  "basado en proyectos",
  "primero ejemplos",
];

const teachingTopicOptions = [
  "programacion",
  "matematicas",
  "musica",
  "idiomas",
  "fitness",
  "oratoria",
  "diseno",
  "escritura",
];

const teachingStyleOptions = [
  "paso a paso",
  "aprendizaje rapido",
  "practico",
  "visual",
  "uno a uno",
  "sesiones grupales",
  "basado en proyectos",
  "practica primero",
];

const calendarDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
const calendarHours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];

function formatHourLabel(hour24: string) {
  const raw = Number(hour24);
  const hour12 = raw % 12 === 0 ? 12 : raw % 12;
  const suffix = raw >= 12 ? "PM" : "AM";
  return `${hour12}:00 ${suffix}`;
}

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formState, setFormState] = useState({
    name: "",
    realName: "",
    aboutMe: "",
    interests: [] as string[],
    interestsOther: "",
    email: "",
    password: "",
    authProvider: "email" as LoginProvider,
    wantsToLearn: [] as string[],
    wantsToLearnOther: "",
    learningStyle: [] as string[],
    learningStyleOther: "",
    canTeach: [] as string[],
    canTeachOther: "",
    teachingStyle: [] as string[],
    teachingStyleOther: "",
    availableHours: [] as string[],
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingAvailability, setIsDraggingAvailability] = useState(false);
  const [availabilityDragMode, setAvailabilityDragMode] = useState<"add" | "remove" | null>(null);
  const availabilityVisitedSlots = useRef<Set<string>>(new Set());

  function toggleMulti(
    field: "interests" | "wantsToLearn" | "learningStyle" | "canTeach" | "teachingStyle",
    value: string
  ) {
    setFormState((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  }

  function applyAvailabilitySlot(slotId: string, mode: "add" | "remove") {
    setFormState((current) => {
      const alreadySelected = current.availableHours.includes(slotId);
      if (mode === "add" && !alreadySelected) {
        return { ...current, availableHours: [...current.availableHours, slotId] };
      }
      if (mode === "remove" && alreadySelected) {
        return {
          ...current,
          availableHours: current.availableHours.filter((slot) => slot !== slotId),
        };
      }
      return current;
    });
  }

  function startAvailabilityDrag(slotId: string) {
    const mode: "add" | "remove" = formState.availableHours.includes(slotId) ? "remove" : "add";
    setIsDraggingAvailability(true);
    setAvailabilityDragMode(mode);
    availabilityVisitedSlots.current = new Set([slotId]);
    applyAvailabilitySlot(slotId, mode);
  }

  function continueAvailabilityDrag(slotId: string) {
    if (!isDraggingAvailability || !availabilityDragMode) {
      return;
    }
    if (availabilityVisitedSlots.current.has(slotId)) {
      return;
    }
    availabilityVisitedSlots.current.add(slotId);
    applyAvailabilitySlot(slotId, availabilityDragMode);
  }

  function stopAvailabilityDrag() {
    setIsDraggingAvailability(false);
    setAvailabilityDragMode(null);
    availabilityVisitedSlots.current.clear();
  }

  useEffect(() => {
    if (!isDraggingAvailability) {
      return;
    }
    const onMouseUp = () => stopAvailabilityDrag();
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [isDraggingAvailability]);

  async function saveProfile(payload: object) {
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await response.json() as ApiResponse;
      if (!response.ok) {
        throw new Error("No se pudo guardar tu perfil.");
      }

      return true;
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Ocurrio un error al guardar.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep === 1) {
      const ok = await saveProfile(formState);
      if (ok) setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const ok = await saveProfile(
        {
          ...formState,
          preferences: {
            wantsToLearn: formState.wantsToLearn,
            wantsToLearnOther: formState.wantsToLearnOther,
            learningStyle: formState.learningStyle,
            learningStyleOther: formState.learningStyleOther,
          },
        }
      );
      if (ok) setCurrentStep(3);
      return;
    }

    const ok = await saveProfile(
      {
        ...formState,
        questionnaireCompleted: true,
        preferences: {
          wantsToLearn: formState.wantsToLearn,
          wantsToLearnOther: formState.wantsToLearnOther,
          learningStyle: formState.learningStyle,
          learningStyleOther: formState.learningStyleOther,
          canTeach: formState.canTeach,
          canTeachOther: formState.canTeachOther,
          teachingStyle: formState.teachingStyle,
          teachingStyleOther: formState.teachingStyleOther,
          availableHours: formState.availableHours,
        },
      }
    );

    if (ok) {
      router.push("/success");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-orange-100">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="text-2xl font-bold text-orange-600">SkillSwap</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-3xl border-0 shadow-lg">
          <CardContent className="pt-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
              <p className="mt-1 text-sm text-gray-600">
                {currentStep === 1 && "Información de tu cuenta"}
                {currentStep === 2 && "¿Qué quieres aprender?"}
                {currentStep === 3 && "¿Qué puedes enseñar?"}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <>
                <div>
                  <Input
                    value={formState.name}
                    onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Nombre de usuario"
                    required
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>
                <div>
                  <Input
                    value={formState.realName}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, realName: event.target.value }))
                    }
                    placeholder="Nombre completo (opcional)"
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>
                <div>
                  <textarea
                    value={formState.aboutMe}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, aboutMe: event.target.value }))
                    }
                    placeholder="Acerca de ti (opcional)"
                    className="min-h-24 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Intereses</p>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        size="sm"
                        className={cn(
                          "rounded-full capitalize",
                          formState.interests.includes(interest)
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                        )}
                        variant="outline"
                        onClick={() => toggleMulti("interests", interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      className={cn(
                        "rounded-full",
                        formState.interestsOther
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                      )}
                      variant="outline"
                    >
                      Otro
                    </Button>
                  </div>
                  <Input
                    value={formState.interestsOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, interestsOther: event.target.value }))
                    }
                    placeholder="Especifica otro interés"
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    value={formState.email}
                    onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                    placeholder="Email"
                    required
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    value={formState.password}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Contraseña"
                    required
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">¿Qué quieres aprender?</p>
                  <div className="flex flex-wrap gap-2">
                    {learningTopicOptions.map((topic) => (
                      <Button
                        key={topic}
                        type="button"
                        size="sm"
                        className={cn(
                          "rounded-full capitalize",
                          formState.wantsToLearn.includes(topic)
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                        )}
                        variant="outline"
                        onClick={() => toggleMulti("wantsToLearn", topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      className={cn(
                        "rounded-full",
                        formState.wantsToLearnOther
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                      )}
                      variant="outline"
                    >
                      Otro
                    </Button>
                  </div>
                  <Input
                    value={formState.wantsToLearnOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, wantsToLearnOther: event.target.value }))
                    }
                    placeholder="Especifica otro tema"
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Estilo de aprendizaje</p>
                  <div className="flex flex-wrap gap-2">
                    {learningStyleOptions.map((style) => (
                      <Button
                        key={style}
                        type="button"
                        size="sm"
                        className={cn(
                          "rounded-full capitalize",
                          formState.learningStyle.includes(style)
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                        )}
                        variant="outline"
                        onClick={() => toggleMulti("learningStyle", style)}
                      >
                        {style}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      className={cn(
                        "rounded-full",
                        formState.learningStyleOther
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                      )}
                      variant="outline"
                    >
                      Otro
                    </Button>
                  </div>
                  <Input
                    value={formState.learningStyleOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, learningStyleOther: event.target.value }))
                    }
                    placeholder="Especifica otro estilo"
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">¿Qué puedes enseñar?</p>
                  <div className="flex flex-wrap gap-2">
                    {teachingTopicOptions.map((topic) => (
                      <Button
                        key={topic}
                        type="button"
                        size="sm"
                        className={cn(
                          "rounded-full capitalize",
                          formState.canTeach.includes(topic)
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                        )}
                        variant="outline"
                        onClick={() => toggleMulti("canTeach", topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      className={cn(
                        "rounded-full",
                        formState.canTeachOther
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                      )}
                      variant="outline"
                    >
                      Otro
                    </Button>
                  </div>
                  <Input
                    value={formState.canTeachOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, canTeachOther: event.target.value }))
                    }
                    placeholder="Especifica otro tema"
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Estilo de enseñanza</p>
                  <div className="flex flex-wrap gap-2">
                    {teachingStyleOptions.map((style) => (
                      <Button
                        key={style}
                        type="button"
                        size="sm"
                        className={cn(
                          "rounded-full capitalize",
                          formState.teachingStyle.includes(style)
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                        )}
                        variant="outline"
                        onClick={() => toggleMulti("teachingStyle", style)}
                      >
                        {style}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      className={cn(
                        "rounded-full",
                        formState.teachingStyleOther
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                      )}
                      variant="outline"
                    >
                      Otro
                    </Button>
                  </div>
                  <Input
                    value={formState.teachingStyleOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, teachingStyleOther: event.target.value }))
                    }
                    placeholder="Especifica otro estilo"
                    className="border-gray-300 bg-white px-4 py-3 text-gray-900"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Horarios disponibles</p>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4" onMouseLeave={stopAvailabilityDrag}>
                    <div className="overflow-x-auto">
                      <div className="grid min-w-[720px] grid-cols-[88px_repeat(7,minmax(70px,1fr))] gap-1 text-xs">
                        <div className="p-2 font-medium text-gray-600">Hora</div>
                        {calendarDays.map((day) => (
                          <div key={day} className="p-2 text-center font-medium text-gray-600">
                            {day}
                          </div>
                        ))}

                        {calendarHours.map((hour) => (
                          <div key={hour} className="contents">
                            <div className="p-2 text-gray-600">{formatHourLabel(hour)}</div>
                            {calendarDays.map((day) => {
                              const slotId = `${day}-${hour}`;
                              const isSelected = formState.availableHours.includes(slotId);

                              return (
                                <button
                                  key={slotId}
                                  type="button"
                                  onMouseDown={() => startAvailabilityDrag(slotId)}
                                  onMouseEnter={() => continueAvailabilityDrag(slotId)}
                                  className={cn(
                                    "h-8 select-none rounded-md border transition",
                                    isSelected
                                      ? "border-orange-500 bg-orange-500 text-white"
                                      : "border-gray-300 bg-white hover:border-orange-300 hover:bg-orange-50"
                                  )}
                                  aria-label={`${day} ${formatHourLabel(hour)}`}
                                >
                                  {isSelected ? "\u2713" : ""}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">Slots seleccionados: {formState.availableHours.length}</div>
                  </div>
                </div>
              </>
            )}

            {statusMessage ? <p className="text-sm text-red-600">{statusMessage}</p> : null}

            <div className="flex gap-3 pt-4">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((current) => (current === 3 ? 2 : 1))}
                  disabled={isSubmitting}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Atrás
                </Button>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex-1 py-3 font-semibold",
                  "bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-300"
                )}
              >
                {isSubmitting
                  ? "Guardando..."
                  : currentStep === 3
                    ? "Finalizar registro"
                    : "Continuar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </main>
    </div>
  );
}
