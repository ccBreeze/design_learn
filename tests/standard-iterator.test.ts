import { describe, it, expect } from 'vitest'
import {
  standardIteratorDemo,
  ConcreteCollection,
} from '../src/patterns/behavioral/iterator/StandardIterator'

describe('标准迭代器模式 (UML 实现)', () => {
  it('应该能够遍历集合', () => {
    const collection = new ConcreteCollection<number>()
    collection.addItem(1)
    collection.addItem(2)
    collection.addItem(3)

    const iterator = collection.createIterator()
    const results: number[] = []

    while (iterator.hasMore()) {
      const value = iterator.getNext()
      if (value !== null) {
        results.push(value)
      }
    }

    expect(results).toEqual([1, 2, 3])
  })

  it('空集合应该正确处理', () => {
    const collection = new ConcreteCollection<string>()
    const iterator = collection.createIterator()

    expect(iterator.hasMore()).toBe(false)
    expect(iterator.getNext()).toBeNull()
  })

  it('hasMore 应该返回正确的状态', () => {
    const collection = new ConcreteCollection<string>()
    collection.addItem('a')

    const iterator = collection.createIterator()

    expect(iterator.hasMore()).toBe(true)
    iterator.getNext()
    expect(iterator.hasMore()).toBe(false)
  })

  it('迭代器应该正确跟踪迭代状态', () => {
    const collection = new ConcreteCollection<string>()
    collection.addItem('x')
    collection.addItem('y')
    collection.addItem('z')

    const iterator = collection.createIterator()

    expect(iterator.getNext()).toBe('x')
    expect(iterator.getNext()).toBe('y')
    expect(iterator.getNext()).toBe('z')
    expect(iterator.getNext()).toBeNull()
  })

  it('多个迭代器应该相互独立', () => {
    const collection = new ConcreteCollection<number>()
    collection.addItem(1)
    collection.addItem(2)

    const iterator1 = collection.createIterator()
    const iterator2 = collection.createIterator()

    expect(iterator1.getNext()).toBe(1)
    expect(iterator2.getNext()).toBe(1)
    expect(iterator1.getNext()).toBe(2)
    expect(iterator2.getNext()).toBe(2)
  })

  it('Demo 函数应该返回预期结果', () => {
    const result = standardIteratorDemo()

    expect(result).toContain('第一个元素')
    expect(result).toContain('第二个元素')
    expect(result).toContain('第三个元素')
  })
})
