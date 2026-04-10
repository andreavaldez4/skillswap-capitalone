import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type LoginProvider = "email" | "google";

export type UserPreferences = {
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

export type StoredUser = {
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
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
  authProvider?: LoginProvider;
  realName?: string;
  aboutMe?: string;
  interests?: string[];
  interestsOther?: string;
  preferences?: Partial<UserPreferences>;
  questionnaireCompleted?: boolean;
};

const dataDirectory = path.join(process.cwd(), "data");
const usersFilePath = path.join(dataDirectory, "users.json");

const emptyPreferences: UserPreferences = {
  wantsToLearn: [],
  wantsToLearnOther: "",
  canTeach: [],
  canTeachOther: "",
  learningStyle: [],
  learningStyleOther: "",
  teachingStyle: [],
  teachingStyleOther: "",
  availableHours: [],
};

function normalizeList(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

async function ensureUsersFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await access(usersFilePath);
  } catch {
    await writeFile(usersFilePath, "[]\n", "utf8");
  }
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureUsersFile();

  const rawContents = await readFile(usersFilePath, "utf8");

  try {
    const parsed = JSON.parse(rawContents) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await ensureUsersFile();
  await writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

export async function listUsers() {
  return readUsers();
}

export async function upsertUser(input: UserInput) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedName = input.name.trim();
  const normalizedPassword = input.password;
  const provider = input.authProvider ?? "email";
  const normalizedRealName = input.realName?.trim() ?? "";
  const normalizedAboutMe = input.aboutMe?.trim() ?? "";
  const normalizedInterests = Array.from(
    new Set((input.interests ?? []).map((interest) => interest.trim()).filter(Boolean))
  );
  const normalizedInterestsOther = input.interestsOther?.trim() ?? "";
  const normalizedPreferences: Partial<UserPreferences> = {};

  if (Array.isArray(input.preferences?.wantsToLearn)) {
    normalizedPreferences.wantsToLearn = normalizeList(input.preferences.wantsToLearn);
  }

  if (typeof input.preferences?.wantsToLearnOther === "string") {
    normalizedPreferences.wantsToLearnOther = input.preferences.wantsToLearnOther.trim();
  }

  if (Array.isArray(input.preferences?.canTeach)) {
    normalizedPreferences.canTeach = normalizeList(input.preferences.canTeach);
  }

  if (typeof input.preferences?.canTeachOther === "string") {
    normalizedPreferences.canTeachOther = input.preferences.canTeachOther.trim();
  }

  if (Array.isArray(input.preferences?.learningStyle)) {
    normalizedPreferences.learningStyle = normalizeList(input.preferences.learningStyle);
  }

  if (typeof input.preferences?.learningStyleOther === "string") {
    normalizedPreferences.learningStyleOther = input.preferences.learningStyleOther.trim();
  }

  if (Array.isArray(input.preferences?.teachingStyle)) {
    normalizedPreferences.teachingStyle = normalizeList(input.preferences.teachingStyle);
  }

  if (typeof input.preferences?.teachingStyleOther === "string") {
    normalizedPreferences.teachingStyleOther = input.preferences.teachingStyleOther.trim();
  }

  if (Array.isArray(input.preferences?.availableHours)) {
    normalizedPreferences.availableHours = normalizeList(input.preferences.availableHours);
  }

  const users = await readUsers();
  const existingUserIndex = users.findIndex((user) => user.email.toLowerCase() === normalizedEmail);
  const timestamp = new Date().toISOString();

  const baseUser: StoredUser = existingUserIndex >= 0
    ? {
        ...users[existingUserIndex],
        name: normalizedName,
        realName: normalizedRealName,
        aboutMe: normalizedAboutMe,
        interests: normalizedInterests,
        interestsOther: normalizedInterestsOther,
        preferences: {
          ...emptyPreferences,
          ...users[existingUserIndex].preferences,
          ...normalizedPreferences,
        },
        email: normalizedEmail,
        password: normalizedPassword,
        authProvider: provider,
        questionnaireCompleted:
          typeof input.questionnaireCompleted === "boolean"
            ? input.questionnaireCompleted
            : users[existingUserIndex].questionnaireCompleted,
        updatedAt: timestamp,
      }
    : {
        id: randomUUID(),
        name: normalizedName,
        realName: normalizedRealName,
        aboutMe: normalizedAboutMe,
        interests: normalizedInterests,
        interestsOther: normalizedInterestsOther,
        preferences: {
          ...emptyPreferences,
          ...normalizedPreferences,
        },
        email: normalizedEmail,
        password: normalizedPassword,
        authProvider: provider,
        questionnaireCompleted: input.questionnaireCompleted ?? false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

  if (existingUserIndex >= 0) {
    users[existingUserIndex] = baseUser;
  } else {
    users.unshift(baseUser);
  }

  await writeUsers(users);
  return baseUser;
}
