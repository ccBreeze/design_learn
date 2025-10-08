// 最少代码实现：备忘录模式
// 目标：最小结构演示"保存和恢复对象状态"

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

export function mementoDemo(): void {
  const editor = new Editor()
  const history = new History()

  editor.type('Hello')
  history.push(editor.save()) // 保存状态

  editor.type(' World')
  history.push(editor.save()) // 保存状态

  editor.type('!!!')
  console.log('当前内容:', editor.getContent()) // Hello World!!!

  // 撤销
  const memento = history.pop()
  if (memento) editor.restore(memento)
  console.log('撤销后:', editor.getContent()) // Hello World

  // 再次撤销
  const memento2 = history.pop()
  if (memento2) editor.restore(memento2)
  console.log('再次撤销:', editor.getContent()) // Hello
}
