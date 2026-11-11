# GitHub workstreams

Milestone: https://github.com/wajidalii/portfolio/milestone/2

- [#72 Product requirements and information architecture](https://github.com/wajidalii/portfolio/issues/72)
- [#73 Services landing page](https://github.com/wajidalii/portfolio/issues/73)
- [#74 Service packages and pricing presentation](https://github.com/wajidalii/portfolio/issues/74)
- [#75 Verified case studies and project evidence](https://github.com/wajidalii/portfolio/issues/75)
- [#76 Inquiry form and secure lead processing](https://github.com/wajidalii/portfolio/issues/76)
- [#77 Consultation booking integration](https://github.com/wajidalii/portfolio/issues/77)
- [#78 Lead management and admin integration](https://github.com/wajidalii/portfolio/issues/78)
- [#79 Proposal template](https://github.com/wajidalii/portfolio/issues/79)
- [#80 Invoice template](https://github.com/wajidalii/portfolio/issues/80)
- [#81 SEO GEO and structured data](https://github.com/wajidalii/portfolio/issues/81)
- [#82 Analytics and conversion tracking](https://github.com/wajidalii/portfolio/issues/82)
- [#83 Responsive design accessibility and animations](https://github.com/wajidalii/portfolio/issues/83)
- [#84 Security testing and performance](https://github.com/wajidalii/portfolio/issues/84)
- [#85 Documentation and deployment readiness](https://github.com/wajidalii/portfolio/issues/85)

PRs are stacked and remain unmerged pending CI and owner review.

## Review order and branches

| PR | Branch → base | Scope |
| --- | --- | --- |
| [#86](https://github.com/wajidalii/portfolio/pull/86) | docs/client-acquisition-plan → main | Requirements and issue map |
| [#87](https://github.com/wajidalii/portfolio/pull/87) | feat/76-lead-inquiry-workflow → docs/client-acquisition-plan | Durable inquiry processing and migration |
| [#88](https://github.com/wajidalii/portfolio/pull/88) | feat/73-services-landing-page → feat/76-lead-inquiry-workflow | Public services MVP and conversion/SEO integration |
| [#89](https://github.com/wajidalii/portfolio/pull/89) | feat/79-proposal-invoice-templates → feat/73-services-landing-page | Independent business documents |
| [#90](https://github.com/wajidalii/portfolio/pull/90) | feat/78-lead-management → feat/79-proposal-invoice-templates | Private operations and login hardening |
| Final validation PR | test/84-services-conversion-flows → feat/78-lead-management | E2E/axe/CI, regression fixes, audit evidence and release guide |

These are stacked PRs: the final branch contains the integrated reviewable platform.
Retarget dependent PRs deliberately as bases merge, re-run checks on changed merge
bases, and require repository protections/reviews. Branch-protection read failed403;
no PR was merged or production deployment requested by this implementation.
All14 issues remain open pending review/release; implementation is not a claim
that external credentials, production migration or real provider delivery are verified.
