import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';
import { User } from './domain/user.model';
import { AuthService } from './application/auth.service';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from './application/ports/user.repository.port';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;
  let mockJwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;

  const inputUser: User = {
    id: 'user-1',
    email: 'user@example.com',
    passwordHash: 'hashed-password',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('test-token'),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(10),
          },
        },
      ],
    }).compile();
    authService = app.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a user and return access token', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(inputUser);
      const actualResult = await authService.register(
        'user@example.com',
        'password123',
      );
      expect(actualResult).toEqual({ accessToken: 'test-token' });
      expect(mockUserRepository.save.mock.calls[0]?.[0]).toBe(
        'user@example.com',
      );
    });

    it('should throw ConflictException when email exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(inputUser);
      await expect(
        authService.register('user@example.com', 'password123'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(inputUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
      const actualResult = await authService.login(
        'user@example.com',
        'password123',
      );
      expect(actualResult).toEqual({ accessToken: 'test-token' });
    });

    it('should throw UnauthorizedException for unknown user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(
        authService.login('user@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(inputUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await expect(
        authService.login('user@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
