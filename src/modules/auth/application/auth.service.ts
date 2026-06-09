import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthConfig } from '../../../core/config/auth.config';
import { assertEmailAvailable } from '../domain/registration.rules';
import { USER_REPOSITORY } from './ports/user.repository.port';
import type { UserRepositoryPort } from './ports/user.repository.port';

export interface AuthTokenPayload {
  readonly userId: string;
  readonly email: string;
}

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
    try {
      assertEmailAvailable(existingUser);
    } catch {
      throw new ConflictException('Email is already registered');
    }
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
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { accessToken: await this.signToken(user.id, user.email) };
  }

  /**
   * Validates a JWT payload and returns the authenticated user context.
   */
  validateTokenPayload(payload: AuthTokenPayload): AuthTokenPayload {
    return { userId: payload.userId, email: payload.email };
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
