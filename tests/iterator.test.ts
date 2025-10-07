import { describe, it, expect } from 'vitest'
import {
  minimalIteratorDemo,
  Collection,
} from '../src/patterns/behavioral/iterator/MinimalIterator'

describe('迭代器模式', () => {
  it('应该能够遍历集合', () => {
    const collection = new Collection<number>()
    collection.add(1)
    collection.add(2)
    collection.add(3)

    const iterator = collection.createIterator()
    const results: number[] = []

    while (iterator.hasNext()) {
      const value = iterator.next()
      if (value !== undefined) {
        results.push(value)
      }
    }

    expect(results).toEqual([1, 2, 3])
  })

  it('应该能够重置迭代器', () => {
    const collection = new Collection<string>()
    collection.add('a')
    collection.add('b')

    const iterator = collection.createIterator()

    // 第一次遍历
    iterator.next()
    iterator.next()
    expect(iterator.hasNext()).toBe(false)

    // 重置后再次遍历
    iterator.reset()
    expect(iterator.hasNext()).toBe(true)
    expect(iterator.next()).toBe('a')
  })

  it('空集合应该正确处理', () => {
    const collection = new Collection<string>()
    const iterator = collection.createIterator()

    expect(iterator.hasNext()).toBe(false)
    expect(iterator.next()).toBeUndefined()
  })

  it('Demo 函数应该返回预期结果', () => {
    const result = minimalIteratorDemo()

    expect(result).toContain('苹果')
    expect(result).toContain('香蕉')
    expect(result).toContain('橙子')
    expect(result).toContain('重置后再次遍历')
  })

  it('应该支持不同类型的元素', () => {
    interface User {
      name: string
      age: number
    }

    const collection = new Collection<User>()
    collection.add({ name: '张三', age: 25 })
    collection.add({ name: '李四', age: 30 })

    const iterator = collection.createIterator()
    const users: User[] = []

    while (iterator.hasNext()) {
      const user = iterator.next()
      if (user) {
        users.push(user)
      }
    }

    expect(users).toHaveLength(2)
    expect(users[0].name).toBe('张三')
    expect(users[1].name).toBe('李四')
  })
})
