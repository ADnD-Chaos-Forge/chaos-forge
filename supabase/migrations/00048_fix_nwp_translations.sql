-- Fix 4 NWPs missing English translations
UPDATE public.nonweapon_proficiencies SET name_en = 'Weaponsmithing' WHERE name = 'Waffenschmied' AND name_en IS NULL;
UPDATE public.nonweapon_proficiencies SET name_en = 'Carpentry' WHERE name = 'Zimmermannskunst' AND name_en IS NULL;
UPDATE public.nonweapon_proficiencies SET name_en = 'Pottery' WHERE name = 'Töpfern' AND name_en IS NULL;
UPDATE public.nonweapon_proficiencies SET name_en = 'Modern Languages' WHERE name = 'Moderne Sprachen' AND name_en IS NULL;
