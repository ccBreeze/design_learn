// 最少代码实现：中介者模式
// 目标：最小结构演示"对象间通过中介者通信，而非直接引用"

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
  private messages: string[] = []

  constructor(name: string) {
    this.name = name
  }

  setMediator(mediator: Mediator): void {
    this.mediator = mediator
  }

  send(message: string): void {
    console.log(`${this.name} 发送: ${message}`)
    this.mediator?.notify(this.name, message)
  }

  receive(sender: string, message: string): void {
    const msg = `${sender}: ${message}`
    this.messages.push(msg)
    console.log(`${this.name} 收到 ${msg}`)
  }

  getMessages(): string[] {
    return this.messages
  }
}

export function mediatorDemo(): void {
  const chatRoom = new ChatRoom()

  const alice = new User('Alice')
  const bob = new User('Bob')
  const charlie = new User('Charlie')

  chatRoom.register(alice)
  chatRoom.register(bob)
  chatRoom.register(charlie)

  alice.send('大家好！')
  bob.send('你好 Alice！')
  charlie.send('嗨！')
}
