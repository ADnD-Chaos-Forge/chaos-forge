import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6"
      data-testid="not-found-page"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-6xl text-primary">404</h1>
        <p className="text-lg text-muted-foreground">
          Diese Seite wurde in den Tiefen des Dungeons verschlungen.
        </p>
        <Link href="/">
          <Button>Zur&uuml;ck zur Taverne</Button>
        </Link>
      </div>
    </div>
  );
}
