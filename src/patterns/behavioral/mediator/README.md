# 中介者模式 (Mediator Pattern)

## 定义

中介者模式用一个中介对象来封装一系列对象之间的交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。

## 核心思想

- **解耦对象间的直接通信**：对象之间不直接相互引用和调用
- **通过中介者协调**：所有交互都通过中介者进行
- **集中控制逻辑**：复杂的交互逻辑集中在中介者中

## 结构

```text
┌─────────┐         ┌──────────┐         ┌─────────┐
│ User A  │────────▶│ Mediator │◀────────│ User B  │
└─────────┘         └──────────┘         └─────────┘
                         ▲
                         │
                    ┌────┴────┐
                    │ User C  │
                    └─────────┘
```

## 参与者

1. **Mediator（中介者接口）**
   - 定义与各同事对象通信的接口

2. **ConcreteMediator（具体中介者）**
   - 实现协作行为
   - 了解并维护各个同事对象

3. **Colleague（同事类）**
   - 每个同事对象知道它的中介者对象
   - 需要与其他同事通信时，与中介者通信

## 优点

✅ **降低耦合**：将多对多的关系转换为一对多的关系  
✅ **集中控制**：交互逻辑集中在一处，易于维护  
✅ **简化对象协议**：一对多替代多对多，简化了对象间的通信  
✅ **增强复用性**：同事类可以在不同的中介者中复用

## 缺点

❌ **中介者可能变得复杂**：所有交互逻辑集中可能导致中介者过于复杂  
❌ **单点问题**：中介者成为系统的关键点

## 使用场景

- 一组对象以定义良好但复杂的方式进行通信
- 想要复用一个对象，但该对象引用了很多其他对象，难以复用
- 想要定制一个分布在多个类中的行为，但又不想生成太多子类

## 实际应用

1. **聊天室**：用户通过聊天室发送消息，而不是直接发送给其他用户
2. **UI 组件协调**：多个 UI 组件通过控制器协调
3. **MVC 模式**：Controller 作为 View 和 Model 之间的中介者
4. **航空管制系统**：飞机不直接通信，通过塔台协调

## 代码示例

### 最小实现

```typescript
interface Mediator {
  notify(sender: string, event: string): void
}

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

class User {
  name: string
  private mediator?: Mediator

  constructor(name: string) {
    this.name = name
  }

  setMediator(mediator: Mediator): void {
    this.mediator = mediator
  }

  send(message: string): void {
    this.mediator?.notify(this.name, message)
  }

  receive(sender: string, message: string): void {
    console.log(`${this.name} 收到 ${sender}: ${message}`)
  }
}
```

### 使用

```typescript
const chatRoom = new ChatRoom()

const alice = new User('Alice')
const bob = new User('Bob')

chatRoom.register(alice)
chatRoom.register(bob)

alice.send('Hello Bob!') // Bob 收到消息
bob.send('Hi Alice!') // Alice 收到消息
```

## 与其他模式的关系

- **观察者模式**：观察者模式是一对多的广播，中介者模式是多对多通过中介转换为一对多
- **外观模式**：外观模式为子系统提供简化接口，中介者协调同事对象之间的交互
- **命令模式**：可以用命令模式来实现中介者与同事之间的通信

## 关键点

1. 同事对象通过中介者进行通信，而不是直接引用
2. 中介者了解并维护各个同事对象
3. 将多对多的依赖关系转换为一对多的依赖关系
