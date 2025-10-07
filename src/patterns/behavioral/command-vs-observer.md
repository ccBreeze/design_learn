# 命令模式 vs 观察者模式 - 详细对比

## 快速对比表

| 维度         | 命令模式                     | 观察者模式                   |
| ------------ | ---------------------------- | ---------------------------- |
| **核心意图** | 封装请求为对象               | 对象间一对多依赖关系         |
| **通信方式** | 一对一（调用者→命令→接收者） | 一对多（主题→多个观察者）    |
| **解耦程度** | 解耦调用者和接收者           | 解耦主题和观察者             |
| **关注点**   | 动作的封装和执行             | 状态变化的通知               |
| **时间特性** | 可延迟执行、排队、撤销       | 即时通知（状态改变时）       |
| **对象数量** | 通常单个命令对应单个接收者   | 一个主题对应多个观察者       |
| **典型应用** | GUI按钮、撤销/重做、事务     | 事件系统、数据绑定、发布订阅 |

## 代码对比

### 命令模式示例

```typescript
// 命令接口
interface Command {
  execute(): void
}

// 接收者
class Light {
  on(): void {
    console.log('Light ON')
  }
  off(): void {
    console.log('Light OFF')
  }
}

// 具体命令
class TurnOnCommand implements Command {
  constructor(private light: Light) {}
  execute(): void {
    this.light.on()
  }
}

// 调用者
class RemoteControl {
  constructor(private command: Command) {}
  press(): void {
    this.command.execute() // 执行特定命令
  }
}

// 使用
const light = new Light()
const command = new TurnOnCommand(light)
const remote = new RemoteControl(command)
remote.press() // Light ON
```

**特点**：

- 调用者只知道"执行命令"，不知道具体做什么
- 命令对象封装了接收者和动作
- 一次只执行一个命令

### 观察者模式示例

```typescript
// 观察者接口
interface Observer {
  update(state: number): void
}

// 主题
class Subject {
  private observers: Set<Observer> = new Set()
  private state: number = 0

  attach(observer: Observer): void {
    this.observers.add(observer)
  }

  setState(state: number): void {
    this.state = state
    this.notify() // 状态改变，通知所有观察者
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.state)
    }
  }
}

// 具体观察者
class Display implements Observer {
  update(state: number): void {
    console.log(`Display: state = ${state}`)
  }
}

// 使用
const subject = new Subject()
const display1 = new Display()
const display2 = new Display()

subject.attach(display1)
subject.attach(display2)

subject.setState(42) // 两个 Display 都会收到通知
```

**特点**：

- 主题维护观察者列表
- 状态改变时，自动通知所有观察者
- 多个观察者同时响应

## 核心区别详解

### 1. 意图不同

**命令模式**：

- 目的是将"请求"封装成对象
- 支持参数化、排队、日志、撤销等操作
- 关注的是**动作的封装和控制**

**观察者模式**：

- 目的是建立一对多的依赖关系
- 一个对象状态改变时，依赖它的对象都会得到通知
- 关注的是**状态变化的传播**

### 2. 通信模式不同

**命令模式**：

```text
调用者 → 命令 → 接收者
  |       |       |
 按钮   命令对象  灯泡
(单向、一对一)
```

**观察者模式**：

```text
    主题
     ↓
  通知所有
   ↙  ↓  ↘
 观A 观B 观C
(单向、一对多)
```

### 3. 生命周期不同

**命令模式**：

- 命令对象可以被创建、存储、传递、延迟执行
- 可以放入队列、历史栈
- 生命周期由调用者控制

**观察者模式**：

- 观察者注册到主题后持续监听
- 主题状态改变时自动触发
- 观察者可以动态订阅/取消订阅

### 4. 使用场景不同

**命令模式适用于**：

- GUI 操作（按钮点击执行命令）
- 撤销/重做功能（命令历史栈）
- 宏命令（组合多个命令）
- 事务系统（命令作为事务单元）
- 请求排队和日志记录

**观察者模式适用于**：

- 事件处理系统
- MVC 架构（Model 通知 View）
- 数据绑定（数据变化更新 UI）
- 消息订阅系统
- 实时数据同步

## 实际例子对比

### 命令模式：文本编辑器的撤销功能

```typescript
interface Command {
  execute(): void
  undo(): void
}

class InsertTextCommand implements Command {
  constructor(
    private editor: Editor,
    private text: string,
    private position: number
  ) {}

  execute(): void {
    this.editor.insert(this.text, this.position)
  }

  undo(): void {
    this.editor.delete(this.position, this.text.length)
  }
}

// 编辑器维护命令历史
class Editor {
  private history: Command[] = []

  executeCommand(cmd: Command): void {
    cmd.execute()
    this.history.push(cmd) // 可以撤销
  }

  undo(): void {
    const cmd = this.history.pop()
    cmd?.undo()
  }
}
```

### 观察者模式：股票价格监控

```typescript
class Stock {
  private observers: Set<Observer> = new Set()
  private price: number = 0

  attach(observer: Observer): void {
    this.observers.add(observer)
  }

  setPrice(price: number): void {
    this.price = price
    this.notify() // 价格变化，通知所有监控者
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.price)
    }
  }
}

class PriceDisplay implements Observer {
  update(price: number): void {
    console.log(`显示价格: ${price}`)
  }
}

class PriceAlert implements Observer {
  update(price: number): void {
    if (price > 100) {
      console.log('警告：价格过高！')
    }
  }
}

// 多个观察者同时监控同一股票
const stock = new Stock()
stock.attach(new PriceDisplay())
stock.attach(new PriceAlert())
stock.setPrice(105) // 两个观察者都会响应
```

## 可以结合使用

两种模式可以配合使用，例如：

```typescript
// 命令模式 + 观察者模式
class CommandExecutor {
  private observers: Set<Observer> = new Set()

  executeCommand(cmd: Command): void {
    cmd.execute() // 命令模式
    this.notify() // 执行后通知观察者（观察者模式）
  }

  attach(observer: Observer): void {
    this.observers.add(observer)
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update()
    }
  }
}
```

## 记忆技巧

**命令模式**：想象遥控器

- 按钮（调用者）→ 命令 → 设备（接收者）
- 一个按钮执行一个特定命令
- 可以记录按钮历史，支持撤销

**观察者模式**：想象订阅通知

- 博主（主题）发布文章 → 所有粉丝（观察者）都收到通知
- 粉丝可以订阅或取消订阅
- 博主不需要知道粉丝是谁

## 总结

| 选择           | 场景                                         |
| -------------- | -------------------------------------------- |
| **命令模式**   | 需要封装请求、支持撤销、延迟执行、请求排队时 |
| **观察者模式** | 需要一个对象状态改变时自动通知多个对象时     |

两种模式的本质区别：

- **命令模式**关注"如何执行动作"（封装请求）
- **观察者模式**关注"如何传播状态"（通知机制）
