import { AuthTokenPayload } from '../../modules/auth/application/auth.service';

export {};

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: AuthTokenPayload;
    }
  }
}
