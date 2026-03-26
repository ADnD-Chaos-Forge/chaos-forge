export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-heading tracking-wide text-primary sm:text-5xl">
          Schmiede deine Legende
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Charakter-Manager &amp; Session-Tracker f&uuml;r AD&amp;D 2nd Edition.
        </p>
      </div>
    </div>
  );
}
