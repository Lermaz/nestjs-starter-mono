import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthTokenPayload } from '../../modules/auth/public/auth-token-payload';

/**
 * Extracts the authenticated user from the request.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthTokenPayload | undefined => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user as AuthTokenPayload | undefined;
  },
);
