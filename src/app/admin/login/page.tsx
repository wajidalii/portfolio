export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        action="/api/admin/login"
        method="POST"
        className="w-full max-w-sm border border-border rounded-2xl bg-surface p-8"
      >
        <h1 className="font-display text-xl font-semibold mb-1">Admin sign in</h1>
        <p className="text-muted text-sm mb-6">
          {params.from ? `Sign in to continue to ${params.from}` : "Enter the admin password."}
        </p>
        {params.error && (
          <p className="mb-4 text-sm font-mono text-red-400">
            Incorrect password.
          </p>
        )}
        {params.from && <input type="hidden" name="from" value={params.from} />}
        <label htmlFor="password" className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className="w-full mb-6 rounded-lg border border-border bg-bg px-3 py-2.5 text-text"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-accent px-4 py-2.5 font-semibold text-[#08090a]"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
