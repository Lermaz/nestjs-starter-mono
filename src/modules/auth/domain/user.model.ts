/**
 * Domain model for an authenticated user.
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
}
