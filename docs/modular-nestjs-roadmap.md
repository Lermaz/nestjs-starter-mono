# Modular NestJS Roadmap

## Phase 2 — Module boundaries (2–3 modules in)

> Module ownership one-liners: [module-ownership.md](./module-ownership.md)

| # | Priority | What | Why |
|---|----------|------|-----|
| 12 | P0 | Define what each module owns (one sentence per module) | Prevents overlap and god-modules |
| 13 | P0 | Each module exports only a small public API (`exports` + optional `public/` facade) | Stops “import anything from anywhere” |
| 14 | P0 | Cross-module calls only through public services or adapters | Core modular monolith rule |
| 15 | P1 | No circular imports between Nest modules | Nest won’t always save you |
| 16 | P1 | Avoid sharing DB tables/entities across modules | Tight coupling that’s hard to undo |
| 17 | P2 | Integration events for side effects (`OrderPlaced` → notify) instead of direct calls | Scales better than spaghetti imports |

## Phase 3 — Cross-cutting platform

> Auth, Swagger, throttling, structured logging, and Docker: see [module-ownership.md](./module-ownership.md) and README Docker section.

| # | Priority | What | Why |
|---|----------|------|-----|
| 18 | P1 | Auth module: guard + `@Public()` + JWT/session strategy | Almost every API needs it |
| 19 | P1 | Swagger from DTOs (`@nestjs/swagger`) | Free API docs |
| 20 | P1 | Rate-limit auth (and sensitive) endpoints | Cheap security win |
| 21 | P2 | Structured logging (request id, user id) | Debugging in prod |
| 22 | P2 | Docker multi-stage build | Prod parity early |
| 23 | P3 | Caching layer (Redis) only when you have a measured hot path | Don’t pre-optimize |

## Phase 4 — DDD layers (only where complexity warrants)

> Domain conventions: [module-ownership.md](./module-ownership.md#domain-layer-conventions)

| # | Priority | What | When |
|---|----------|------|------|
| 24 | P2 | `domain/` folder — pure TS, no Nest/ORM imports | Payments, orders, inventory, auth rules |
| 25 | P2 | `application/ports/` — repository interfaces | When you need to swap infra or mock heavily |
| 26 | P2 | `use-cases/` — one class per command/query | When services exceed ~150 lines |
| 27 | P3 | Value objects, aggregates, domain events | Rich business rules with invariants |
| 28 | P3 | CQRS (`@nestjs/cqrs`) | High read/write asymmetry or complex workflows |

> **Rule:** simple CRUD → controller + service + repo is enough. Don’t force DDD everywhere.

## Phase 5 — Guardrails (before team grows or module count > ~5)

> Architecture checks: `pnpm run arch:check` — module public APIs: [module-ownership.md](./module-ownership.md#module-public-api-docs)

| # | Priority | What | Why |
|---|----------|------|-----|
| 29 | P1 | dependency-cruiser rules in CI | Enforces boundaries automatically |
| 30 | P1 | Block: domain → NestJS, cross-module imports outside adapters | Catches architecture drift in PRs |
| 31 | P2 | E2E test per API module | Regression safety |
| 32 | P2 | Document each module’s public API (README or `public/` interfaces) | Onboarding + contract clarity |

## Phase 6 — Nice-to-have / later

| # | Priority | What |
|---|----------|------|
| 33 | P3 | Monorepo (`apps/api`, `libs/shared`) — only if multiple deployables |
| 34 | P3 | Event bus / outbox pattern for reliable async |
| 35 | P3 | Feature flags, multi-tenancy, read replicas |
