export default function Home() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-4">
          Phase 3 — global layout
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Wajid Ali<span className="text-muted font-normal">.dev</span>
        </h1>
        <p className="mt-4 text-muted max-w-md mx-auto">
          Nav, footer, and theme toggle are wired up. Sections land in the
          following phases.
        </p>
      </div>
    </div>
  );
}
