import { describe, it, expect } from 'vitest'
import {
  Product,
  ConcreteProductA,
  ConcreteProductB,
  Creator,
  ConcreteCreatorA,
  ConcreteCreatorB
} from '../src/patterns/creational/factoryMethod/FactoryMethod'

describe('Factory Method Pattern - 基础实现', () => {
  describe('具体产品类', () => {
    it('ConcreteProductA 应该返回正确的操作结果', () => {
      const productA = new ConcreteProductA()
      expect(productA.operation()).toBe('A')
    })

    it('ConcreteProductB 应该返回正确的操作结果', () => {
      const productB = new ConcreteProductB()
      expect(productB.operation()).toBe('B')
    })

    it('具体产品应该实现 Product 接口', () => {
      const productA: Product = new ConcreteProductA()
      const productB: Product = new ConcreteProductB()
      
      expect(typeof productA.operation).toBe('function')
      expect(typeof productB.operation).toBe('function')
    })
  })

  describe('具体创建者类', () => {
    it('ConcreteCreatorA 应该创建 ConcreteProductA', () => {
      const creatorA = new ConcreteCreatorA()
      const result = creatorA.someOperation()
      
      expect(result).toBe('Creator: working with -> A')
    })

    it('ConcreteCreatorB 应该创建 ConcreteProductB', () => {
      const creatorB = new ConcreteCreatorB()
      const result = creatorB.someOperation()
      
      expect(result).toBe('Creator: working with -> B')
    })

    it('不同创建者应该产生不同的结果', () => {
      const creatorA = new ConcreteCreatorA()
      const creatorB = new ConcreteCreatorB()
      
      const resultA = creatorA.someOperation()
      const resultB = creatorB.someOperation()
      
      expect(resultA).not.toBe(resultB)
      expect(resultA).toContain('A')
      expect(resultB).toContain('B')
    })
  })

  describe('工厂方法模式的核心特性', () => {
    it('应该通过多态实现不同的产品创建', () => {
      const creators: Creator[] = [
        new ConcreteCreatorA(),
        new ConcreteCreatorB()
      ]
      
      const results = creators.map(creator => creator.someOperation())
      
      expect(results).toHaveLength(2)
      expect(results[0]).toContain('A')
      expect(results[1]).toContain('B')
    })

    it('创建者的业务逻辑应该复用，只有产品创建不同', () => {
      const creatorA = new ConcreteCreatorA()
      const creatorB = new ConcreteCreatorB()
      
      const resultA = creatorA.someOperation()
      const resultB = creatorB.someOperation()
      
      // 业务逻辑模板相同
      expect(resultA).toMatch(/^Creator: working with -> /)
      expect(resultB).toMatch(/^Creator: working with -> /)
      
      // 只有产品操作结果不同
      expect(resultA.split('-> ')[1]).toBe('A')
      expect(resultB.split('-> ')[1]).toBe('B')
    })

    it('应该支持扩展新的产品和创建者', () => {
      // 模拟扩展新产品
      class ConcreteProductC implements Product {
        operation(): string {
          return 'C'
        }
      }

      class ConcreteCreatorC extends Creator {
        protected factoryMethod(): Product {
          return new ConcreteProductC()
        }
      }

      const creatorC = new ConcreteCreatorC()
      const result = creatorC.someOperation()
      
      expect(result).toBe('Creator: working with -> C')
    })
  })
})