# 中介者模式 - 快速总结

## 一句话概括

对象之间不直接通信，而是通过中介者对象来协调交互，降低对象间的耦合度。

## 核心要点

### 问题

- 多个对象之间相互通信，导致复杂的网状依赖关系
- 对象间耦合度高，难以复用和维护
- 交互逻辑分散在各个对象中，难以理解和修改

### 解决方案

- 引入中介者对象
- 所有同事对象通过中介者通信
- 将多对多关系转换为一对多关系

### 结构

```text
对象 A ──┐
         ├──▶ 中介者 ◀──┬── 对象 B
对象 C ──┘              └── 对象 D
```

## 最少代码示例

```typescript
// 中介者接口
interface Mediator {
  notify(sender: string, event: string): void
}

// 具体中介者
class ChatRoom implements Mediator {
  private users = new Map<string, User>()

  register(user: User): void {
    this.users.set(user.name, user)
    user.setMediator(this)
  }

  notify(sender: string, message: string): void {
    this.users.forEach(user => {
      if (user.name !== sender) {
        user.receive(sender, message)
      }
    })
  }
}

// 同事类
class User {
  constructor(public name: string) {}
  private mediator?: Mediator

  setMediator(m: Mediator): void {
    this.mediator = m
  }
  send(msg: string): void {
    this.mediator?.notify(this.name, msg)
  }
  receive(sender: string, msg: string): void {
    console.log(`${this.name} 收到 ${sender}: ${msg}`)
  }
}

// 使用
const room = new ChatRoom()
const alice = new User('Alice')
const bob = new User('Bob')

room.register(alice)
room.register(bob)

alice.send('Hi') // Bob 收到消息，但 Alice 不收到自己的消息
```

## 优缺点对比

| 优点 ✅          | 缺点 ❌            |
| ---------------- | ------------------ |
| 降低对象间耦合   | 中介者可能变得复杂 |
| 集中控制交互逻辑 | 中介者成为单点     |
| 简化对象间的关系 | 可能降低可读性     |
| 提高对象复用性   | 可能影响性能       |

## 使用时机

✅ **适合使用**

- 一组对象以复杂的方式进行通信
- 对象间的依赖关系混乱且难以理解
- 想要复用对象但其依赖太多其他对象
- 需要集中管理多个对象间的交互逻辑

❌ **不适合使用**

- 对象间交互简单，使用中介者反而增加复杂度
- 只有两个对象需要通信
- 交互逻辑经常变化且不统一

## 实际应用场景

1. **聊天室系统** - 用户通过聊天室发送消息
2. **航空管制** - 飞机通过塔台协调
3. **GUI 框架** - 多个组件通过控制器协调
4. **MVC 架构** - Controller 作为 Model 和 View 的中介者

## 记忆技巧

想象一个**聊天室**：

- 用户（同事对象）不直接给其他用户发消息
- 所有消息都通过聊天室（中介者）转发
- 新用户加入只需注册到聊天室，无需知道其他用户

## 与其他模式的区别

| 模式       | 区别                                                 |
| ---------- | ---------------------------------------------------- |
| **观察者** | 观察者是一对多广播；中介者是多对多通过中介转为一对多 |
| **外观**   | 外观简化接口，单向；中介者协调交互，双向             |
| **代理**   | 代理控制对单个对象的访问；中介者协调多个对象         |

## 关键代码特征

```typescript
// 1. 中介者接口
interface Mediator {
  notify(sender, event): void
}

// 2. 同事类持有中介者引用
class Colleague {
  private mediator: Mediator
  // 通过中介者通信
  doSomething() {
    this.mediator.notify(this, 'event')
  }
}

// 3. 中介者协调交互
class ConcreteMediator {
  notify(sender, event) {
    // 根据发送者和事件协调其他对象
  }
}
```

## 总结

中介者模式通过引入一个中介对象，将原本网状的多对多依赖关系转换为星型的一对多关系，从而降低对象间的耦合度，使系统更易于维护和扩展。关键是要平衡好中介者的复杂度，避免中介者成为"上帝对象"。
