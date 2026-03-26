import { redirect } from "next/navigation";
import { createClient } from "./server";

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

const DEV_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "dev@chaosforge.local",
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  user_metadata: { display_name: "Dev User" },
  created_at: new Date().toISOString(),
} as const;

export async function requireAuth() {
  if (isDev() && !isSupabaseConfigured()) {
    return DEV_USER;
  }

  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getOptionalUser() {
  if (isDev() && !isSupabaseConfigured()) {
    return DEV_USER;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
