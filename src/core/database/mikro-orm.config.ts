import { defineConfig, SqliteDriver, type Options } from '@mikro-orm/sqlite';

const DEFAULT_DATABASE_URL = 'sqlite://./data/app.db';

/**
 * Builds MikroORM options from a database connection URL.
 */
export function buildMikroOrmOptions(databaseUrl: string): Options {
  const dbName = resolveSqlitePath(databaseUrl);
  return defineConfig({
    driver: SqliteDriver,
    dbName,
    entities: ['./dist/**/*.entity.js'],
    allowGlobalContext: true,
  });
}

/**
 * Returns MikroORM options using the default database URL.
 */
export function getDefaultMikroOrmOptions(): Options {
  return buildMikroOrmOptions(process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL);
}

function resolveSqlitePath(databaseUrl: string): string {
  if (databaseUrl === 'sqlite://:memory:') {
    return ':memory:';
  }
  const sqlitePrefix = 'sqlite://';
  if (databaseUrl.startsWith(sqlitePrefix)) {
    return databaseUrl.slice(sqlitePrefix.length);
  }
  return databaseUrl;
}
