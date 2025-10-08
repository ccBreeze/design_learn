# 备忘录模式 - 快速总结

## 一句话概括

在不破坏封装的前提下，捕获并保存对象的内部状态，以便以后恢复到该状态。

## 核心要点

### 问题

- 需要保存和恢复对象的历史状态
- 直接暴露对象内部状态会破坏封装性
- 需要实现撤销/重做功能

### 解决方案

- 将对象状态保存到备忘录对象中
- 备忘录对象只能被原发器访问
- 负责人管理备忘录，但不能修改其内容

### 结构

```text
原发器 ──创建──▶ 备忘录
  ↑              ↓
  └────恢复────┘

负责人 ──管理──▶ 备忘录（不能修改）
```

## 最少代码示例

```typescript
// 备忘录：保存状态
class Memento {
  constructor(private state: string) {}
  getState(): string {
    return this.state
  }
}

// 原发器：创建和使用备忘录
class Editor {
  private content: string = ''

  type(text: string): void {
    this.content += text
  }

  save(): Memento {
    return new Memento(this.content)
  }

  restore(memento: Memento): void {
    this.content = memento.getState()
  }

  getContent(): string {
    return this.content
  }
}

// 负责人：管理备忘录
class History {
  private mementos: Memento[] = []

  push(m: Memento): void {
    this.mementos.push(m)
  }

  pop(): Memento | undefined {
    return this.mementos.pop()
  }
}

// 使用
const editor = new Editor()
const history = new History()

editor.type('Hello')
history.push(editor.save())

editor.type(' World')
console.log(editor.getContent()) // Hello World

const memento = history.pop()
if (memento) editor.restore(memento)
console.log(editor.getContent()) // Hello
```

## 三个角色

| 角色       | 职责                                   | 示例    |
| ---------- | -------------------------------------- | ------- |
| Originator | 创建备忘录保存状态，使用备忘录恢复状态 | Editor  |
| Memento    | 存储原发器的内部状态                   | Memento |
| Caretaker  | 管理备忘录，但不能查看或修改其内容     | History |

## 优缺点对比

| 优点 ✅          | 缺点 ❌                |
| ---------------- | ---------------------- |
| 提供状态恢复机制 | 消耗内存               |
| 不破坏封装性     | 频繁保存可能影响性能   |
| 简化原发器职责   | 需要维护备忘录生命周期 |

## 使用时机

✅ **适合使用**

- 需要实现撤销/重做功能
- 需要保存对象的历史状态
- 需要提供状态回滚机制
- 不想暴露对象的内部实现

❌ **不适合使用**

- 对象状态非常大，保存会消耗大量内存
- 对象状态变化频繁，保存成本高
- 简单的状态保存（可直接复制）

## 实际应用场景

1. **文本编辑器** - 撤销/重做功能
2. **游戏** - 存档和读档
3. **浏览器** - 后退/前进
4. **数据库** - 事务回滚
5. **图形编辑器** - 操作历史
6. **版本控制** - Git 快照

## 记忆技巧

想象**游戏存档**：

- 原发器 = 游戏状态（角色、位置、装备等）
- 备忘录 = 存档文件（保存所有状态）
- 负责人 = 存档管理器（管理存档列表）
- 玩家可以随时保存和读取存档
- 存档文件不能被外界随意修改

## 与其他模式的区别

| 模式         | 区别                                       |
| ------------ | ------------------------------------------ |
| **命令模式** | 命令模式封装操作；备忘录模式保存状态       |
| **原型模式** | 原型模式克隆整个对象；备忘录只保存必要状态 |
| **快照**     | 快照是完整复制；备忘录可以选择性保存状态   |

## 实现要点

### 1. 封装性

```typescript
// ✅ 好的做法：只有原发器能访问状态
class Memento {
  constructor(private state: string) {}
  getState(): string {
    return this.state
  }
}

// ❌ 坏的做法：暴露可修改的状态
class BadMemento {
  public state: string
}
```

### 2. 内存管理

```typescript
// 限制历史记录数量
class History {
  private mementos: Memento[] = []
  private maxSize = 10

  push(memento: Memento): void {
    if (this.mementos.length >= this.maxSize) {
      this.mementos.shift() // 移除最旧的
    }
    this.mementos.push(memento)
  }
}
```

### 3. 多状态保存

```typescript
// 保存多个状态属性
class RichMemento {
  constructor(
    private content: string,
    private cursor: number,
    private selection: [number, number]
  ) {}
}
```

## 典型使用流程

```typescript
// 1. 创建原发器和负责人
const editor = new Editor()
const history = new History()

// 2. 操作并保存状态
editor.type('Hello')
history.push(editor.save()) // 保存检查点

// 3. 继续操作
editor.type(' World')

// 4. 需要时恢复状态
const memento = history.pop()
if (memento) {
  editor.restore(memento) // 撤销到之前的状态
}
```

## 关键代码特征

```typescript
class Originator {
  private state: any

  // 1. 创建备忘录
  save(): Memento {
    return new Memento(this.state)
  }

  // 2. 恢复状态
  restore(memento: Memento): void {
    this.state = memento.getState()
  }
}

class Caretaker {
  private mementos: Memento[] = []

  // 只管理，不修改
  push(m: Memento): void {
    this.mementos.push(m)
  }

  pop(): Memento | undefined {
    return this.mementos.pop()
  }
}
```

## 进阶技巧

### 增量备忘录

只保存变化的部分，而不是完整状态：

```typescript
class IncrementalMemento {
  constructor(
    private changes: Change[],
    private timestamp: number
  ) {}
}
```

### 压缩备忘录

对保存的状态进行压缩：

```typescript
class CompressedMemento {
  constructor(private compressedState: string) {}

  getState(): string {
    return this.decompress(this.compressedState)
  }

  private decompress(data: string): string {
    // 解压缩逻辑
    return data
  }
}
```

## 总结

备忘录模式提供了一种优雅的方式来保存和恢复对象的状态，同时保持封装性。它是实现撤销/重做功能的标准方案。关键是要在功能需求和资源消耗之间找到平衡点。

**核心思想**：将状态保存委托给专门的备忘录对象，原发器负责创建和使用备忘录，负责人负责管理备忘录的生命周期。
