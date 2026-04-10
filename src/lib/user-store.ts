import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type LoginProvider = "email" | "google";

export type UserPreferences = {
  wantsToLearn: string;
  canTeach: string;
  learningStyle: string;
  teachingStyle: string;
  availableHours: string;
};

export type StoredUser = {
  id: string;
  name: string;
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
};

const dataDirectory = path.join(process.cwd(), "data");
const usersFilePath = path.join(dataDirectory, "users.json");

const emptyPreferences: UserPreferences = {
  wantsToLearn: "",
  canTeach: "",
  learningStyle: "",
  teachingStyle: "",
  availableHours: "",
};

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
  const normalizedInterests = Array.from(new Set((input.interests ?? []).map((interest) => interest.trim()).filter(Boolean)));

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
        email: normalizedEmail,
        password: normalizedPassword,
        authProvider: provider,
        updatedAt: timestamp,
      }
    : {
        id: randomUUID(),
        name: normalizedName,
        realName: normalizedRealName,
        aboutMe: normalizedAboutMe,
        interests: normalizedInterests,
        email: normalizedEmail,
        password: normalizedPassword,
        authProvider: provider,
        questionnaireCompleted: false,
        preferences: emptyPreferences,
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
