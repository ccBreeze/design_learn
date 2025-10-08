import { describe, it, expect } from 'vitest'

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

describe('备忘录模式', () => {
  it('应该能够保存和恢复状态', () => {
    const editor = new Editor()
    const history = new History()

    editor.type('Hello')
    history.push(editor.save())

    editor.type(' World')
    expect(editor.getContent()).toBe('Hello World')

    // 恢复到之前的状态
    const memento = history.pop()
    if (memento) editor.restore(memento)
    expect(editor.getContent()).toBe('Hello')
  })

  it('应该支持多次撤销', () => {
    const editor = new Editor()
    const history = new History()

    editor.type('A')
    history.push(editor.save())

    editor.type('B')
    history.push(editor.save())

    editor.type('C')
    expect(editor.getContent()).toBe('ABC')

    // 第一次撤销
    let memento = history.pop()
    if (memento) editor.restore(memento)
    expect(editor.getContent()).toBe('AB')

    // 第二次撤销
    memento = history.pop()
    if (memento) editor.restore(memento)
    expect(editor.getContent()).toBe('A')
  })

  it('备忘录应该独立存储状态', () => {
    const editor = new Editor()

    editor.type('State 1')
    const memento1 = editor.save()

    editor.type(' State 2')
    const memento2 = editor.save()

    // 两个备忘录应该保存不同的状态
    expect(memento1.getState()).toBe('State 1')
    expect(memento2.getState()).toBe('State 1 State 2')

    // 恢复到第一个状态
    editor.restore(memento1)
    expect(editor.getContent()).toBe('State 1')
  })

  it('当历史为空时应该安全处理', () => {
    const editor = new Editor()
    const history = new History()

    editor.type('Test')

    const memento = history.pop()
    expect(memento).toBeUndefined()
    expect(editor.getContent()).toBe('Test') // 内容不变
  })
})
