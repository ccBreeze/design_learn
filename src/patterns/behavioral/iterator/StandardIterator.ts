/**
 * 迭代器模式 - 标准 UML 实现
 *
 * 基于 GoF 设计模式的标准 UML 类图实现
 */

// 1. 迭代器接口
export interface Iterator<T> {
  getNext(): T | null
  hasMore(): boolean
}

// 2. 可迭代集合接口
export interface IterableCollection<T> {
  createIterator(): Iterator<T>
}

// 3. 具体集合类
export class ConcreteCollection<T> implements IterableCollection<T> {
  private items: T[] = []

  addItem(item: T): void {
    this.items.push(item)
  }

  getItems(): T[] {
    return this.items
  }

  createIterator(): Iterator<T> {
    return new ConcreteIterator(this)
  }
}

// 4. 具体迭代器类
export class ConcreteIterator<T> implements Iterator<T> {
  private collection: ConcreteCollection<T>
  private iterationState: number = 0

  constructor(collection: ConcreteCollection<T>) {
    this.collection = collection
  }

  getNext(): T | null {
    if (this.hasMore()) {
      const items = this.collection.getItems()
      return items[this.iterationState++]
    }
    return null
  }

  hasMore(): boolean {
    const items = this.collection.getItems()
    return this.iterationState < items.length
  }
}

// 5. 客户端使用示例
export function standardIteratorDemo(): string {
  const results: string[] = []

  // 创建集合
  const collection = new ConcreteCollection<string>()
  collection.addItem('第一个元素')
  collection.addItem('第二个元素')
  collection.addItem('第三个元素')

  // 创建迭代器
  const iterator = collection.createIterator()

  // 遍历集合
  results.push('使用迭代器遍历集合：')
  while (iterator.hasMore()) {
    const item = iterator.getNext()
    if (item) {
      results.push(`- ${item}`)
    }
  }

  return results.join('\n')
}
