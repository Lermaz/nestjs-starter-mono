import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  Inject,
  Injectable,
} from '../../../common/nest/application.decorators';
import { DomainError } from '../../../common/errors/domain.error';
import { AuthConfig } from '../../../core/config/auth.config';
import { assertEmailAvailable } from '../domain/registration.rules';
import type { AuthTokenPayload } from '../public/auth-token-payload';
import { USER_REPOSITORY } from './ports/user.repository.port';
import type { UserRepositoryPort } from './ports/user.repository.port';

/**
 * Application service for authentication operations.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new user with the given credentials.
   */
  async register(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    assertEmailAvailable(existingUser);
    const passwordHash = await this.hashPassword(password);
    const user = await this.userRepository.save(email, passwordHash);
    return { accessToken: await this.signToken(user.id, user.email) };
  }

  /**
   * Authenticates a user and returns a JWT access token.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new DomainError('Invalid credentials', 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new DomainError('Invalid credentials', 401);
    }
    return { accessToken: await this.signToken(user.id, user.email) };
  }

  private async hashPassword(password: string): Promise<string> {
    const bcryptRounds = this.configService.get<AuthConfig['bcryptRounds']>(
      'auth.bcryptRounds',
      10,
    );
    return bcrypt.hash(password, bcryptRounds);
  }

  private async signToken(userId: string, email: string): Promise<string> {
    const payload: AuthTokenPayload = { userId, email };
    return this.jwtService.signAsync(payload);
  }
}
