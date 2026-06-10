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
