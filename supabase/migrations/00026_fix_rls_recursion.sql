-- Fix infinite recursion between characters and character_shares RLS policies.
-- The old "Owner can manage shares" policy on character_shares does EXISTS on characters,
-- which triggers the characters SELECT policy, which does EXISTS on character_shares → loop.
--
-- Fix: Replace the character_shares owner policy with a direct user_id check
-- using a security-definer function that bypasses RLS.

-- 1. Create a helper function to check character ownership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_character_owner(char_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.characters WHERE id = char_id AND user_id = auth.uid()
  );
$$;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Owner can manage shares" ON character_shares;

-- 3. Recreate with the security-definer function (no recursion)
CREATE POLICY "Owner can manage shares" ON character_shares
  FOR ALL
  USING (public.is_character_owner(character_id))
  WITH CHECK (public.is_character_owner(character_id));
