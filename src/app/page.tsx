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
      <div className="glass glow-neutral rounded-xl p-8 sm:p-12 text-center max-w-lg">
        <h1 className="text-4xl font-heading tracking-wide text-primary sm:text-5xl">
          {t("tagline")}
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">{t("subtitle")}</p>
        <Link href="/login" className="mt-6 inline-block">
          <Button size="lg" data-testid="cta-login-button">
            {t("cta")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
