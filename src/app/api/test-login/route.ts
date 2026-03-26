import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = "test-chaos-forge-2026!";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || !TEST_EMAIL) {
    return NextResponse.json({ error: "not_configured" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  if (body.email?.toLowerCase() !== TEST_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "not_test_user" }, { status: 404 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Find the test user
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const testUser = existingUsers?.users?.find((u) => u.email === TEST_EMAIL);

  if (!testUser) {
    // Create with password for programmatic login
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: "Testaccount" },
    });
    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
  } else {
    // Ensure password is set (Magic Link users don't have one)
    await supabaseAdmin.auth.admin.updateUserById(testUser.id, {
      password: TEST_PASSWORD,
      email_confirm: true,
    });
  }

  // Now sign in with password
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

  return NextResponse.json({
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
  });
}
