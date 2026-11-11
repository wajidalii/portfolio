/** Explicit migration runner: never calls db:push or changes production implicitly. */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

type Snapshot = { tables: Record<string, { name: string; columns: Record<string, { name: string; type: string; notNull: boolean }> }> };
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const folder = resolve("drizzle");
  try {
    if (process.argv.includes("--baseline-existing")) {
      // Existing deployments originally used db:push. Baseline only after a
      // strict shape check of the first two migrations, never silently.
      const snapshot = JSON.parse(await readFile(resolve(folder, "meta/0001_snapshot.json"), "utf8")) as Snapshot;
      const rows = await client<{ table_name: string; column_name: string; data_type: string; udt_name: string; is_nullable: string }[]>`
        select table_name, column_name, data_type, udt_name, is_nullable from information_schema.columns where table_schema='public'`;
      for (const table of Object.values(snapshot.tables)) {
        for (const column of Object.values(table.columns)) {
          const actual = rows.find((row) => row.table_name === table.name && row.column_name === column.name);
          const type = column.type === "serial" ? "int4" : column.type === "integer" ? "int4" : column.type === "timestamp" ? "timestamp" : column.type;
          if (!actual || actual.udt_name !== type || (column.notNull && actual.is_nullable !== "NO")) throw new Error(`Baseline mismatch at ${table.name}.${column.name}; migration stopped`);
        }
      }
      const enums = await client<{ enumlabel: string }[]>`select e.enumlabel from pg_enum e join pg_type t on t.oid=e.enumtypid where t.typname='upcoming_project_status' order by e.enumsortorder`;
      if (enums.map((row) => row.enumlabel).join(",") !== "planned,in_progress") throw new Error("Baseline enum mismatch; migration stopped");
      // Only journal writes occur here. Additive schema work remains in 0002.
      await client.begin(async (tx) => {
        await tx`create schema if not exists drizzle`;
        await tx`create table if not exists drizzle.__drizzle_migrations (id serial primary key, hash text not null, created_at bigint)`;
        const existing = await tx`select id from drizzle.__drizzle_migrations limit 1`;
        if (existing.length) throw new Error("Migration history already exists; omit --baseline-existing");
        const journal = JSON.parse(await readFile(resolve(folder, "meta/_journal.json"), "utf8")) as { entries: { idx: number; tag: string; when: number }[] };
        for (const entry of journal.entries.filter((entry) => entry.idx <= 1)) {
          const hash = createHash("sha256").update(await readFile(resolve(folder, `${entry.tag}.sql`), "utf8")).digest("hex");
          await tx`insert into drizzle.__drizzle_migrations (hash, created_at) values (${hash}, ${entry.when})`;
        }
      });
      console.info("Verified legacy schema and recorded initial migration baseline.");
    }
    await migrate(drizzle(client), { migrationsFolder: folder });
    console.info("Database migrations complete.");
  } finally { await client.end(); }
}
main().catch(() => {
  // Connection strings and driver errors can contain credentials; log no raw error.
  console.error("Migration failed. Verify database access and migration history. For legacy db:push databases use the documented baseline procedure on a backup first.");
  process.exitCode = 1;
});
