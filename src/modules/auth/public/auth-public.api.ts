import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../application/ports/user.repository.port';
import type { UserRepositoryPort } from '../application/ports/user.repository.port';
import { AuthTokenPayload } from './auth-token-payload';

/**
 * Public facade for cross-module authentication operations.
 */
@Injectable()
export class AuthPublicApi {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  /**
   * Validates that a user exists and returns the token payload shape.
   */
  async validateUser(userId: string): Promise<AuthTokenPayload | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }
    return { userId: user.id, email: user.email };
  }
}
