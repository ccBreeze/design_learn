# 迭代器模式实现总结

## 📁 文件结构

```
src/patterns/behavioral/iterator/
├── MinimalIterator.ts          # 最简实现（基础版）
├── StandardIterator.ts         # 标准 UML 实现
├── demo.ts                     # MinimalIterator 演示
├── standard-demo.ts            # StandardIterator 演示
├── index.ts                    # 统一导出
├── README.md                   # 模式说明文档
├── UML-IMPLEMENTATION.md       # UML 对照说明
└── SUMMARY.md                  # 本文件

tests/
├── iterator.test.ts            # MinimalIterator 测试 (5 tests)
└── standard-iterator.test.ts   # StandardIterator 测试 (6 tests)
```

## 🎯 两种实现对比

### 1. MinimalIterator（最简实现）

**特点：**

- ✅ 代码最少，易于理解
- ✅ 包含 `reset()` 方法，可重置迭代器
- ✅ 返回 `undefined` 表示结束

**适用场景：**

- 学习迭代器模式的基本概念
- 快速原型开发
- 需要重置功能的场景

**接口定义：**

```typescript
interface Iterator<T> {
  hasNext(): boolean
  next(): T | undefined
  reset(): void
}
```

---

### 2. StandardIterator（标准 UML 实现）

**特点：**

- ✅ 完全符合 GoF 设计模式 UML 类图
- ✅ 方法名与经典定义一致：`getNext()` / `hasMore()`
- ✅ 返回 `null` 表示结束
- ✅ 迭代状态管理更明确

**适用场景：**

- 严格遵循设计模式规范
- 团队协作需要统一标准
- 学术研究或教学

**接口定义：**

```typescript
interface Iterator<T> {
  getNext(): T | null
  hasMore(): boolean
}
```

---

## 📊 功能对比表

| 特性         | MinimalIterator        | StandardIterator          |
| ------------ | ---------------------- | ------------------------- |
| **方法名**   | `next()` / `hasNext()` | `getNext()` / `hasMore()` |
| **空值返回** | `undefined`            | `null`                    |
| **重置功能** | ✅ `reset()`           | ❌ 无                     |
| **UML 对应** | ❌ 简化版              | ✅ 标准 GoF               |
| **代码行数** | ~96 行                 | ~77 行                    |
| **测试用例** | 5 个                   | 6 个                      |
| **迭代状态** | `index`                | `iterationState`          |

---

## 🚀 使用示例

### MinimalIterator 使用

```typescript
import { Collection } from './MinimalIterator'

const collection = new Collection<string>()
collection.add('A')
collection.add('B')
collection.add('C')

const iterator = collection.createIterator()

// 第一次遍历
while (iterator.hasNext()) {
  console.log(iterator.next())
}

// 重置后再次遍历
iterator.reset()
while (iterator.hasNext()) {
  console.log(iterator.next())
}
```

### StandardIterator 使用

```typescript
import { ConcreteCollection } from './StandardIterator'

const collection = new ConcreteCollection<number>()
collection.addItem(1)
collection.addItem(2)
collection.addItem(3)

const iterator = collection.createIterator()

while (iterator.hasMore()) {
  const value = iterator.getNext()
  if (value !== null) {
    console.log(value)
  }
}
```

---

## ✅ 测试覆盖

### MinimalIterator 测试 (5 tests)

- ✅ 应该能够遍历集合
- ✅ 应该能够重置迭代器
- ✅ 空集合应该正确处理
- ✅ Demo 函数应该返回预期结果
- ✅ 应该支持不同类型的元素

### StandardIterator 测试 (6 tests)

- ✅ 应该能够遍历集合
- ✅ 空集合应该正确处理
- ✅ hasMore 应该返回正确的状态
- ✅ 迭代器应该正确跟踪迭代状态
- ✅ 多个迭代器应该相互独立
- ✅ Demo 函数应该返回预期结果

---

## 🎓 学习路径建议

### 初学者

1. 先学习 `MinimalIterator.ts`
2. 理解基本的迭代器接口和实现
3. 运行 `demo.ts` 查看效果
4. 阅读测试用例理解使用方式

### 进阶学习

1. 学习 `StandardIterator.ts`
2. 对照 UML 类图理解标准实现
3. 阅读 `UML-IMPLEMENTATION.md` 深入理解
4. 对比两种实现的差异

---

## 🔧 开发命令

```bash
# 运行 MinimalIterator 演示
npx tsx ./src/patterns/behavioral/iterator/demo.ts

# 运行 StandardIterator 演示
npx tsx ./src/patterns/behavioral/iterator/standard-demo.ts

# 运行所有迭代器测试
npm test iterator

# 运行标准迭代器测试
npm test standard-iterator

# 代码质量检查
npm run lint
npm run lint:fix
```

---

## 📖 核心概念

### 迭代器模式解决的问题

1. **封装遍历逻辑**：将遍历算法从集合中分离
2. **统一访问接口**：为不同集合提供统一的遍历方式
3. **多种遍历方式**：可以为同一集合实现不同的遍历策略
4. **并发遍历**：支持多个迭代器同时遍历

### 核心参与者

- **Iterator（迭代器）**：定义访问和遍历元素的接口
- **ConcreteIterator（具体迭代器）**：实现迭代器接口，跟踪遍历状态
- **Aggregate（聚合）**：定义创建迭代器的接口
- **ConcreteAggregate（具体聚合）**：实现创建迭代器，返回迭代器实例
- **Client（客户端）**：通过接口使用迭代器和集合

---

## 💡 最佳实践

1. **优先使用接口**：客户端依赖接口而非具体实现
2. **迭代器独立性**：每个迭代器维护自己的遍历状态
3. **空值处理**：明确定义遍历结束时的返回值
4. **类型安全**：使用泛型确保类型安全
5. **代码质量**：遵循 ESLint 规则，保持代码整洁

---

## 🔗 相关资源

- [README.md](./README.md) - 迭代器模式详细说明
- [UML-IMPLEMENTATION.md](./UML-IMPLEMENTATION.md) - UML 类图对照
- [设计模式 GoF](https://book.douban.com/subject/1052241/)
- [Refactoring Guru - Iterator Pattern](https://refactoringguru.cn/design-patterns/iterator)
- [TypeScript Handbook - Iterators](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)

---

## ✨ 总结

本目录提供了两种迭代器模式的实现：

1. **MinimalIterator** - 最简实现，适合入门学习
2. **StandardIterator** - 标准 UML 实现，符合 GoF 规范

两种实现都：

- ✅ 通过了完整的测试覆盖
- ✅ 符合 TypeScript strict 模式
- ✅ 通过了 ESLint 代码质量检查
- ✅ 包含详细的文档和示例
- ✅ 支持泛型，类型安全

选择哪种实现取决于你的具体需求和偏好！
