# 中介者模式 vs 观察者模式 - 详细对比

## 快速对比表

| 维度            | 中介者模式                    | 观察者模式                   |
| --------------- | ----------------------------- | ---------------------------- |
| **核心意图**    | 解耦对象间的复杂交互          | 对象间一对多的依赖通知       |
| **通信方式**    | 多对多，通过中介者双向通信    | 一对多，单向广播通知         |
| **对象关系**    | 星型结构（同事 ↔ 中介者）    | 树型结构（主题 → 观察者们）  |
| **交互复杂度**  | 处理复杂的对象间协调逻辑      | 简单的状态变化通知           |
| **同事/观察者** | 主动发送和接收消息            | 被动接收通知                 |
| **中介/主题**   | 协调交互，控制消息路由        | 简单广播，通知所有观察者     |
| **耦合度**      | 同事对象间解耦，但依赖中介者  | 主题和观察者相对独立         |
| **典型应用**    | 聊天室、航空管制、GUI组件协调 | 事件系统、数据绑定、发布订阅 |

## 核心区别图解

### 中介者模式：星型协调结构

```text
        同事A
          ↕
同事C ↔ 中介者 ↔ 同事B
          ↕
        同事D

- 同事对象通过中介者通信
- 双向交互
- 中介者控制交互逻辑
```

### 观察者模式：树型通知结构

```text
      主题
       ↓
    广播通知
    ↙  ↓  ↘
  观A  观B  观C

- 主题单向通知观察者
- 观察者被动接收
- 简单广播机制
```

## 代码对比

### 中介者模式示例

```typescript
// 中介者接口
interface Mediator {
  notify(sender: string, event: string): void
}

// 具体中介者：聊天室
class ChatRoom implements Mediator {
  private users = new Map<string, User>()

  register(user: User): void {
    this.users.set(user.name, user)
    user.setMediator(this)
  }

  // 中介者决定如何路由消息
  notify(sender: string, message: string): void {
    this.users.forEach(user => {
      if (user.name !== sender) {
        user.receive(sender, message) // 转发给其他用户
      }
    })
  }
}

// 同事类：用户
class User {
  name: string
  private mediator?: Mediator

  constructor(name: string) {
    this.name = name
  }

  setMediator(mediator: Mediator): void {
    this.mediator = mediator
  }

  // 主动发送消息（通过中介者）
  send(message: string): void {
    this.mediator?.notify(this.name, message)
  }

  // 接收消息（来自中介者）
  receive(sender: string, message: string): void {
    console.log(`${this.name} 收到 ${sender}: ${message}`)
  }
}

// 使用
const chatRoom = new ChatRoom()
const alice = new User('Alice')
const bob = new User('Bob')
const charlie = new User('Charlie')

chatRoom.register(alice)
chatRoom.register(bob)
chatRoom.register(charlie)

alice.send('大家好！') // Bob 和 Charlie 收到
bob.send('你好！') // Alice 和 Charlie 收到
```

**特点**：

- 用户之间不直接引用，通过聊天室通信
- 聊天室控制消息路由逻辑（不发送给自己）
- 双向交互：用户既发送也接收消息
- 解决多对多的复杂交互

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

  // 注册观察者
  attach(observer: Observer): void {
    this.observers.add(observer)
  }

  // 移除观察者
  detach(observer: Observer): void {
    this.observers.delete(observer)
  }

  // 状态改变，通知所有观察者
  setState(state: number): void {
    this.state = state
    this.notify()
  }

  // 简单广播给所有观察者
  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.state)
    }
  }
}

// 具体观察者
class Display implements Observer {
  constructor(private name: string) {}

  // 被动接收通知
  update(state: number): void {
    console.log(`${this.name} 收到状态更新: ${state}`)
  }
}

// 使用
const subject = new Subject()
const display1 = new Display('显示器1')
const display2 = new Display('显示器2')

subject.attach(display1)
subject.attach(display2)

subject.setState(42) // 所有观察者都收到通知
```

**特点**：

- 主题维护观察者列表
- 状态改变时自动广播给所有观察者
- 单向通知：主题 → 观察者
- 观察者被动接收，不主动发送

## 核心区别详解

### 1. 通信模式不同

**中介者模式**：

- 同事对象之间通过中介者进行**双向通信**
- A → 中介者 → B，B → 中介者 → A
- 中介者决定消息如何路由、发给谁
- 支持复杂的交互逻辑

**观察者模式**：

- 主题到观察者的**单向广播**
- 主题 → 所有观察者
- 观察者不能通过主题与其他观察者通信
- 简单的通知机制

### 2. 对象职责不同

**中介者模式**：

- **同事对象**：主动发送消息，也可接收消息，知道中介者存在
- **中介者**：协调交互，控制消息路由，了解所有同事对象
- 中介者包含复杂的业务逻辑

**观察者模式**：

- **观察者**：被动接收通知，只需实现 `update()` 方法
- **主题**：维护观察者列表，状态改变时广播，不关心观察者的具体行为
- 主题只负责通知，不包含复杂逻辑

### 3. 依赖关系不同

**中介者模式**：

```text
多对多关系 → 通过中介者 → 星型结构

原本：A ↔ B ↔ C ↔ D (网状依赖)
现在：A → 中介者 ← B
      ↑          ↓
      D ←  ← ←  C
```

**观察者模式**：

```text
一对多关系 → 树型结构

主题
 ├→ 观察者A
 ├→ 观察者B
 └→ 观察者C
```

### 4. 使用目的不同

**中介者模式**：

- **解决问题**：对象间复杂的相互依赖和交互
- **目的**：降低多个对象间的耦合度
- **场景**：对象之间需要相互通信和协调

**观察者模式**：

- **解决问题**：一个对象状态改变需要通知其他对象
- **目的**：建立自动的通知机制
- **场景**：一个对象的状态变化需要同步到多个对象

## 实际场景对比

### 中介者模式：航空管制塔台

```typescript
// 中介者：塔台
class ControlTower implements Mediator {
  private aircrafts = new Map<string, Aircraft>()

  register(aircraft: Aircraft): void {
    this.aircrafts.set(aircraft.id, aircraft)
    aircraft.setMediator(this)
  }

  // 复杂的协调逻辑
  notify(senderId: string, event: string): void {
    if (event === '请求降落') {
      // 检查跑道状态，协调其他飞机
      console.log(`塔台: 允许 ${senderId} 降落`)
      // 通知其他飞机等待
      this.aircrafts.forEach((aircraft, id) => {
        if (id !== senderId) {
          aircraft.receive('塔台', '请等待')
        }
      })
    }
  }
}

// 同事：飞机
class Aircraft {
  constructor(public id: string) {}
  private mediator?: Mediator

  setMediator(m: Mediator): void {
    this.mediator = m
  }

  requestLanding(): void {
    this.mediator?.notify(this.id, '请求降落')
  }

  receive(sender: string, msg: string): void {
    console.log(`${this.id} 收到 ${sender}: ${msg}`)
  }
}
```

**特点**：飞机通过塔台协调，塔台控制复杂的交互逻辑

### 观察者模式：温度传感器

```typescript
// 主题：温度传感器
class TemperatureSensor {
  private observers: Set<Observer> = new Set()
  private temperature: number = 0

  attach(observer: Observer): void {
    this.observers.add(observer)
  }

  setTemperature(temp: number): void {
    this.temperature = temp
    this.notify() // 简单广播
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.temperature)
    }
  }
}

// 观察者：显示设备
class TemperatureDisplay implements Observer {
  update(temperature: number): void {
    console.log(`显示温度: ${temperature}°C`)
  }
}

// 观察者：报警系统
class TemperatureAlert implements Observer {
  update(temperature: number): void {
    if (temperature > 30) {
      console.log('⚠️ 温度过高警报！')
    }
  }
}
```

**特点**：传感器状态改变，自动通知所有监听设备

## 何时使用哪种模式？

### 选择中介者模式

✅ **适合场景**：

- 多个对象之间有复杂的交互关系
- 对象间的依赖关系混乱且难以维护
- 需要集中管理和控制对象间的交互逻辑
- 对象之间需要双向通信

**例子**：

- 聊天室（用户之间相互发消息）
- 航空管制系统（飞机与塔台协调）
- GUI 对话框（多个组件相互影响）
- MVC 中的 Controller（协调 Model 和 View）

### 选择观察者模式

✅ **适合场景**：

- 一个对象状态改变需要通知其他对象
- 不需要知道有多少对象需要被通知
- 对象之间是单向的依赖关系
- 需要动态添加或移除依赖

**例子**：

- 事件监听系统（DOM 事件）
- 数据绑定（Model 变化更新 View）
- 消息订阅系统
- 实时数据推送

## 两种模式可以结合使用

在某些场景下，可以同时使用两种模式：

```typescript
// 中介者模式 + 观察者模式
class GameRoom implements Mediator {
  private players = new Map<string, Player>()
  private observers: Set<GameObserver> = new Set() // 观察者

  register(player: Player): void {
    this.players.set(player.name, player)
    player.setMediator(this)
  }

  // 观察者模式：订阅游戏事件
  attach(observer: GameObserver): void {
    this.observers.add(observer)
  }

  // 中介者模式：玩家通信
  notify(sender: string, action: string): void {
    this.players.forEach((player, name) => {
      if (name !== sender) {
        player.receive(sender, action)
      }
    })

    // 观察者模式：通知观察者
    this.notifyObservers(sender, action)
  }

  // 通知所有观察者
  private notifyObservers(sender: string, action: string): void {
    for (const observer of this.observers) {
      observer.update(sender, action)
    }
  }
}
```

## 记忆技巧

**中介者模式**：想象**聊天室**

- 用户通过聊天室相互发消息（双向）
- 聊天室控制谁能收到消息（路由逻辑）
- 用户之间不直接联系
- 解决多对多的复杂交互

**观察者模式**：想象**广播电台**

- 电台（主题）广播节目
- 听众（观察者）收听节目（单向）
- 听众可以订阅或取消订阅
- 电台不关心有多少听众

## 总结对比

| 选择           | 何时使用                                 |
| -------------- | ---------------------------------------- |
| **中介者模式** | 多个对象间有复杂交互，需要双向通信和协调 |
| **观察者模式** | 一个对象状态改变需要自动通知多个对象     |

**本质区别**：

- **中介者模式**：解决"对象间如何协调交互"（复杂的多对多关系）
- **观察者模式**：解决"状态如何自动传播"（简单的一对多通知）

**相似点**：

- 都实现了对象间的解耦
- 都有一个"中心对象"（中介者/主题）
- 都支持动态添加/移除关系

**关键区别**：

- 中介者：**双向交互**，复杂路由逻辑，星型结构
- 观察者：**单向通知**，简单广播机制，树型结构
