import { describe, it, expect } from 'vitest'

// 中介者接口
interface Mediator {
  notify(sender: string, event: string): void
}

// 聊天室中介者
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

// 用户类
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
    this.mediator?.notify(this.name, message)
  }

  receive(sender: string, message: string): void {
    this.messages.push(`${sender}: ${message}`)
  }

  getMessages(): string[] {
    return this.messages
  }
}

describe('中介者模式', () => {
  it('应该通过中介者在用户间传递消息', () => {
    const chatRoom = new ChatRoom()

    const alice = new User('Alice')
    const bob = new User('Bob')
    const charlie = new User('Charlie')

    chatRoom.register(alice)
    chatRoom.register(bob)
    chatRoom.register(charlie)

    // Alice 发送消息
    alice.send('大家好！')

    // Bob 和 Charlie 应该收到消息
    expect(bob.getMessages()).toEqual(['Alice: 大家好！'])
    expect(charlie.getMessages()).toEqual(['Alice: 大家好！'])
    // Alice 不应该收到自己的消息
    expect(alice.getMessages()).toEqual([])
  })

  it('应该支持多个用户发送消息', () => {
    const chatRoom = new ChatRoom()

    const alice = new User('Alice')
    const bob = new User('Bob')

    chatRoom.register(alice)
    chatRoom.register(bob)

    alice.send('Hi Bob')
    bob.send('Hi Alice')

    expect(alice.getMessages()).toEqual(['Bob: Hi Alice'])
    expect(bob.getMessages()).toEqual(['Alice: Hi Bob'])
  })

  it('用户不应收到自己发送的消息', () => {
    const chatRoom = new ChatRoom()
    const alice = new User('Alice')

    chatRoom.register(alice)
    alice.send('Hello')

    expect(alice.getMessages()).toEqual([])
  })
})
