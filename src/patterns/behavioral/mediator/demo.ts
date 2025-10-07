/**
 * 中介者模式 Demo
 * 演示：聊天室场景 - 用户之间通过聊天室（中介者）进行通信
 */

interface Mediator {
  notify(sender: string, event: string): void
}

class ChatRoom implements Mediator {
  private users = new Map<string, User>()

  register(user: User): void {
    this.users.set(user.name, user)
    user.setMediator(this)
    console.log(`📢 ${user.name} 加入了聊天室`)
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
  private messages: string[] = []

  constructor(name: string) {
    this.name = name
  }

  setMediator(mediator: Mediator): void {
    this.mediator = mediator
  }

  send(message: string): void {
    console.log(`💬 ${this.name} 发送: ${message}`)
    this.mediator?.notify(this.name, message)
  }

  receive(sender: string, message: string): void {
    const msg = `${sender}: ${message}`
    this.messages.push(msg)
    console.log(`   📩 ${this.name} 收到 ${msg}`)
  }

  getMessages(): string[] {
    return this.messages
  }
}

// Demo 运行
export function mediatorDemo(): void {
  console.log('=== 中介者模式 - 聊天室示例 ===\n')

  const chatRoom = new ChatRoom()

  const alice = new User('Alice')
  const bob = new User('Bob')
  const charlie = new User('Charlie')

  chatRoom.register(alice)
  chatRoom.register(bob)
  chatRoom.register(charlie)

  console.log()
  alice.send('大家好！')

  console.log()
  bob.send('你好 Alice！')

  console.log()
  charlie.send('嗨，很高兴认识大家！')

  console.log('\n=== 消息记录 ===')
  console.log(`Alice 的消息记录:`, alice.getMessages())
  console.log(`Bob 的消息记录:`, bob.getMessages())
  console.log(`Charlie 的消息记录:`, charlie.getMessages())
}
