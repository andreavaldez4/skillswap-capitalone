"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LoginProvider = "email" | "google";

type ApiResponse = {
  message?: string;
  error?: string;
};

const interestOptions = [
  "cooking",
  "sports",
  "reading",
  "music",
  "coding",
  "travel",
  "games",
  "fitness",
  "art",
  "photography",
];

const learningTopicOptions = [
  "coding",
  "design",
  "public speaking",
  "music",
  "language",
  "writing",
  "photography",
  "fitness",
];

const learningStyleOptions = [
  "slow and steady",
  "quick learner",
  "hands-on",
  "visual",
  "one-on-one",
  "group sessions",
  "project-based",
  "examples first",
];

const teachingTopicOptions = [
  "coding",
  "math",
  "music",
  "language",
  "fitness",
  "public speaking",
  "design",
  "writing",
];

const teachingStyleOptions = [
  "slow and steady",
  "quick learner",
  "hands-on",
  "visual",
  "one-on-one",
  "group sessions",
  "project-based",
  "practice-first",
];

const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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

  async function saveProfile(payload: object, message: string) {
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save profile.");
      }

      setStatusMessage(message);
      return true;
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unexpected save error.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep === 1) {
      const ok = await saveProfile(formState, "Step 1 saved.");
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
        },
        "Step 2 saved."
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
      },
      "Signup complete."
    );

    if (ok) {
      router.push("/success");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Account information"}
            {currentStep === 2 && "Learning preferences"}
            {currentStep === 3 && "Teaching preferences"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <>
                <Input
                  value={formState.name}
                  onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Username"
                  required
                />
                <Input
                  value={formState.realName}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, realName: event.target.value }))
                  }
                  placeholder="Real name (optional)"
                />
                <textarea
                  value={formState.aboutMe}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, aboutMe: event.target.value }))
                  }
                  placeholder="About you (optional)"
                  className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        size="sm"
                        variant={formState.interests.includes(interest) ? "default" : "outline"}
                        className="rounded-full capitalize"
                        onClick={() => toggleMulti("interests", interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant={formState.interestsOther ? "default" : "outline"}
                      className="rounded-full"
                    >
                      Other
                    </Button>
                  </div>
                  <Input
                    value={formState.interestsOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, interestsOther: event.target.value }))
                    }
                    placeholder="Other interest"
                  />
                </div>

                <Input
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Email"
                  required
                />
                <Input
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Password"
                  required
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium">What do you want to learn?</p>
                  <div className="flex flex-wrap gap-2">
                    {learningTopicOptions.map((topic) => (
                      <Button
                        key={topic}
                        type="button"
                        size="sm"
                        variant={formState.wantsToLearn.includes(topic) ? "default" : "outline"}
                        className="rounded-full capitalize"
                        onClick={() => toggleMulti("wantsToLearn", topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                    <Button type="button" size="sm" variant={formState.wantsToLearnOther ? "default" : "outline"} className="rounded-full">
                      Other
                    </Button>
                  </div>
                  <Input
                    value={formState.wantsToLearnOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, wantsToLearnOther: event.target.value }))
                    }
                    placeholder="Other learning topic"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Learning style</p>
                  <div className="flex flex-wrap gap-2">
                    {learningStyleOptions.map((style) => (
                      <Button
                        key={style}
                        type="button"
                        size="sm"
                        variant={formState.learningStyle.includes(style) ? "default" : "outline"}
                        className="rounded-full capitalize"
                        onClick={() => toggleMulti("learningStyle", style)}
                      >
                        {style}
                      </Button>
                    ))}
                    <Button type="button" size="sm" variant={formState.learningStyleOther ? "default" : "outline"} className="rounded-full">
                      Other
                    </Button>
                  </div>
                  <Input
                    value={formState.learningStyleOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, learningStyleOther: event.target.value }))
                    }
                    placeholder="Other learning style"
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium">What can you teach?</p>
                  <div className="flex flex-wrap gap-2">
                    {teachingTopicOptions.map((topic) => (
                      <Button
                        key={topic}
                        type="button"
                        size="sm"
                        variant={formState.canTeach.includes(topic) ? "default" : "outline"}
                        className="rounded-full capitalize"
                        onClick={() => toggleMulti("canTeach", topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                    <Button type="button" size="sm" variant={formState.canTeachOther ? "default" : "outline"} className="rounded-full">
                      Other
                    </Button>
                  </div>
                  <Input
                    value={formState.canTeachOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, canTeachOther: event.target.value }))
                    }
                    placeholder="Other teaching topic"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Teaching style</p>
                  <div className="flex flex-wrap gap-2">
                    {teachingStyleOptions.map((style) => (
                      <Button
                        key={style}
                        type="button"
                        size="sm"
                        variant={formState.teachingStyle.includes(style) ? "default" : "outline"}
                        className="rounded-full capitalize"
                        onClick={() => toggleMulti("teachingStyle", style)}
                      >
                        {style}
                      </Button>
                    ))}
                    <Button type="button" size="sm" variant={formState.teachingStyleOther ? "default" : "outline"} className="rounded-full">
                      Other
                    </Button>
                  </div>
                  <Input
                    value={formState.teachingStyleOther}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, teachingStyleOther: event.target.value }))
                    }
                    placeholder="Other teaching style"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Available hours</p>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3" onMouseLeave={stopAvailabilityDrag}>
                    <div className="overflow-x-auto">
                      <div className="grid min-w-[720px] grid-cols-[88px_repeat(7,minmax(70px,1fr))] gap-1 text-xs">
                        <div className="p-2 font-medium text-slate-500">Time</div>
                        {calendarDays.map((day) => (
                          <div key={day} className="p-2 text-center font-medium text-slate-500">
                            {day}
                          </div>
                        ))}

                        {calendarHours.map((hour) => (
                          <div key={hour} className="contents">
                            <div className="p-2 text-slate-500">{formatHourLabel(hour)}</div>
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
                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                      : "border-slate-300 bg-white hover:border-emerald-300"
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
                    <div className="mt-2 text-xs text-slate-600">Selected slots: {formState.availableHours.length}</div>
                  </div>
                </div>
              </>
            )}

            {statusMessage ? <p className="text-sm text-red-600">{statusMessage}</p> : null}

            <div className="flex gap-3 pt-2">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((current) => (current === 3 ? 2 : 1))}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              ) : null}

              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : currentStep === 3
                    ? "Finish Sign Up"
                    : "Save and Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
