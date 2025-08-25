export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export * from './patterns/structural/facade';

export default { greet };