import { AuthTokenPayload } from '../../modules/auth/application/auth.service';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
    user?: AuthTokenPayload;
  }
}
