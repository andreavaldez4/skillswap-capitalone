"use client";

import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LoginProvider = "email" | "google";

type StoredUser = {
  id: string;
  name: string;
  realName: string;
  aboutMe: string;
  interests: string[];
  interestsOther: string;
  email: string;
  password: string;
  authProvider: LoginProvider;
  questionnaireCompleted: boolean;
  preferences: {
    wantsToLearn: string[];
    wantsToLearnOther: string;
    canTeach: string[];
    canTeachOther: string;
    learningStyle: string[];
    learningStyleOther: string;
    teachingStyle: string[];
    teachingStyleOther: string;
    availableHours: string[];
  };
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  message?: string;
  error?: string;
  savedUser?: StoredUser;
  users?: StoredUser[];
  total?: number;
};

const demoGoogleUser = {
  name: "demo_user",
  email: "demo.user@gmail.com",
  password: "demo1234",
  authProvider: "google" as const,
  realName: "Demo User",
  aboutMe: "I like meeting people and learning by building things.",
  interests: ["reading", "cooking"],
  interestsOther: "board games",
  wantsToLearn: ["product design", "storytelling"],
  wantsToLearnOther: "copywriting",
  learningStyle: ["hands-on", "visual"],
  learningStyleOther: "project-based",
  canTeach: ["coding", "music"],
  canTeachOther: "guitar basics",
  teachingStyle: ["slow and steady", "one-on-one"],
  teachingStyleOther: "feedback-driven",
  availableHours: ["Mon-19", "Wed-19", "Thu-20"],
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
const calendarHours = [
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
];

function formatHourLabel(hour24: string) {
  const raw = Number(hour24);
  const hour12 = raw % 12 === 0 ? 12 : raw % 12;
  const suffix = raw >= 12 ? "PM" : "AM";
  return `${hour12}:00 ${suffix}`;
}

export default function Home() {
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
  const [savedUser, setSavedUser] = useState<StoredUser | null>(null);
  const [savedUsers, setSavedUsers] = useState<StoredUser[]>([]);
  const [statusMessage, setStatusMessage] = useState(
    "Create the first profile to confirm the JSON write flow."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingAvailability, setIsDraggingAvailability] = useState(false);
  const [availabilityDragMode, setAvailabilityDragMode] = useState<"add" | "remove" | null>(null);
  const availabilityVisitedSlots = useRef<Set<string>>(new Set());

  useEffect(() => {
    void refreshUsers();
  }, []);

  async function refreshUsers() {
    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      const data = (await response.json()) as ApiResponse;

      if (response.ok) {
        setSavedUsers(data.users ?? []);
      }
    } catch {
      setStatusMessage("Could not read the saved users file yet.");
    }
  }

  function fillDemoGoogleLogin() {
    setFormState(demoGoogleUser);
    setStatusMessage("Demo Gmail values loaded. Submit to save the profile.");
  }

  function toggleInterest(interest: string) {
    setFormState((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  }

  function toggleTopic(
    topic: string,
    field: "wantsToLearn" | "learningStyle" | "canTeach" | "teachingStyle"
  ) {
    setFormState((current) => ({
      ...current,
      [field]: current[field].includes(topic)
        ? current[field].filter((item) => item !== topic)
        : [...current[field], topic],
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

    const onMouseUp = () => {
      stopAvailabilityDrag();
    };

    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDraggingAvailability]);

  async function saveStepOne() {
    setIsSubmitting(true);
    setStatusMessage("Saving step 1 to data/users.json...");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save step 1.");
      }

      setSavedUser(data.savedUser ?? null);
      setSavedUsers(data.users ?? []);
      setStatusMessage("Step 1 saved. Continue to learning preferences.");
      setCurrentStep(2);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unexpected save error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveStepTwo() {
    setIsSubmitting(true);
    setStatusMessage("Saving learning preferences...");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          preferences: {
            wantsToLearn: formState.wantsToLearn,
            wantsToLearnOther: formState.wantsToLearnOther,
            learningStyle: formState.learningStyle,
            learningStyleOther: formState.learningStyleOther,
          },
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save learning preferences.");
      }

      setSavedUser(data.savedUser ?? null);
      setSavedUsers(data.users ?? []);
      setStatusMessage("Learning preferences saved.");
      setCurrentStep(3);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unexpected save error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveStepThree() {
    setIsSubmitting(true);
    setStatusMessage("Saving teaching preferences...");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save teaching preferences.");
      }

      setSavedUser(data.savedUser ?? null);
      setSavedUsers(data.users ?? []);
      setStatusMessage("Step 3 saved. Signup completed.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unexpected save error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentStep === 1) {
      await saveStepOne();
      return;
    }

    if (currentStep === 2) {
      await saveStepTwo();
      return;
    }

    await saveStepThree();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_48%,_#ffffff_100%)] px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-stretch">
        <section className="flex flex-1 flex-col justify-between gap-8 rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge className="rounded-full bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
                Phase 1
              </Badge>
              <span className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
                Local JSON signup
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {currentStep === 1
                  ? "Step 1: create the profile basics."
                  : currentStep === 2
                    ? "Step 2: add learning preferences."
                    : "Step 3: add teaching preferences."}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {currentStep === 1
                  ? "Ask for the real name, a short about-you section, and a few interest tags so matching can start from the first step."
                  : currentStep === 2
                    ? "Tell us what you want to learn and how you like to learn so we can improve the match."
                    : "Now pick what you can teach and your teaching style."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["1", "Account basics"],
                ["2", "Learning later"],
                ["3", "Teaching later"],
              ].map(([step, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 shadow-sm"
                >
                  <div className="text-sm font-semibold text-emerald-700">Step {step}</div>
                  <div className="mt-1 text-sm text-slate-600">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200/80 bg-slate-50/90 shadow-none">
              <CardHeader>
                <CardTitle>What this phase covers</CardTitle>
                <CardDescription>
                    The wizard now moves from profile basics into learning preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>Account basics with optional profile details</p>
                  <p>Learning preferences with multi-select chips</p>
                  <p>Teaching preferences and schedule</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-slate-50/90 shadow-none">
              <CardHeader>
                <CardTitle>Planned next step</CardTitle>
                <CardDescription>
                    Step 3 completes the signup and final JSON payload.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button variant="secondary" disabled className="w-full">
                  Fill preferences later
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="w-full max-w-xl">
          <Card className="border-slate-200/80 bg-white/90 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle>
                {currentStep === 1
                  ? "Create the first user"
                  : currentStep === 2
                    ? "Learning preferences"
                    : "Teaching preferences"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1
                  ? <>Save the step 1 profile to <span className="font-medium text-slate-800">data/users.json</span>.</>
                  : currentStep === 2
                    ? <>Update the same profile with learning preferences.</>
                    : <>Finish signup by saving what the user can teach.</>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {currentStep === 1 ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="name">
                        Username
                      </label>
                      <Input
                        id="name"
                        value={formState.name}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder="demo_user"
                        autoComplete="nickname"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="realName">
                        Real name <span className="text-slate-400">(optional)</span>
                      </label>
                      <Input
                        id="realName"
                        value={formState.realName}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, realName: event.target.value }))
                        }
                        placeholder="Your real name"
                        autoComplete="name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="aboutMe">
                        About you <span className="text-slate-400">(optional)</span>
                      </label>
                      <textarea
                        id="aboutMe"
                        value={formState.aboutMe}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, aboutMe: event.target.value }))
                        }
                        placeholder="Tell others a little about yourself..."
                        className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-medium text-slate-700">
                        What do you like to do? <span className="text-slate-400">(pick a few)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map((interest) => {
                          const isSelected = formState.interests.includes(interest);

                          return (
                            <Button
                              key={interest}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="rounded-full capitalize"
                              onClick={() => toggleInterest(interest)}
                            >
                              {interest}
                            </Button>
                          );
                        })}
                        <Button
                          type="button"
                          variant={formState.interestsOther ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            setFormState((current) => ({
                              ...current,
                              interestsOther: current.interestsOther ? "" : current.interestsOther,
                            }))
                          }
                        >
                          Other
                        </Button>
                      </div>
                      <Input
                        value={formState.interestsOther}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, interestsOther: event.target.value }))
                        }
                        placeholder="Add another interest"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="email">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formState.email}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder="demo.user@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="password">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={formState.password}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, password: event.target.value }))
                        }
                        placeholder="demo-password"
                        autoComplete="new-password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Auth method</span>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={formState.authProvider === "email" ? "default" : "outline"}
                          onClick={() => setFormState((current) => ({ ...current, authProvider: "email" }))}
                        >
                          Email
                        </Button>
                        <Button
                          type="button"
                          variant={formState.authProvider === "google" ? "default" : "outline"}
                          onClick={() => setFormState((current) => ({ ...current, authProvider: "google" }))}
                        >
                          Gmail demo
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? "Saving..." : "Save and continue"}
                      </Button>
                      <Button type="button" variant="secondary" onClick={fillDemoGoogleLogin}>
                        Prefill Gmail demo
                      </Button>
                    </div>
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        What do you want to learn? <span className="text-slate-400">(pick more than one)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {learningTopicOptions.map((topic) => {
                          const isSelected = formState.wantsToLearn.includes(topic);

                          return (
                            <Button
                              key={topic}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="rounded-full capitalize"
                              onClick={() => toggleTopic(topic, "wantsToLearn")}
                            >
                              {topic}
                            </Button>
                          );
                        })}
                        <Button
                          type="button"
                          variant={formState.wantsToLearnOther ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                        >
                          Other
                        </Button>
                      </div>
                      <Input
                        value={formState.wantsToLearnOther}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, wantsToLearnOther: event.target.value }))
                        }
                        placeholder="Add another learning topic"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        How do you like to learn? <span className="text-slate-400">(pick more than one)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {learningStyleOptions.map((style) => {
                          const isSelected = formState.learningStyle.includes(style);

                          return (
                            <Button
                              key={style}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="rounded-full capitalize"
                              onClick={() => toggleTopic(style, "learningStyle")}
                            >
                              {style}
                            </Button>
                          );
                        })}
                        <Button
                          type="button"
                          variant={formState.learningStyleOther ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                        >
                          Other
                        </Button>
                      </div>
                      <Input
                        value={formState.learningStyleOther}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, learningStyleOther: event.target.value }))
                        }
                        placeholder="Add your ideal learning preference"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? "Saving..." : "Save and continue"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        What can you teach? <span className="text-slate-400">(pick more than one)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {teachingTopicOptions.map((topic) => {
                          const isSelected = formState.canTeach.includes(topic);

                          return (
                            <Button
                              key={topic}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="rounded-full capitalize"
                              onClick={() => toggleTopic(topic, "canTeach")}
                            >
                              {topic}
                            </Button>
                          );
                        })}
                        <Button
                          type="button"
                          variant={formState.canTeachOther ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                        >
                          Other
                        </Button>
                      </div>
                      <Input
                        value={formState.canTeachOther}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, canTeachOther: event.target.value }))
                        }
                        placeholder="Add another teaching topic"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Teaching style <span className="text-slate-400">(pick more than one)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {teachingStyleOptions.map((style) => {
                          const isSelected = formState.teachingStyle.includes(style);

                          return (
                            <Button
                              key={style}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="rounded-full capitalize"
                              onClick={() => toggleTopic(style, "teachingStyle")}
                            >
                              {style}
                            </Button>
                          );
                        })}
                        <Button
                          type="button"
                          variant={formState.teachingStyleOther ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                        >
                          Other
                        </Button>
                      </div>
                      <Input
                        value={formState.teachingStyleOther}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, teachingStyleOther: event.target.value }))
                        }
                        placeholder="Add your ideal teaching preference"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="availableHours">
                        Available hours
                      </label>
                      <div
                        className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                        onMouseLeave={stopAvailabilityDrag}
                      >
                        <div className="mb-3 text-xs text-slate-500">
                          Tap slots like when2meet. You can select multiple.
                        </div>
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
                        <div className="mt-2 text-xs text-slate-600">
                          Selected slots: {formState.availableHours.length}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? "Saving..." : "Finish signup"}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-6">
            <Card className="border-slate-200/80 bg-white/90 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Save status</CardTitle>
                <CardDescription>{statusMessage}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Users saved</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">{savedUsers.length}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest provider</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">
                      {savedUser?.authProvider ?? formState.authProvider}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Real name</div>
                    <div className="mt-2 text-base font-medium text-slate-950">
                      {savedUser?.realName || formState.realName || "Not added yet"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Interests</div>
                    <div className="mt-2 text-base font-medium text-slate-950">
                      {(savedUser?.interests ?? formState.interests).length > 0
                        ? (savedUser?.interests ?? formState.interests).join(", ")
                        : "Not added yet"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-slate-700">Last saved user JSON</div>
                  <pre className="overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                    {savedUser
                      ? JSON.stringify(savedUser, null, 2)
                      : "Submit the form to inspect the stored user record."}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white/90 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Saved users preview</CardTitle>
                <CardDescription>
                  This confirms the JSON file can be read back after the write.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {savedUsers.length === 0 ? (
                  <p className="text-sm text-slate-600">No users stored yet.</p>
                ) : (
                  savedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={cn(
                        "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm",
                        savedUser?.id === user.id && "border-emerald-300 bg-emerald-50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-slate-950">{user.name}</div>
                          <div className="text-slate-500">{user.email}</div>
                        </div>
                        <Badge variant="secondary" className="rounded-full">
                          {user.authProvider}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
