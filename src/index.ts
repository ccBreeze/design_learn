export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export * from './oop/polymorphism';
export * from './patterns/creational/singleton/Singleton';

export default { greet };