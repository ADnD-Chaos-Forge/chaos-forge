export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-heading tracking-wide text-primary sm:text-6xl">
          Chaos Forge
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Schmiede deine Legende. Charakter-Manager &amp; Session-Tracker f&uuml;r AD&amp;D 2nd
          Edition.
        </p>
      </main>
    </div>
  );
}
