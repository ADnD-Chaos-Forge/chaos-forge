/**
 * Pick the localized text based on the current locale.
 * Falls back to German (de) if no English text is available.
 */
export function localized(de: string, en: string | null | undefined, locale: string): string {
  return locale === "en" && en ? en : de;
}
