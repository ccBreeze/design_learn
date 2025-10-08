# 备忘录模式 (Memento Pattern)

## 定义

在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便以后可以将该对象恢复到原先保存的状态。

## 核心思想

- **保存状态**：将对象的内部状态保存到备忘录对象中
- **恢复状态**：从备忘录对象恢复之前保存的状态
- **不破坏封装**：只有原发器可以访问备忘录的内部状态

## 结构

```text
┌─────────────┐
│ Originator  │ 创建    ┌──────────┐
│  (原发器)   │────────▶│ Memento  │
│             │ 使用    │ (备忘录) │
└──────┬──────┘◀────────└──────────┘
       │
       │ 被管理
       ▼
┌─────────────┐         ┌──────────┐
│ Caretaker   │ 保存    │ Memento  │
│  (负责人)   │────────▶│          │
└─────────────┘         └──────────┘
```

## 参与者

1. **Memento（备忘录）**
   - 存储 Originator 的内部状态
   - 防止除 Originator 之外的对象访问备忘录

2. **Originator（原发器）**
   - 创建备忘录，保存当前状态
   - 使用备忘录恢复内部状态

3. **Caretaker（负责人）**
   - 负责保存备忘录
   - 不能对备忘录的内容进行操作或检查

## 优点

✅ **保存和恢复状态**：提供了状态恢复机制，用户可以方便地回到历史状态
✅ **封装性**：不破坏对象的封装性，外界无法访问内部状态
✅ **简化原发器**：将状态存储委托给备忘录，简化原发器的职责

## 缺点

❌ **资源消耗**：如果保存的状态过多或状态对象过大，会消耗大量内存
❌ **性能开销**：频繁创建备忘录对象可能影响性能

## 使用场景

- 需要保存/恢复对象的状态（如撤销功能）
- 需要提供可回滚的操作
- 不希望外界直接访问对象的内部状态

## 实际应用

1. **编辑器撤销/重做**：文本编辑器、图形编辑器
2. **游戏存档**：保存游戏进度
3. **数据库事务**：事务回滚
4. **浏览器历史**：后退/前进功能
5. **版本控制**：Git 的快照机制

## 代码示例

### 最小实现

```typescript
// 备忘录：保存状态的快照
class Memento {
  constructor(private state: string) {}

  getState(): string {
    return this.state
  }
}

// 原发器：需要保存状态的对象
class Editor {
  private content: string = ''

  type(text: string): void {
    this.content += text
  }

  getContent(): string {
    return this.content
  }

  // 保存状态到备忘录
  save(): Memento {
    return new Memento(this.content)
  }

  // 从备忘录恢复状态
  restore(memento: Memento): void {
    this.content = memento.getState()
  }
}

// 负责人：管理备忘录
class History {
  private mementos: Memento[] = []

  push(memento: Memento): void {
    this.mementos.push(memento)
  }

  pop(): Memento | undefined {
    return this.mementos.pop()
  }
}
```

### 使用

```typescript
const editor = new Editor()
const history = new History()

editor.type('Hello')
history.push(editor.save()) // 保存状态

editor.type(' World')
console.log(editor.getContent()) // Hello World

// 撤销
const memento = history.pop()
if (memento) editor.restore(memento)
console.log(editor.getContent()) // Hello
```

## 进阶实现

### 带时间戳的备忘录

```typescript
class Memento {
  constructor(
    private state: string,
    private timestamp: number = Date.now()
  ) {}

  getState(): string {
    return this.state
  }

  getTimestamp(): number {
    return this.timestamp
  }
}
```

### 限制历史记录数量

```typescript
class History {
  private mementos: Memento[] = []
  private maxSize: number = 10

  push(memento: Memento): void {
    if (this.mementos.length >= this.maxSize) {
      this.mementos.shift() // 移除最旧的
    }
    this.mementos.push(memento)
  }
}
```

### 多状态保存

```typescript
class ComplexMemento {
  constructor(
    private content: string,
    private cursorPosition: number,
    private selection: [number, number]
  ) {}

  getContent(): string {
    return this.content
  }

  getCursorPosition(): number {
    return this.cursorPosition
  }

  getSelection(): [number, number] {
    return this.selection
  }
}
```

## 与其他模式的关系

- **命令模式**：命令模式可以使用备忘录来保存命令执行前的状态，用于撤销
- **迭代器模式**：可以使用备忘录来保存迭代器的状态
- **原型模式**：备忘录可以使用原型模式来克隆状态

## 实现要点

1. **封装性**：备忘录应该只允许原发器访问其内部状态
2. **窄接口**：负责人只能看到备忘录的窄接口（不能修改内容）
3. **宽接口**：原发器能看到备忘录的宽接口（可以访问所有状态）
4. **内存管理**：注意限制保存的备忘录数量，避免内存溢出

## TypeScript 实现技巧

### 使用私有构造函数

```typescript
class Editor {
  private content: string = ''

  // 内部类，只有 Editor 能访问
  save(): EditorMemento {
    return new EditorMemento(this.content)
  }

  restore(memento: EditorMemento): void {
    this.content = memento.getState()
  }
}

class EditorMemento {
  constructor(private state: string) {}

  getState(): string {
    return this.state
  }
}
```

## 关键点

1. 备忘录保存对象的状态快照
2. 原发器创建和使用备忘录
3. 负责人管理备忘录，但不修改其内容
4. 不破坏对象的封装性
