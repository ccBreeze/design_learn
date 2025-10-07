# 迭代器模式 (Iterator Pattern)

## 定义

迭代器模式提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露其内部的表示。

## 意图

- 提供一种统一的方式来遍历不同的聚合结构
- 将遍历逻辑从聚合对象中分离出来
- 支持多种遍历方式而不改变聚合对象

## 适用场景

✅ 访问聚合对象的内容，但不想暴露其内部表示  
✅ 需要为聚合对象提供多种遍历方式  
✅ 需要为遍历不同的聚合结构提供统一的接口  
✅ 处理大量数据，需要分批加载

## 结构

```
┌──────────────┐           ┌──────────────┐
│  Aggregate   │◇─────────▷│   Iterator   │
└──────────────┘           └──────────────┘
       △                          △
       │                          │
       │                          │
┌──────────────┐           ┌──────────────┐
│  Collection  │──────────▷│   Concrete   │
│              │  creates  │   Iterator   │
└──────────────┘           └──────────────┘
```

### 核心角色

1. **Iterator（迭代器接口）**
   - 定义访问和遍历元素的接口

2. **ConcreteIterator（具体迭代器）**
   - 实现迭代器接口
   - 跟踪当前位置

3. **Aggregate（聚合接口）**
   - 定义创建迭代器的接口

4. **ConcreteAggregate（具体聚合）**
   - 实现创建迭代器的接口
   - 返回具体迭代器实例

## 优点

✅ **单一职责原则**：将遍历算法提取到独立的类中  
✅ **开闭原则**：可以添加新的迭代器，无需修改现有代码  
✅ **并发遍历**：可以同时进行多个遍历  
✅ **延迟加载**：可以按需获取元素

## 缺点

❌ 对于简单集合，使用迭代器可能过度设计  
❌ 某些情况下，直接访问集合元素可能更高效

## 示例代码

### 基础实现

```typescript
// 创建集合
const collection = new Collection<string>()
collection.add('苹果')
collection.add('香蕉')
collection.add('橙子')

// 创建迭代器
const iterator = collection.createIterator()

// 遍历
while (iterator.hasNext()) {
  console.log(iterator.next())
}
```

## TypeScript 内置迭代器

TypeScript/JavaScript 原生支持迭代器协议：

```typescript
// 使用 Symbol.iterator
class MyCollection<T> implements Iterable<T> {
  private items: T[] = []

  [Symbol.iterator](): Iterator<T> {
    let index = 0
    const items = this.items

    return {
      next(): IteratorResult<T> {
        if (index < items.length) {
          return { value: items[index++], done: false }
        }
        return { value: undefined as any, done: true }
      }
    }
  }
}

// 支持 for...of
for (const item of collection) {
  console.log(item)
}
```

## 与其他模式的关系

- **组合模式**：经常与迭代器一起使用，遍历组合树
- **工厂方法**：可用于创建不同类型的迭代器
- **备忘录模式**：可结合使用以获取迭代的当前状态

## 实际应用

1. **集合遍历**：数组、列表、树等数据结构的遍历
2. **分页加载**：大数据量的分批处理
3. **文件读取**：逐行读取文件
4. **数据库查询**：结果集的游标遍历

## 学习资源

- [Refactoring Guru - Iterator Pattern](https://refactoringguru.cn/design-patterns/iterator)
- [TypeScript Handbook - Iterators and Generators](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)
