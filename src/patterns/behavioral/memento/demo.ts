/**
 * 备忘录模式 Demo
 * 演示：文本编辑器的撤销功能
 */

// 备忘录：保存状态的快照
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

// 原发器：文本编辑器
class TextEditor {
  private content: string = ''

  type(text: string): void {
    this.content += text
    console.log(`✏️  输入: "${text}"`)
    console.log(`   当前内容: "${this.content}"`)
  }

  delete(count: number): void {
    this.content = this.content.slice(0, -count)
    console.log(`🗑️  删除 ${count} 个字符`)
    console.log(`   当前内容: "${this.content}"`)
  }

  getContent(): string {
    return this.content
  }

  // 保存当前状态到备忘录
  save(): Memento {
    console.log(`💾 保存状态: "${this.content}"`)
    return new Memento(this.content)
  }

  // 从备忘录恢复状态
  restore(memento: Memento): void {
    this.content = memento.getState()
    console.log(`⏮️  恢复到: "${this.content}"`)
  }
}

// 负责人：历史记录管理器
class History {
  private mementos: Memento[] = []

  push(memento: Memento): void {
    this.mementos.push(memento)
  }

  pop(): Memento | undefined {
    return this.mementos.pop()
  }

  size(): number {
    return this.mementos.length
  }

  showHistory(): void {
    console.log('\n📚 历史记录:')
    if (this.mementos.length === 0) {
      console.log('   (无历史记录)')
      return
    }
    this.mementos.forEach((memento, index) => {
      console.log(`   ${index + 1}. "${memento.getState()}"`)
    })
  }
}

// Demo 运行
export function mementoDemo(): void {
  console.log('=== 备忘录模式 - 文本编辑器撤销功能 ===\n')

  const editor = new TextEditor()
  const history = new History()

  // 编辑过程
  editor.type('Hello')
  history.push(editor.save())

  console.log()
  editor.type(' World')
  history.push(editor.save())

  console.log()
  editor.type('!')
  history.push(editor.save())

  console.log()
  editor.type('!!')
  console.log(`\n当前最终内容: "${editor.getContent()}"`)

  // 显示历史记录
  history.showHistory()

  // 撤销操作
  console.log('\n--- 开始撤销 ---\n')

  let memento = history.pop()
  if (memento) {
    editor.restore(memento)
  }

  console.log()
  memento = history.pop()
  if (memento) {
    editor.restore(memento)
  }

  console.log()
  memento = history.pop()
  if (memento) {
    editor.restore(memento)
  }

  console.log(`\n✅ 最终内容: "${editor.getContent()}"`)

  console.log('\n=== Demo 完成 ===')
  console.log('💡 关键点:')
  console.log('  1. Memento 封装保存的状态')
  console.log('  2. Editor 负责创建和恢复备忘录')
  console.log('  3. History 管理备忘录，但不修改内容')
  console.log('  4. 实现了撤销功能，不破坏封装性')
}

// 如果直接运行这个文件
if (import.meta.url === `file://${process.argv[1]}`) {
  mementoDemo()
}
