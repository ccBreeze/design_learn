# 责任链模式 (Chain of Responsibility Pattern)

> 核心思想：处理不了就传给下一个

## 📁 文件结构

```
chain/
├── UltraMinimalChain.ts                # 主文件：核心实现 + 基础示例
├── MinimalChain.ts                      # 早期实现版本
├── README.md                            # 📚 本文件（完整指南）
├── NodejsMiddleware.md                  # 📖 Node.js 中间件设计模式详解 ⭐
├── ChainVsIterator.md                   # 📖 责任链 vs 迭代器详细对比 ⭐
├── QUICK_COMPARISON.md                  # ⚡ 快速对比表（速查）
├── SUMMARY.md                           # 📝 Node.js 中间件快速总结
└── examples/                            # 💻 高级应用示例
    ├── index.ts                         # 运行所有示例
    ├── ApprovalChain.ts                 # 场景1: 审批流程
    ├── ValidationChain.ts               # 场景2: 表单验证链
    ├── MiddlewareChain.ts               # 场景3: HTTP 中间件链
    ├── SimpleExpressMiddleware.ts       # 简化版 Express 中间件系统 ⭐
    └── ChainVsIteratorDemo.ts           # 责任链 vs 迭代器对比演示 ⭐
```

## 🚀 快速开始

### 1. 运行主文件（基础示例）

```bash
npx tsx src/patterns/behavioral/chain/UltraMinimalChain.ts
```

**包含示例：**

- ✅ 示例1: 类型检查器
- ✅ 示例2: 日志级别处理

### 2. 运行所有高级示例

```bash
npx tsx src/patterns/behavioral/chain/examples/index.ts
```

**包含场景：**

- 📋 场景1: 审批流程（请假天数决定审批层级）
- 📋 场景2: 表单验证链（多步骤验证）
- 📋 场景3: HTTP 中间件链（模拟 Express.js）

### 3. 运行单个场景

```bash
# 审批流程
npx tsx src/patterns/behavioral/chain/examples/ApprovalChain.ts

# 表单验证链
npx tsx src/patterns/behavioral/chain/examples/ValidationChain.ts

# HTTP 中间件链
npx tsx src/patterns/behavioral/chain/examples/MiddlewareChain.ts

# 简化版 Express 中间件系统 ⭐ 推荐
npx tsx src/patterns/behavioral/chain/examples/SimpleExpressMiddleware.ts

# 责任链 vs 迭代器对比演示 ⭐ 推荐
npx tsx src/patterns/behavioral/chain/examples/ChainVsIteratorDemo.ts
```

## 📖 核心实现

### Handler 类

```typescript
class Handler<TRequest = unknown, TResponse = unknown> {
  constructor(
    private process: (req: TRequest) => TResponse | undefined,
    private next?: Handler<TRequest, TResponse>
  ) {}

  handle(req: TRequest): TResponse | undefined {
    const result = this.process(req)
    return result !== undefined ? result : this.next?.handle(req)
  }

  setNext(next: Handler<TRequest, TResponse>): this {
    this.next = next
    return this
  }
}
```

### 使用示例

```typescript
// 创建处理器
const h1 = new Handler<number, string>(x => (x < 0 ? `负数:${x}` : undefined))
const h2 = new Handler<number, string>(x => (x === 0 ? `零:${x}` : undefined))
const h3 = new Handler<number, string>(x => (x > 0 ? `正数:${x}` : undefined))

// 构建责任链
h1.setNext(h2).setNext(h3)

// 使用
console.log(h1.handle(-5)) // 负数:-5
console.log(h1.handle(0)) // 零:0
console.log(h1.handle(10)) // 正数:10
```

## ✅ 优点

1. **降低耦合度**：请求发送者和接收者解耦
2. **增强灵活性**：可以动态地增加或删除处理器
3. **符合单一职责原则**：每个处理器只负责自己能处理的请求
4. **符合开闭原则**：可以添加新的处理器而不影响现有代码
5. **简化对象**：每个对象只需要保存对下一个对象的引用

## ❌ 缺点

1. **不保证被处理**：请求可能到达链的末端都没有被处理
2. **性能问题**：如果链太长，可能会影响性能
3. **调试困难**：请求的处理路径不明确
4. **可能产生循环引用**：如果链配置不当

## 🎯 适用场景

1. 多个对象可以处理同一请求，但具体由哪个对象处理在运行时确定
2. 不希望显式指定请求的接收者
3. 需要动态指定处理请求的对象集合
4. 有多个条件判断，每个条件对应不同的处理逻辑
5. 中间件和过滤器链

## 🌟 实际应用

- **Express.js/Koa.js 的中间件机制** ⭐ [详细说明](./NodejsMiddleware.md)
- **Java Servlet 的 Filter 链**
- **Android 的事件分发机制**
- **GUI 框架的事件处理**（事件冒泡）
- **日志框架**（Log4j、Winston）
- **异常处理链**
- **审批流程系统**

### 💡 常见问题

#### Q1: Node.js 中间件是什么设计模式？

**答**：责任链模式！

详细解析：[Node.js 中间件设计模式详解](./NodejsMiddleware.md)

快速体验：

```bash
npx tsx src/patterns/behavioral/chain/examples/SimpleExpressMiddleware.ts
```

#### Q2: 责任链和迭代器有什么区别？

**答**：本质不同！

- **责任链**：寻找处理者，找到就停止 ⛓️
- **迭代器**：遍历所有元素，访问全部 🔄

快速对比：[快速对比表](./QUICK_COMPARISON.md) ⚡

详细分析：[责任链 vs 迭代器](./ChainVsIterator.md) 📖

直观演示：

```bash
npx tsx src/patterns/behavioral/chain/examples/ChainVsIteratorDemo.ts
```

## 📚 学习建议

1. 先运行 `UltraMinimalChain.ts` 理解核心概念
2. 查看 `examples/` 目录中的实际应用场景
3. 尝试修改示例代码，添加自己的处理器
4. 思考在自己的项目中可以应用责任链模式的场景
