"use client";

import { useEffect, useState } from "react";

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
  email: string;
  password: string;
  authProvider: LoginProvider;
  questionnaireCompleted: boolean;
  preferences: {
    wantsToLearn: string;
    canTeach: string;
    learningStyle: string;
    teachingStyle: string;
    availableHours: string;
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
  name: "Marin Demo",
  email: "marin.demo@gmail.com",
  password: "demo1234",
  authProvider: "google" as const,
  realName: "Marin",
  aboutMe: "I like meeting people and learning by building things.",
  interests: ["reading", "cooking"],
};

const interestOptions = [
  "sports",
  "cooking",
  "reading",
  "music",
  "travel",
  "games",
  "art",
  "fitness",
  "coding",
];

export default function Home() {
  const [formState, setFormState] = useState({
    name: "",
    realName: "",
    aboutMe: "",
    interests: [] as string[],
    email: "",
    password: "",
    authProvider: "email" as LoginProvider,
  });
  const [savedUser, setSavedUser] = useState<StoredUser | null>(null);
  const [savedUsers, setSavedUsers] = useState<StoredUser[]>([]);
  const [statusMessage, setStatusMessage] = useState(
    "Create the first profile to confirm the JSON write flow."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("Saving user to data/users.json...");

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
        throw new Error(data.error ?? "Unable to save the user.");
      }

      setSavedUser(data.savedUser ?? null);
      setSavedUsers(data.users ?? []);
      setStatusMessage(data.message ?? "User saved successfully.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unexpected save error.");
    } finally {
      setIsSubmitting(false);
    }
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
                Step 1: create the profile basics and save them to JSON.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Ask for the real name, a short about-you section, and a few interest tags
                so matching can start from the first step.
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
                  Only the first step of the wizard is active right now.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>Login email and password</p>
                <p>Optional real name and about-you text</p>
                <p>Interest chips for smarter matching</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-slate-50/90 shadow-none">
              <CardHeader>
                <CardTitle>Planned next step</CardTitle>
                <CardDescription>
                  The learning and teaching pages will reuse the same saved profile.
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
              <CardTitle>Create the first user</CardTitle>
              <CardDescription>
                Save the step 1 profile to <span className="font-medium text-slate-800">data/users.json</span> and show the result below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
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
                    placeholder="Marin"
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
                  </div>
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
                    placeholder="marin@skillswap.dev"
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
                    {isSubmitting ? "Saving..." : "Create user"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={fillDemoGoogleLogin}>
                    Prefill Gmail demo
                  </Button>
                </div>
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
