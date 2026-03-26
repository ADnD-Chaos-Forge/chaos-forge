import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || !TEST_EMAIL || !TEST_PASSWORD) {
    return NextResponse.json({ error: "not_configured" }, { status: 404 });
  }

  // Check if the email matches the configured test email
  const body = await request.json().catch(() => ({}));
  if (body.email?.toLowerCase() !== TEST_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "not_test_user" }, { status: 404 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Check if test user exists, if not create
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const testUser = existingUsers?.users?.find((u) => u.email === TEST_EMAIL);

  if (!testUser) {
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: "Testaccount" },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
  }

  // Sign in with password to get a session
  const supabaseClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Return the session tokens — the client will set them as cookies
  return NextResponse.json({
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
  });
}
