# 责任链模式 vs 迭代器模式

## 🤔 为什么它们看起来相似？

两者都涉及到"顺序访问"一系列对象，但**目的完全不同**！

## 📊 核心区别对比

| 维度         | 责任链模式               | 迭代器模式           |
| ------------ | ------------------------ | -------------------- |
| **主要目的** | 🎯 **处理请求**          | 📚 **遍历集合**      |
| **访问模式** | 找到处理器后**通常停止** | **访问所有元素**     |
| **中断性**   | ✅ 可以随时中断          | ❌ 通常遍历全部      |
| **处理逻辑** | 每个节点**判断并处理**   | 只**访问**，不处理   |
| **数据流动** | 请求在链中**传递**       | 指针在集合中**移动** |
| **返回值**   | 处理结果                 | 当前元素             |
| **使用场景** | 不确定谁处理             | 需要遍历所有项       |
| **关注点**   | **谁来处理**             | **如何访问**         |

## 🎯 本质区别

### 责任链模式：寻找处理者

```
问题："谁能处理这个请求？"

流程：请求 → 节点1(不行) → 节点2(不行) → 节点3(我来！) ✋ 停止
```

### 迭代器模式：访问所有元素

```
问题："如何访问所有元素？"

流程：访问元素1 → 访问元素2 → 访问元素3 → ... → 访问元素N
```

## 💡 形象比喻

### 责任链 = 找对的人

你去医院看病：

```
前台 → 能处理挂号 ✅ (停止)

或者：
前台(不能开药) → 医生 → 能开药 ✅ (停止)
```

**特点**：找到能处理的人就停止

### 迭代器 = 点名

老师上课点名：

```
张三 → 李四 → 王五 → ... → 最后一个学生
```

**特点**：必须遍历所有人

## 📝 代码对比

### 责任链模式实现

```typescript
// 目的：找到能处理请求的处理器
class Handler {
  constructor(
    private process: (req: any) => any,
    private next?: Handler
  ) {}

  handle(req: any) {
    const result = this.process(req)
    // 如果处理成功，返回结果（停止）
    if (result !== undefined) return result
    // 否则传递给下一个（继续）
    return this.next?.handle(req)
  }
}

// 使用：寻找能处理数字的处理器
const h1 = new Handler(x =>
  typeof x === 'number' ? `处理了数字:${x}` : undefined
)
const h2 = new Handler(
  x => (typeof x === 'string' ? `处理了字符串:${x}` : undefined),
  h1
)

console.log(h2.handle(42)) // "处理了数字:42" (h1处理，停止)
console.log(h2.handle('hello')) // "处理了字符串:hello" (h2处理，停止)
```

### 迭代器模式实现

```typescript
// 目的：遍历所有元素
class ArrayIterator<T> {
  private index = 0

  constructor(private items: T[]) {}

  hasNext(): boolean {
    return this.index < this.items.length
  }

  next(): T | undefined {
    if (!this.hasNext()) return undefined
    return this.items[this.index++]
  }
}

// 使用：访问所有元素
const iterator = new ArrayIterator([1, 2, 3, 4, 5])

while (iterator.hasNext()) {
  console.log(iterator.next()) // 1, 2, 3, 4, 5 (访问所有)
}
```

## 🔍 深入分析

### 1. 访问模式的区别

#### 责任链：选择性执行

```typescript
// 只有符合条件的节点会执行
const authChain = new Handler(req => {
  if (!req.user) return '未授权' // 执行并停止
  return undefined // 不处理，继续
})

const roleChain = new Handler(req => {
  if (req.user.role !== 'admin') return '无权限' // 执行并停止
  return undefined // 不处理，继续
}, authChain)

// 结果：可能在第一个节点就停止
```

#### 迭代器：全部访问

```typescript
// 访问所有元素
const iter = [1, 2, 3].values()
for (const item of iter) {
  console.log(item) // 1, 2, 3 全部访问
}
```

### 2. 控制流的区别

#### 责任链：由处理器决定是否继续

```typescript
handle(req) {
  const result = this.process(req)
  if (result !== undefined) {
    return result // 决定：停止
  }
  return this.next?.handle(req) // 决定：继续
}
```

#### 迭代器：由调用者决定是否继续

```typescript
while (iterator.hasNext()) {
  const item = iterator.next()
  // 调用者决定是否继续
  if (someCondition) break
}
```

### 3. 数据处理的区别

#### 责任链：处理并转换数据

```typescript
// 中间件可以修改请求
const middleware1 = (req, res, next) => {
  req.timestamp = Date.now() // 修改数据
  next()
}

const middleware2 = (req, res, next) => {
  req.user = authenticate(req) // 处理数据
  next()
}
```

#### 迭代器：只访问，不修改

```typescript
// 迭代器只负责访问
const iter = array.values()
const item = iter.next().value // 只读取
```

## 🎓 使用场景对比

### 责任链模式适用于：

1. **不确定谁应该处理请求**

   ```typescript
   // 审批流程：根据金额决定审批人
   request → 组长 → 经理 → 总监 → CEO
   ```

2. **需要动态组合处理器**

   ```typescript
   // 中间件：根据需要添加/删除
   app.use(logger).use(auth).use(validator)
   ```

3. **处理可以中途终止**
   ```typescript
   // 验证链：第一个失败就停止
   validate1 → validate2(失败) ✋ 停止
   ```

### 迭代器模式适用于：

1. **需要遍历所有元素**

   ```typescript
   // 遍历数组
   for (const item of array) {
     process(item)
   }
   ```

2. **隐藏内部结构**

   ```typescript
   // 不暴露树的内部结构
   const iter = tree.iterator()
   while (iter.hasNext()) {
     console.log(iter.next())
   }
   ```

3. **统一访问接口**
   ```typescript
   // 数组、链表、树都用同样的方式遍历
   for (const item of collection) {
     // 不关心内部结构
   }
   ```

## 🔄 它们可以结合使用

### 示例：责任链 + 迭代器

```typescript
// 使用迭代器遍历责任链
class HandlerChain {
  private handlers: Handler[] = []

  add(handler: Handler) {
    this.handlers.push(handler)
  }

  // 迭代器：遍历所有处理器
  *[Symbol.iterator]() {
    for (const handler of this.handlers) {
      yield handler
    }
  }

  // 责任链：寻找处理器
  handle(req: any) {
    for (const handler of this.handlers) {
      const result = handler.process(req)
      if (result !== undefined) {
        return result // 找到处理器，停止
      }
    }
    return undefined
  }
}
```

## 📋 JavaScript/TypeScript 中的体现

### 责任链

```typescript
// Express 中间件
app.use(middleware1) // 可能在这里停止
app.use(middleware2) // 也可能在这里停止
app.use(middleware3) // 或者这里
```

### 迭代器

```typescript
// for...of 循环
for (const item of [1, 2, 3]) {
  console.log(item) // 遍历所有
}

// Array.prototype.map
;[1, 2, 3].map(x => x * 2) // 处理所有元素
```

## 🎯 核心总结

### 责任链模式

- **目标**：找到处理者
- **过程**：传递请求直到被处理
- **结果**：处理结果或未处理
- **关键**：谁来处理？何时停止？

### 迭代器模式

- **目标**：访问所有元素
- **过程**：遍历整个集合
- **结果**：访问到的元素
- **关键**：如何遍历？如何隐藏结构？

## 💡 记忆技巧

**责任链 = 接力赛**

- 棒传给下一个人
- 到达终点就停止
- 重点：谁接棒？谁跑完？

**迭代器 = 阅兵式**

- 检阅所有士兵
- 从第一个到最后一个
- 重点：如何走过所有人？

## 📚 相关模式

### 责任链相关

- **命令模式**：封装请求
- **观察者模式**：通知多个对象
- **策略模式**：选择算法

### 迭代器相关

- **组合模式**：遍历树形结构
- **访问者模式**：在遍历时执行操作
- **备忘录模式**：保存遍历状态

## 🎓 学习建议

1. **理解本质区别**
   - 责任链：解决"谁处理"的问题
   - 迭代器：解决"如何访问"的问题

2. **关注使用场景**
   - 需要找处理者 → 责任链
   - 需要遍历集合 → 迭代器

3. **实践中体会**
   - 写一个中间件系统（责任链）
   - 写一个自定义迭代器（迭代器）

4. **不要混淆**
   - 都是"顺序访问"，但目的不同
   - 都可能"中断"，但原因不同
