export function greet(name: string): string {
  return `Hello, ${name}!`
}

export * from './oop/polymorphism'
export * from './patterns/creational/singleton/Singleton'
export * from './patterns/creational/factoryMethod/FactoryMethod'
export * from './patterns/creational/factoryMethod/Transport'

export default { greet }
