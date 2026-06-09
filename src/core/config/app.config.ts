import { registerAs } from '@nestjs/config';

const DEFAULT_PORT = 3000;

export interface AppConfig {
  readonly port: number;
  readonly nodeEnv: string;
}

/**
 * Application configuration loaded from environment variables.
 */
export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
  }),
);
