# TodosModule

Owns todo persistence, CRUD API, and the `todos` table.

## Public API (cross-module)

Exported via `TodosModule.exports`:

| Symbol | Method | Description |
|--------|--------|-------------|
| `TodosPublicApi` | `countTodos(): Promise<number>` | Returns total todo count without exposing entities |

Import from: `src/modules/todos/public/todos-public.api.ts`

## HTTP API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/todos/admin/test` | Public | Smoke test |
| `POST` | `/todos` | Bearer | Create todo |
| `GET` | `/todos` | Bearer | List todos |
| `GET` | `/todos/:id` | Bearer | Get todo by id |

## Private layers

- `domain/` — pure TS todo models and validation
- `application/` — `TodosService`, repository port, integration events
- `infrastructure/` — `TodoEntity`, MikroORM repository, mappers
- `presentation/` — controller, DTOs, response mappers
