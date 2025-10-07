/**
 * 迭代器设计模式 - 最简实现
 *
 * 意图：提供一种方法顺序访问聚合对象中的各个元素，而又不暴露其内部表示
 *
 * 适用场景：
 * - 需要访问聚合对象的内容而不暴露其内部表示
 * - 需要为聚合对象提供多种遍历方式
 * - 需要为不同的聚合结构提供统一的遍历接口
 */

// 迭代器接口
export interface Iterator<T> {
  hasNext(): boolean
  next(): T | undefined
  reset(): void
}

// 聚合对象接口
export interface Aggregate<T> {
  createIterator(): Iterator<T>
}

// 具体迭代器实现
export class ConcreteIterator<T> implements Iterator<T> {
  private items: T[]
  private index: number = 0

  constructor(items: T[]) {
    this.items = items
  }

  hasNext(): boolean {
    return this.index < this.items.length
  }

  next(): T | undefined {
    if (this.hasNext()) {
      return this.items[this.index++]
    }
    return undefined
  }

  reset(): void {
    this.index = 0
  }
}

// 具体聚合对象实现
export class Collection<T> implements Aggregate<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  createIterator(): Iterator<T> {
    return new ConcreteIterator(this.items)
  }
}

// Demo 函数
export function minimalIteratorDemo(): string {
  const results: string[] = []

  // 创建集合
  const collection = new Collection<string>()
  collection.add('苹果')
  collection.add('香蕉')
  collection.add('橙子')

  // 创建迭代器
  const iterator = collection.createIterator()

  // 遍历集合
  results.push('遍历水果集合：')
  while (iterator.hasNext()) {
    const fruit = iterator.next()
    if (fruit) {
      results.push(`- ${fruit}`)
    }
  }

  // 重置并再次遍历
  results.push('\n重置后再次遍历：')
  iterator.reset()
  while (iterator.hasNext()) {
    const fruit = iterator.next()
    if (fruit) {
      results.push(`- ${fruit}`)
    }
  }

  return results.join('\n')
}
