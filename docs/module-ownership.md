# Module Ownership

One sentence per module — what it owns and what it does not own.

| Module | Owns |
|--------|------|
| **CoreModule** | App-wide config, global filters/interceptors, and platform wiring |
| **DatabaseModule** | MikroORM root connection and schema bootstrap |
| **CommonModule** | Shared cross-cutting providers (filters, interceptors, event listeners) consumed by Core |
| **HealthModule** | Liveness/readiness HTTP endpoints and operational smoke checks |
| **AuthModule** | User registration/login, JWT issuance, and the `users` table |
| **TodosModule** | Todo persistence, CRUD API, and the `todos` table |

## Rules

- Cross-module calls go through a module's `public/` facade exported via `exports`.
- Feature modules never import another module's `infrastructure/` or `presentation/` layers.
- Each entity file lives inside its owning feature module; entities are never shared across modules.

## Database entities

MikroORM discovers entities via a global glob at boot (`./dist/**/*.entity.js`), but ownership is per feature module. `TodoEntity` belongs to TodosModule only — other modules must use `TodosPublicApi` (or future facades), never import `*.entity.ts` files directly.

See [modular-nestjs-roadmap.md](./modular-nestjs-roadmap.md) for the full architecture roadmap.
