import { parseCorsOrigins } from './app.config';

describe('parseCorsOrigins', () => {
  it('should return empty array when unset', () => {
    expect(parseCorsOrigins(undefined)).toEqual([]);
    expect(parseCorsOrigins('')).toEqual([]);
  });

  it('should parse comma-separated origins', () => {
    expect(
      parseCorsOrigins('http://localhost:5173, https://app.example.com'),
    ).toEqual(['http://localhost:5173', 'https://app.example.com']);
  });
});

describe('appConfig swagger flag', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalEnableSwagger = process.env.ENABLE_SWAGGER;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.ENABLE_SWAGGER = originalEnableSwagger;
    jest.resetModules();
  });

  it('should disable Swagger in production by default', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.ENABLE_SWAGGER;
    const { appConfig } = await import('./app.config');
    const actualConfig = appConfig();
    expect(actualConfig.isSwaggerEnabled).toBe(false);
  });

  it('should enable Swagger in production when explicitly set', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ENABLE_SWAGGER = 'true';
    const { appConfig } = await import('./app.config');
    const actualConfig = appConfig();
    expect(actualConfig.isSwaggerEnabled).toBe(true);
  });
});
