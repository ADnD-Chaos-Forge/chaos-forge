import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("landing");
  const user = await getOptionalUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6"
      data-testid="landing-page"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-heading tracking-wide text-primary sm:text-5xl">
          {t("tagline")}
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">{t("subtitle")}</p>
        <Link href="/login">
          <Button size="lg" data-testid="cta-login-button">
            {t("cta")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
