import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from '../../../core/config/auth.config';
import {
  AuthService,
  AuthTokenPayload,
} from '../application/auth.service';

/**
 * Passport strategy for validating JWT access tokens.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const jwtSecret = configService.get<AuthConfig['jwtSecret']>(
      'auth.jwtSecret',
      'change-me-in-production',
    );
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: AuthTokenPayload): AuthTokenPayload {
    return this.authService.validateTokenPayload(payload);
  }
}
