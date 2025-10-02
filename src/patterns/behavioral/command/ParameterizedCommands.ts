// 命令模式参数化对象示例：GUI 组件配置菜单项
// 核心思想：将特定方法调用转化为独立对象，实现参数化、保存、切换等操作

// 命令接口：统一执行规范
interface MenuCommand {
  execute(): void
  getDescription(): string
}

// 接收者：文档编辑器（提供具体操作）
class DocumentEditor {
  private content: string = ''
  private clipboard: string = ''

  newDocument(): void {
    this.content = ''
    console.log('📄 新建文档')
  }

  openDocument(filename: string): void {
    this.content = `打开的文件：${filename}`
    console.log(`📂 打开文档：${filename}`)
  }

  saveDocument(): void {
    console.log('💾 保存文档')
  }

  copyText(): void {
    this.clipboard = this.content
    console.log('📋 复制文本')
  }

  pasteText(): void {
    this.content += this.clipboard
    console.log('📝 粘贴文本')
  }

  showContent(): void {
    console.log(`当前内容：${this.content || '(空白文档)'}`)
  }
}

// 具体命令：新建文档
class NewDocumentCommand implements MenuCommand {
  constructor(private editor: DocumentEditor) {}

  execute(): void {
    this.editor.newDocument()
  }

  getDescription(): string {
    return '新建'
  }
}

// 具体命令：打开文档（带参数）
class OpenDocumentCommand implements MenuCommand {
  constructor(
    private editor: DocumentEditor,
    private filename: string
  ) {}

  execute(): void {
    this.editor.openDocument(this.filename)
  }

  getDescription(): string {
    return `打开 ${this.filename}`
  }
}

// 具体命令：保存文档
class SaveDocumentCommand implements MenuCommand {
  constructor(private editor: DocumentEditor) {}

  execute(): void {
    this.editor.saveDocument()
  }

  getDescription(): string {
    return '保存'
  }
}

// 具体命令：复制文本
class CopyCommand implements MenuCommand {
  constructor(private editor: DocumentEditor) {}

  execute(): void {
    this.editor.copyText()
  }

  getDescription(): string {
    return '复制'
  }
}

// 具体命令：粘贴文本
class PasteCommand implements MenuCommand {
  constructor(private editor: DocumentEditor) {}

  execute(): void {
    this.editor.pasteText()
  }

  getDescription(): string {
    return '粘贴'
  }
}

// GUI 组件：上下文菜单（调用者）
class ContextMenu {
  private menuItems: { label: string; command: MenuCommand }[] = []

  // 添加菜单项（参数化配置）
  addMenuItem(label: string, command: MenuCommand): void {
    this.menuItems.push({ label, command })
  }

  // 移除菜单项
  removeMenuItem(label: string): void {
    this.menuItems = this.menuItems.filter(item => item.label !== label)
  }

  // 显示菜单
  showMenu(): void {
    console.log('\n=== 上下文菜单 ===')
    this.menuItems.forEach((item, index) => {
      console.log(
        `${index + 1}. ${item.label} (${item.command.getDescription()})`
      )
    })
    console.log('==================\n')
  }

  // 执行菜单项（模拟用户点击）
  clickMenuItem(index: number): void {
    if (index >= 0 && index < this.menuItems.length) {
      const item = this.menuItems[index]
      console.log(`🖱️ 点击菜单项：${item.label}`)
      item.command.execute()
    } else {
      console.log('❌ 无效的菜单项索引')
    }
  }

  // 运行时切换命令
  replaceCommand(label: string, newCommand: MenuCommand): void {
    const item = this.menuItems.find(item => item.label === label)
    if (item) {
      item.command = newCommand
      console.log(`🔄 已更新菜单项"${label}"的命令`)
    }
  }
}

// 演示函数：展示命令模式的参数化对象应用
export function parameterizedCommandDemo(): void {
  console.log('🎯 命令模式参数化对象示例：GUI 组件配置菜单项\n')

  // 创建接收者
  const editor = new DocumentEditor()

  // 创建各种命令对象
  const newCmd = new NewDocumentCommand(editor)
  const openCmd1 = new OpenDocumentCommand(editor, 'report.txt')
  const openCmd2 = new OpenDocumentCommand(editor, 'readme.md')
  const saveCmd = new SaveDocumentCommand(editor)
  const copyCmd = new CopyCommand(editor)
  const pasteCmd = new PasteCommand(editor)

  // 创建上下文菜单
  const menu = new ContextMenu()

  // 配置菜单项（参数化对象）
  menu.addMenuItem('新建文档', newCmd)
  menu.addMenuItem('打开报告', openCmd1)
  menu.addMenuItem('保存文档', saveCmd)
  menu.addMenuItem('复制内容', copyCmd)
  menu.addMenuItem('粘贴内容', pasteCmd)

  // 展示菜单
  menu.showMenu()

  // 模拟用户操作
  menu.clickMenuItem(1) // 打开报告
  editor.showContent()

  menu.clickMenuItem(3) // 复制内容
  menu.clickMenuItem(4) // 粘贴内容
  editor.showContent()

  // 运行时切换命令（将"打开报告"替换为"打开README"）
  console.log('\n--- 运行时切换命令 ---')
  menu.replaceCommand('打开报告', openCmd2)
  menu.showMenu()

  menu.clickMenuItem(1) // 现在打开的是 readme.md
  editor.showContent()

  console.log('\n✅ 演示完成！')
  console.log('📝 关键优势：')
  console.log('  1. 参数化对象：可以将命令作为参数传递给菜单项')
  console.log('  2. 保存命令：命令对象可以存储在菜单中')
  console.log('  3. 运行时切换：可以动态更换菜单项的命令')
  console.log('  4. 解耦UI与逻辑：菜单不需要知道具体操作细节')
}
