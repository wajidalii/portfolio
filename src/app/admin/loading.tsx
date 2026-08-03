export default function AdminLoading() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto flex items-center justify-center">
      <div
        role="status"
        aria-label="Loading"
        className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin"
      />
    </main>
  );
}
