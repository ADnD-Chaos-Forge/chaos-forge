-- Add email column to profiles for direct querying (no admin API needed)
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Backfill email from auth.users
UPDATE public.profiles
SET email = u.email
FROM auth.users u
WHERE profiles.id = u.id;

-- Update trigger to also set email on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Abenteurer'),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow all authenticated users to read all profiles (needed for share dialog)
CREATE POLICY "Authenticated users can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');
