import { Test, TestingModule } from '@nestjs/testing';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../application/ports/user.repository.port';
import { User } from '../domain/user.model';
import { AuthPublicApi } from './auth-public.api';

describe('AuthPublicApi', () => {
  let authPublicApi: AuthPublicApi;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;

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
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthPublicApi,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    authPublicApi = app.get<AuthPublicApi>(AuthPublicApi);
  });

  describe('validateUser', () => {
    it('should return token payload when user exists', async () => {
      mockUserRepository.findById.mockResolvedValue(inputUser);
      const actualPayload = await authPublicApi.validateUser('user-1');
      expect(actualPayload).toEqual({
        userId: 'user-1',
        email: 'user@example.com',
      });
    });

    it('should return null when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      const actualPayload = await authPublicApi.validateUser('missing');
      expect(actualPayload).toBeNull();
    });
  });
});
