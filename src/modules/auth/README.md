# AuthModule

Owns user registration/login, JWT issuance, and the `users` table.

## Public API (cross-module)

Exported via `AuthModule.exports`:

| Symbol | Method / type | Description |
|--------|---------------|-------------|
| `AuthPublicApi` | `validateUser(userId)` | Verifies user exists; used by JWT strategy |
| `AuthTokenPayload` | type | JWT payload shape (`userId`, `email`) |

Import from: `src/modules/auth/public/`

## HTTP API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | Public | Register user, returns JWT |
| `POST` | `/auth/login` | Public | Login, returns JWT |

Rate-limited to 5 requests per minute.

## Private layers

- `domain/` — `User` model, registration rules
- `application/` — `AuthService`, repository port
- `infrastructure/` — `UserEntity`, MikroORM repository, mappers
- `presentation/` — controller, DTOs
- `strategies/` — Passport JWT strategy
