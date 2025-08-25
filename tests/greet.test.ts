import { describe, it, expect } from 'vitest';
import { greet } from '../src/index';

describe('greet', () => {
  it('returns greeting for a given name', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});