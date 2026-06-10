# HealthModule

Owns liveness/readiness HTTP endpoints and operational smoke checks.

## Public API (cross-module)

No Nest `exports`. Readiness checks database connectivity by calling `TodosPublicApi` from TodosModule.

## HTTP API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | Public | Root health check |
| `GET` | `/health/test` | Public | Smoke test |
| `GET` | `/health/ready` | Public | Readiness with DB check via `TodosPublicApi.countTodos()` |

## Dependencies

- Imports `TodosModule` for `TodosPublicApi` (cross-module via `public/` facade only)

## Private layers

- `application/` — `HealthService`
- `presentation/` — `HealthController`
