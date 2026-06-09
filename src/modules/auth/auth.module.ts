import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../core/config/auth.config';
import { AuthService } from './application/auth.service';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { UserEntity } from './infrastructure/entities/user.entity';
import { MikroUserRepository } from './infrastructure/repositories/mikro-user.repository';

/**
 * Authentication module for user persistence and JWT issuance.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<AuthConfig['jwtSecret']>(
          'auth.jwtSecret',
          'change-me-in-production',
        );
        const jwtExpiresIn = configService.get<AuthConfig['jwtExpiresIn']>(
          'auth.jwtExpiresIn',
          '1d',
        );
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiresIn },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: MikroUserRepository,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
