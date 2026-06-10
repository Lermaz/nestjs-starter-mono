import { AuthTokenPayload } from '../../modules/auth/public/auth-token-payload';

export {};

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: AuthTokenPayload;
    }
  }
}
