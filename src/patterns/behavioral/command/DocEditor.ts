// 命令模式（含撤销）：抽象命令 + 具体命令 + 历史记录 + 应用协调

// 抽象命令：封装一次可撤销的编辑操作
abstract class Command {
  protected app: Application
  protected editor: Editor
  protected backup: string = ''

  constructor(app: Application, editor: Editor) {
    this.app = app
    this.editor = editor
  }

  // 在修改前保存文本，用于撤销
  saveBackup(): void {
    this.backup = this.editor.text
  }

  // 撤销：恢复至备份的文本
  undo(): void {
    this.editor.text = this.backup
  }

  // 返回 true 表示更改了状态，需要记录到历史栈
  abstract execute(): boolean
}

// 接收者：提供基础文本与选区操作
class Editor {
  text: string
  private selectionStart = 0
  private selectionEnd = 0

  constructor(text: string = '') {
    this.text = text
  }

  // 设置选区，起止索引会被限制在文本长度范围内
  setSelection(start: number, end: number): void {
    const len = this.text.length
    this.selectionStart = Math.max(0, Math.min(start, len))
    this.selectionEnd = Math.max(this.selectionStart, Math.min(end, len))
  }

  // 获取当前选中文本（半开半闭区间）
  getSelection(): string {
    return this.text.slice(this.selectionStart, this.selectionEnd)
  }

  // 删除选中文本，光标归位到起点
  deleteSelection(): void {
    const pre = this.text.slice(0, this.selectionStart)
    const suf = this.text.slice(this.selectionEnd)
    this.text = pre + suf
    this.selectionEnd = this.selectionStart
  }

  // 用指定文本替换选区，选区更新为新文本范围
  replaceSelection(text: string): void {
    const pre = this.text.slice(0, this.selectionStart)
    const suf = this.text.slice(this.selectionEnd)
    this.text = pre + text + suf
    this.selectionEnd = this.selectionStart + text.length
  }
}

// 历史记录：栈结构，支持 push/pop 撤销
class CommandHistory {
  private history: Command[] = []

  push(c: Command): void {
    this.history.push(c)
  }

  pop(): Command | undefined {
    return this.history.pop()
  }
}

// 发送者/协调者：统一调度命令，维护剪贴板与历史
class Application {
  clipboard = ''
  editors: Editor[] = []
  activeEditor: Editor
  history = new CommandHistory()

  constructor(activeEditor?: Editor) {
    this.activeEditor = activeEditor ?? new Editor()
  }

  // 执行命令：只有改变状态的命令才入栈
  executeCommand(command: Command): void {
    if (command.execute()) {
      this.history.push(command)
    }
  }

  // 撤销最近一次改变状态的命令
  undo(): void {
    const command = this.history.pop()
    if (command) command.undo()
  }
}

// 复制：不更改文本，不入历史栈
class CopyCommand extends Command {
  execute(): boolean {
    this.app.clipboard = this.editor.getSelection()
    return false
  }
}

// 剪切：更改文本（删除选区），需保存备份并入栈
class CutCommand extends Command {
  execute(): boolean {
    this.saveBackup()
    this.app.clipboard = this.editor.getSelection()
    this.editor.deleteSelection()
    return true
  }
}

// 粘贴：更改文本（替换选区），需保存备份并入栈
class PasteCommand extends Command {
  execute(): boolean {
    this.saveBackup()
    this.editor.replaceSelection(this.app.clipboard)
    return true
  }
}

// 撤销命令：委托应用执行撤销，不入历史栈
class UndoCommand extends Command {
  execute(): boolean {
    this.app.undo()
    return false
  }
}

// Demo：复制 → 剪切 → 粘贴 → 撤销，返回状态字符串便于验证
export function commandUndoDemo(): string {
  const editor = new Editor('Hello World')
  // 选中 "World"
  editor.setSelection(6, 11)
  const app = new Application(editor)

  app.executeCommand(new CopyCommand(app, editor))
  const s1 = `clipboard=${app.clipboard}`

  app.executeCommand(new CutCommand(app, editor))
  const s2 = `text=${editor.text}`

  editor.setSelection(5, 5)
  app.executeCommand(new PasteCommand(app, editor))
  const s3 = `text=${editor.text}`

  app.executeCommand(new UndoCommand(app, editor))
  const s4 = `text=${editor.text}`

  return [s1, s2, s3, s4].join(' | ')
}
