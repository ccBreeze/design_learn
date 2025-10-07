export function greet(name: string): string {
  return `Hello, ${name}!`
}

export * from './oop/polymorphism'
export * from './patterns/creational/singleton/Singleton'
export * from './patterns/creational/factoryMethod/FactoryMethod'
export * from './patterns/creational/factoryMethod/Transport'
export * from './patterns/creational/builder/Builder'
export * from './patterns/behavioral/strategy/PaymentStrategy'
export * from './patterns/structural/bridge/PaymentBridge'
export * from './patterns/structural/bridge/PSPConfigBuilder'
export * from './patterns/creational/prototype/Prototype'
export * from './patterns/structural/flyweight/ParticleGameFlyweight'
export * from './patterns/behavioral/visitor/Visitor'
export * from './patterns/behavioral/command/Command'
export * from './patterns/behavioral/chain/UIChain'

export default { greet }
