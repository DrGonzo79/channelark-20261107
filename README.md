# ChannelArk

A runnable prototype for a creator-agency recovery-readiness audit and 72-hour continuity drill, derived from IdeaBrowser’s free 2026-11-07 report.

## What works
- adjust a fictional roster’s revenue concentration, archive, portable contacts, standby, and drill recency;
- run a deterministic readiness assessment with visible findings and exposed-revenue estimate;
- generate a 72-hour drill and mark evidence gates complete;
- call the equivalent tested FastAPI `POST /assess` operation.

All rosters and results are fictional. This prototype does not connect to social platforms, store creator data, guarantee recovery, or provide insurance. GitHub Pages hosts only the frontend; FastAPI is tested source and is not deployed.

## Run
```bash
npm ci
npm run dev
uv sync --project api --locked --dev
uv run --project api uvicorn api.main:app --reload
```

## Verify
```bash
npm run typecheck
npm run test:e2e
npm run build
npm audit --audit-level=high
uv run --project api pytest api/tests
```

Node is pinned to 24.22.2. Next.js is pinned to 16.4.5. `source-map-js` and PostCSS are overridden to patched versions. Python explicitly requires certifi >=2026.10.19 and the lock resolves 2026.10.23. Docker stages refresh system CA certificates before network installs.

See [research/notes.md](research/notes.md), [docs/OFFICE_HOURS.md](docs/OFFICE_HOURS.md), [docs/PRODUCT.md](docs/PRODUCT.md), and [docs/CEO_REVIEW.md](docs/CEO_REVIEW.md).
