# Architecture Improvement Plan

Roadmap for evolving this NestJS modular monolith. Complements [modular-nestjs-roadmap.md](./modular-nestjs-roadmap.md) and [module-ownership.md](./module-ownership.md).

## Current State

```
AppModule
├── CoreModule      → config, DB, global filter/interceptor/throttle
├── AuthModule      → users, JWT, registration/login
├── HealthModule    → liveness/readiness (uses TodosPublicApi)
└── TodosModule     → todo CRUD, repository ports, integration events
```

Each feature module follows: `domain/` → `application/` → `infrastructure/` → `presentation/` with a `public/` facade for cross-module access.

### Strengths

- Module ownership documented per module
- Repository ports with MikroORM adapters
- `TodosPublicApi` facade for cross-module calls
- Domain layer isolated from NestJS/ORM (enforced by dependency-cruiser)
- CI: lint → unit → build → `arch:check` → e2e

### Known Gaps

| Area | Issue |
|------|-------|
| Database | `schema.update()` on boot; no versioned migrations |
| API | CRUD incomplete (no PATCH/DELETE); no pagination |
| Application | Use-case split deferred until services exceed ~150 lines |

---

## Phase 1 — Boundaries & Security

**Goal:** Connect auth to todos, fix boundary leaks, map domain errors.

| Step | Action | Status |
|------|--------|--------|
| 1.1 | Add `userId` to `TodoEntity` | ✅ |
| 1.2 | Scope todo queries by `@CurrentUser()` | ✅ |
| 1.3 | Create `AuthPublicApi` with `validateUser(userId)` | ✅ |
| 1.4 | Add `DomainExceptionFilter` for `DomainError` → HTTP | ✅ |
| 1.5 | Move `JwtAuthGuard` registration to `CoreModule` | ✅ |
| 1.6 | Move `TodoCreatedListener` to `TodosModule` | ✅ |

**Acceptance criteria:**

- E2E: user A cannot read user B's todos
- Domain validation returns 400, not 500
- JWT rejected when user no longer exists

---

## Phase 2 — Harden Module Contracts

**Goal:** Consistent public APIs and stronger dep-cruiser rules.

| Step | Action | Status |
|------|--------|--------|
| 2.1 | Auth: export only `AuthPublicApi` + types (stop exporting `AuthService`) | ✅ |
| 2.2 | Extend `.dependency-cruiser.cjs` for `common/` → `modules/*/public/` only | ✅ |
| 2.3 | Add dep-cruiser rule: `application/` must not import `@nestjs/common` | ✅ |
| 2.4 | Standardize `public/index.ts` barrel per feature module | ✅ |
| 2.5 | Move `JwtStrategy` to `infrastructure/auth/` | ✅ |

**Acceptance criteria:** `pnpm arch:check` catches deliberate bad imports.

---

## Phase 3 — Application Layer Cleanup

**Goal:** Cleaner separation between domain, application, and HTTP.

| Step | Action | Status |
|------|--------|--------|
| 3.1 | Single validation layer per field (DTO for HTTP, domain for business rules) | ✅ |
| 3.2 | Repository ports accept domain types (`CreateTodoProps`, not primitives) | ✅ |
| 3.3 | Application returns `Result<T, DomainError>`; presentation unwraps | ✅ |
| 3.4 | Split services into `use-cases/` when a module exceeds ~150 lines | ⏭️ deferred |

**Rule:** Don't force use-cases on simple CRUD until complexity warrants it. Auth and Todos services remain under ~150 lines.

---

## Phase 4 — Database & Production Readiness

| Step | Action |
|------|--------|
| 4.1 | Replace `schema.update()` with MikroORM migrations |
| 4.2 | Add `DatabaseHealthPort` in core (simple connectivity check) |
| 4.3 | Remove `allowGlobalContext`; use request-scoped EntityManager |
| 4.4 | Validate env on boot (`JWT_SECRET`, `DATABASE_URL`) |
| 4.5 | Fail fast if default `JWT_SECRET` in production |

---

## Phase 5 — API Maturity

| Step | Action |
|------|--------|
| 5.1 | Complete CRUD: `PATCH /todos/:id`, `DELETE /todos/:id` |
| 5.2 | Pagination: `GET /todos?cursor=&limit=` |
| 5.3 | Document global error response shape in Swagger |
| 5.4 | Rate-limit sensitive todo endpoints if needed |

---

## Phase 6 — Scale Path (defer until triggered)

| Trigger | Action |
|---------|--------|
| 2+ deployables | Monorepo: `apps/api`, `libs/domain-events`, `libs/common` |
| Async side effects grow | Outbox pattern or message bus |
| Read-heavy endpoints | CQRS read models |
| Team > 5 modules | Module-level CODEOWNERS + arch tests per module |

---

## Target Module Structure

```
modules/<feature>/
  domain/              # pure TS — models, factories, rules, DomainError
  application/
    ports/             # repository interfaces
    events/            # integration event classes
    <feature>.service.ts
  infrastructure/
    entities/
    mappers/
    repositories/
    listeners/         # integration event handlers
  presentation/
    dto/
    mappers/
    <feature>.controller.ts
  public/
    index.ts
    <feature>-public.api.ts
  <feature>.module.ts
  README.md
```

---

## Priority Matrix

| Priority | Focus | Effort |
|----------|-------|--------|
| P0 | User-scoped todos, DomainError handling, migrations | Medium |
| P1 | Module export consistency, guard/listener placement | Low |
| P2 | Application/error layering, port types | Medium |
| P3 | CRUD completion, pagination, strict TS | Medium |
| P4 | Monorepo, outbox, CQRS | High — defer |
