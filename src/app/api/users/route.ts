import { NextResponse } from "next/server";

import { listUsers, upsertUser, type LoginProvider } from "@/lib/user-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UserPayload = {
  name?: string;
  email?: string;
  password?: string;
  authProvider?: LoginProvider;
  realName?: string;
  aboutMe?: string;
  interests?: string[];
};

function parseProvider(provider: unknown): LoginProvider {
  return provider === "google" ? "google" : "email";
}

export async function GET() {
  const users = await listUsers();

  return NextResponse.json({
    total: users.length,
    users,
  });
}

export async function POST(request: Request) {
  let payload: UserPayload;

  try {
    payload = (await request.json()) as UserPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim().toLowerCase();
  const password = payload.password ?? "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 }
    );
  }

  const savedUser = await upsertUser({
    name,
    email,
    password,
    authProvider: parseProvider(payload.authProvider),
    realName: payload.realName,
    aboutMe: payload.aboutMe,
    interests: payload.interests,
  });

  const users = await listUsers();

  return NextResponse.json({
    message: "User saved successfully.",
    savedUser,
    total: users.length,
    users,
  });
}
