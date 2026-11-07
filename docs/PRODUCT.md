# Product plan

## ICP, JTBD, and MVP
**ICP:** US creator-agency operations leads managing 5–50 creators with at least $5K/month each and material dependence on YouTube, Instagram, TikTok, or X.

**JTBD:** “Before an incident, show which revenue-critical assets and contacts I cannot restore, then prove my team can stand up an owned continuity channel within 72 hours.”

**MVP:** roster readiness assessment → weighted risk score → named exposure gaps → 72-hour drill plan → dated evidence record. Demo data and logic are explicit and fictional; no platform APIs, creator data, or AI claims.

## Data model
- `RosterProfile`: creators, revenue, platform dependence, archive coverage, portable contacts, standby status, sponsor evidence, last drill age.
- `Assessment`: resilience score, risk band, exposed revenue, findings, rule version.
- `DrillTask`: owner, deadline, completion, evidence requirement.
- Future: tenant-scoped `EvidenceArtifact`, `PlatformAccount`, `Incident`, immutable `DrillRun`.

## Architecture and AI strategy
The static Next.js demo and FastAPI endpoint implement the same deterministic scoring contract against explicit fixtures. Production moves canonical calculation to FastAPI, uses Postgres, encrypted object storage, and queued export checks. AI is unnecessary for core decisions; later it may classify manifests or draft cited incident summaries. Eligibility remains deterministic and versioned.

## Economics, validation, moat
- Free scorecard → $1,500 audit → $99–$149/creator/month retainer.
- Target initial gross margin 50–65%, rising after workflow standardization.
- Kill if 30 qualified agencies yield fewer than five assessments or three paid commitments.
- Measure paid conversion, time-to-standby, missing artifacts, repeat improvement, retention, and broker acceptance.
- Potential moat: longitudinal, versioned readiness evidence plus trusted agency/underwriter workflows—not storage.

## Risks and 30/60/90
False assurance requires dates, versions, evidence gaps, and a non-guarantee. Sensitive data requires least privilege, encryption, tenant isolation, and deletion. API drift requires approved exports, provenance, health checks, and kill switches. Trust requires published methodology; low urgency requires paid proof first.

- **30 days:** 30 conversations, five observations, three paid audits.
- **60 days:** ten audits, versioned schema, repeatability analysis, broker design interview.
- **90 days:** build monitoring only if gaps converge; otherwise remain an audit service or stop.
