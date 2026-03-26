import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6"
      data-testid="not-found-page"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-6xl text-primary">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("message")}</p>
        <Link href="/">
          <Button>{t("backHome")}</Button>
        </Link>
      </div>
    </div>
  );
}
