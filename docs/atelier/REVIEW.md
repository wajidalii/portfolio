# Review order and ownership

Milestone: [Portfolio vNext — Midnight Atelier Redesign](https://github.com/wajidalii/portfolio/milestone/3).
All 16 requested workstreams are recorded in [workstreams.json](workstreams.json),
with scope, tasks, acceptance criteria, dependencies, tests and definition of done
in each GitHub issue (#92–107). Existing services issues are not duplicated or
closed by this design work.

1. [PR108 — audit and plan](https://github.com/wajidalii/portfolio/pull/108),
   `docs/midnight-atelier-audit`, base main.
2. [PR109 — public experience](https://github.com/wajidalii/portfolio/pull/109),
   `feat/midnight-atelier-experience`, base audit branch.
3. [PR110 — quality/performance/documentation](https://github.com/wajidalii/portfolio/pull/110),
   `test/midnight-atelier-quality`, base experience branch.
   Current hosted check results are available on the PR.

These are stacked review branches; retarget each child to main after its parent
merges, retaining ancestry or resolving the documented stack normally. Do not
force-push shared branches. Treat the completed stack as a release unit; avoid deploying intermediate branches.
No direct commit to main, production deploy or merge
is performed for this task. GitHub currently reports main unprotected; recheck
active policies and review/check requirements at merge time rather than assuming
this remains true. Initial PR 109 CI failure was an outdated homepage text assertion;
that assertion was updated and the subsequent hosted run passed. Final quality
PR must pass its own expanded workflow before being considered ready.
