import { registerAs } from '@nestjs/config';

const DEFAULT_PORT = 3000;

export interface AppConfig {
  readonly port: number;
  readonly nodeEnv: string;
  readonly corsOrigins: readonly string[];
}

/**
 * Parses a comma-separated list of CORS origins.
 */
export function parseCorsOrigins(rawOrigins: string | undefined): string[] {
  if (!rawOrigins?.trim()) {
    return [];
  }
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

/**
 * Application configuration loaded from environment variables.
 */
export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  }),
);
