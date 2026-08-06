import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TEST_DOMAIN } from "@/lib/test/constants";

/**
 * Removes test characters created by the E2E test seed.
 * Only works for test-domain users.
 *
 * Deletes EVERY character owned by a test-domain user — deliberately not a
 * fixed name list. A list silently misses every character a new test suite
 * introduces: the rescan specs left 49 orphans in production because their
 * "QA-Rescan-*" names were never added here. Ownership is the safe criterion,
 * since test users only ever exist on the reserved .test domain.
 */
export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const email = body.email?.toLowerCase();

  if (!email?.endsWith(TEST_DOMAIN)) {
    return NextResponse.json({ error: "only_test_users" }, { status: 403 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Find all test users
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
  const testUsers = usersData?.users?.filter((u) => u.email?.endsWith(TEST_DOMAIN)) ?? [];
  const testUserIds = testUsers.map((u) => u.id);

  if (testUserIds.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  // Delete all characters owned by test users
  const { data: deleted } = await supabaseAdmin
    .from("characters")
    .delete()
    .in("user_id", testUserIds)
    .select("id");

  // Clean up party loot test data: reset gold to 0, clear log + items created by test users
  await supabaseAdmin
    .from("party_loot_gold")
    .update({ pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 })
    .not("id", "is", null);
  await supabaseAdmin.from("party_loot_items").delete().in("added_by", testUserIds);
  await supabaseAdmin.from("party_loot_log").delete().in("user_id", testUserIds);

  // Clean up QA NPCs. Matched by name alone: the seeded NPC carries no
  // created_by, so the previous owner filter never caught it and left it in
  // production. No real NPC uses the QA- prefix.
  await supabaseAdmin.from("chronicle_npcs").delete().like("name", "QA-%");

  return NextResponse.json({ deleted: deleted?.length ?? 0 });
}
