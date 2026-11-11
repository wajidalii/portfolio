# Contributing

Link work to an issue and milestone. Branch from current `main` using
`feat/<issue>-<short-description>`, `fix/<issue>-<short-description>`, `perf/<issue>-<short-description>`, or
`chore/<issue>-<short-description>`. Keep each PR focused and avoid force-pushing
shared branches.

Use Conventional Commits, for example `fix(seo): preserve crawler exclusions`.
Use the same format for PR titles so squash merges preserve useful history.
Describe the problem, resulting behavior, validation, and remaining limitations;
use `Closes #<issue>` only when all issue acceptance criteria are delivered.
Never commit credentials or production database exports.

Before review: `npm ci`, `npm run lint`, `npx tsc --noEmit`, database migration
and seed against a disposable local database, and `npm run build`. Run Lighthouse
against a production build for rendering changes. Record URL, version, device,
metrics, and whether results are local or deployed. Inspect responsive behavior,
keyboard access, reduced motion, and content without JavaScript.

Require successful CI and reviewer approval before merging. Prefer squash merge,
then delete the feature branch. Configure branch protection in repository settings
if it is not already enabled. Never merge solely because Lighthouse SEO is 100.
