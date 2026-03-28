import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Supabase Admin Client (bypasses RLS) ──────────────────────────────────

let _admin: SupabaseClient | null = null;

function getAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  _admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _admin;
}

// ─── User helpers ──────────────────────────────────────────────────────────

const TEST_EMAIL = "christoph@chaos-forge.de";
const OTHER_EMAIL = "e2e-other@chaos-forge.de";
const PASSWORD = "test-chaos-forge-2026!";

async function ensureUser(email: string): Promise<string> {
  const admin = getAdmin();
  const { data } = await admin.auth.admin.listUsers();
  const existing = data?.users?.find((u) => u.email === email);
  if (existing) return existing.id;

  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: email.split("@")[0] },
  });
  if (error) throw new Error(`Failed to create user ${email}: ${error.message}`);
  return created.user.id;
}

export async function getTestUserId(): Promise<string> {
  return ensureUser(TEST_EMAIL);
}

export async function getOtherUserId(): Promise<string> {
  return ensureUser(OTHER_EMAIL);
}

// ─── Character CRUD ────────────────────────────────────────────────────────

export interface TestCharacterData {
  name: string;
  race_id: string;
  class_id: string;
  level: number;
  alignment: string;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  hp_max: number;
  hp_current: number;
  is_public: boolean;
  kit?: string | null;
}

export async function createCharacter(userId: string, data: TestCharacterData): Promise<string> {
  const admin = getAdmin();
  const { data: char, error } = await admin
    .from("characters")
    .insert({
      user_id: userId,
      name: data.name,
      race_id: data.race_id,
      class_id: data.class_id,
      level: data.level,
      alignment: data.alignment,
      str: data.str,
      dex: data.dex,
      con: data.con,
      int: data.int,
      wis: data.wis,
      cha: data.cha,
      hp_max: data.hp_max,
      hp_current: data.hp_current,
      is_public: data.is_public,
      kit: data.kit ?? null,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create character "${data.name}": ${error.message}`);

  // Insert into character_classes
  await admin.from("character_classes").insert({
    character_id: char.id,
    class_id: data.class_id,
    level: data.level,
    xp_current: 0,
    is_active: true,
  });

  return char.id;
}

export async function deleteCharacter(id: string): Promise<void> {
  const admin = getAdmin();
  await admin.from("characters").delete().eq("id", id);
}

// ─── Spell helpers (for caster tests) ──────────────────────────────────────

export async function learnSpell(characterId: string, spellId: string): Promise<void> {
  const admin = getAdmin();
  await admin.from("character_spells").insert({
    character_id: characterId,
    spell_id: spellId,
    is_prepared: false,
  });
}

export async function getFirstSpellId(): Promise<string> {
  const admin = getAdmin();
  const { data } = await admin.from("spells").select("id").limit(1).single();
  if (!data) throw new Error("No spells in database");
  return data.id;
}

// ─── Pre-built test character templates ────────────────────────────────────

export const FIGHTER_TEMPLATE: TestCharacterData = {
  name: "E2E-Fighter",
  race_id: "human",
  class_id: "fighter",
  level: 5,
  alignment: "true_neutral",
  str: 16,
  dex: 12,
  con: 14,
  int: 10,
  wis: 10,
  cha: 10,
  hp_max: 40,
  hp_current: 40,
  is_public: false,
};

export const CASTER_TEMPLATE: TestCharacterData = {
  name: "E2E-Caster",
  race_id: "elf",
  class_id: "mage",
  level: 5,
  alignment: "neutral_good",
  str: 8,
  dex: 14,
  con: 10,
  int: 17,
  wis: 12,
  cha: 12,
  hp_max: 15,
  hp_current: 15,
  is_public: true,
};

// ─── Full test setup / teardown ────────────────────────────────────────────

export interface TestFixture {
  testUserId: string;
  otherUserId: string;
  ownFighterId: string;
  otherCasterId: string;
}

export async function setupTestData(prefix = ""): Promise<TestFixture> {
  const testUserId = await getTestUserId();
  const otherUserId = await getOtherUserId();
  const suffix = prefix ? `-${prefix}` : `-${Date.now()}`;

  // Create own fighter (owned by test user)
  const ownFighterId = await createCharacter(testUserId, {
    ...FIGHTER_TEMPLATE,
    name: `E2E-Fighter${suffix}`,
  });

  // Create other caster (owned by other user, public so test user can see it)
  const otherCasterId = await createCharacter(otherUserId, {
    ...CASTER_TEMPLATE,
    name: `E2E-Caster${suffix}`,
  });

  // Give the caster a spell so spellbook is available
  const spellId = await getFirstSpellId();
  await learnSpell(otherCasterId, spellId);

  return { testUserId, otherUserId, ownFighterId, otherCasterId };
}

export async function teardownTestData(fixture: TestFixture): Promise<void> {
  await deleteCharacter(fixture.ownFighterId).catch(() => {});
  await deleteCharacter(fixture.otherCasterId).catch(() => {});
}
