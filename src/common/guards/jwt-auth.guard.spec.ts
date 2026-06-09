import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let mockReflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    };
    jwtAuthGuard = new JwtAuthGuard(mockReflector as Reflector);
  });

  it('should allow access for @Public() routes', () => {
    mockReflector.getAllAndOverride.mockReturnValue(true);
    const mockContext = {} as ExecutionContext;
    const actualResult = jwtAuthGuard.canActivate(mockContext);
    expect(actualResult).toBe(true);
  });
});
