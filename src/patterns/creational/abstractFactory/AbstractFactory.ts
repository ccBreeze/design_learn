/**
 * 抽象工厂模式（Abstract Factory Pattern）
 *
 * 定义：提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。
 *
 * 场景：UI 组件库需要支持不同的主题风格（Material Design 和 Ant Design），
 * 每种风格都有自己的按钮、输入框等组件实现。
 */

// ========== 抽象产品接口 ==========

/** 抽象按钮产品 */
interface Button {
  render(): string
  onClick(): void
}

/** 抽象输入框产品 */
interface Input {
  render(): string
  getValue(): string
  setValue(value: string): void
}

/** 抽象对话框产品 */
interface Dialog {
  render(): string
  show(): void
  hide(): void
}

// ========== Material Design 风格的具体产品 ==========

class MaterialButton implements Button {
  render(): string {
    return '<button class="material-button">Material Button</button>'
  }

  onClick(): void {
    console.log('Material Button clicked with ripple effect')
  }
}

class MaterialInput implements Input {
  private value: string = ''

  render(): string {
    return '<input class="material-input" placeholder="Material Input" />'
  }

  getValue(): string {
    return this.value
  }

  setValue(value: string): void {
    this.value = value
    console.log(`Material Input value set to: ${value}`)
  }
}

class MaterialDialog implements Dialog {
  render(): string {
    return '<div class="material-dialog">Material Dialog with elevation shadow</div>'
  }

  show(): void {
    console.log('Material Dialog shown with fade-in animation')
  }

  hide(): void {
    console.log('Material Dialog hidden with fade-out animation')
  }
}

// ========== Ant Design 风格的具体产品 ==========

class AntButton implements Button {
  render(): string {
    return '<button class="ant-btn ant-btn-primary">Ant Design Button</button>'
  }

  onClick(): void {
    console.log('Ant Design Button clicked')
  }
}

class AntInput implements Input {
  private value: string = ''

  render(): string {
    return '<input class="ant-input" placeholder="Ant Design Input" />'
  }

  getValue(): string {
    return this.value
  }

  setValue(value: string): void {
    this.value = value
    console.log(`Ant Input value set to: ${value}`)
  }
}

class AntDialog implements Dialog {
  render(): string {
    return '<div class="ant-modal">Ant Design Modal</div>'
  }

  show(): void {
    console.log('Ant Design Modal shown')
  }

  hide(): void {
    console.log('Ant Design Modal hidden')
  }
}

// ========== 抽象工厂接口 ==========

/** 抽象 UI 组件工厂 */
interface UIFactory {
  createButton(): Button
  createInput(): Input
  createDialog(): Dialog
}

// ========== 具体工厂实现 ==========

/** Material Design 工厂 */
class MaterialFactory implements UIFactory {
  createButton(): Button {
    return new MaterialButton()
  }

  createInput(): Input {
    return new MaterialInput()
  }

  createDialog(): Dialog {
    return new MaterialDialog()
  }
}

/** Ant Design 工厂 */
class AntFactory implements UIFactory {
  createButton(): Button {
    return new AntButton()
  }

  createInput(): Input {
    return new AntInput()
  }

  createDialog(): Dialog {
    return new AntDialog()
  }
}

// ========== 客户端代码 ==========

/** UI 应用程序类 */
class Application {
  private button: Button
  private input: Input
  private dialog: Dialog

  constructor(factory: UIFactory) {
    this.button = factory.createButton()
    this.input = factory.createInput()
    this.dialog = factory.createDialog()
  }

  render(): void {
    console.log('=== 渲染 UI 组件 ===')
    console.log(this.button.render())
    console.log(this.input.render())
    console.log(this.dialog.render())
  }

  interact(): void {
    console.log('\n=== 用户交互 ===')
    this.button.onClick()
    this.input.setValue('Hello World')
    this.dialog.show()
    // 使用 globalThis.setTimeout 来避免 ESLint 错误
    globalThis.setTimeout(() => {
      this.dialog.hide()
    }, 1000)
  }
}

// ========== 工厂选择器 ==========

type ThemeType = 'material' | 'ant'

class FactoryProvider {
  static getFactory(theme: ThemeType): UIFactory {
    switch (theme) {
      case 'material':
        return new MaterialFactory()
      case 'ant':
        return new AntFactory()
      default:
        throw new Error(`Unsupported theme: ${theme}`)
    }
  }
}

// ========== 使用示例 ==========

console.log('抽象工厂模式示例：UI 组件库')
console.log('================================\n')

// 使用 Material Design 主题
console.log('🎨 Material Design 主题:')
const materialFactory = FactoryProvider.getFactory('material')
const materialApp = new Application(materialFactory)
materialApp.render()
materialApp.interact()

console.log('\n' + '='.repeat(50) + '\n')

// 使用 Ant Design 主题
console.log('🎨 Ant Design 主题:')
const antFactory = FactoryProvider.getFactory('ant')
const antApp = new Application(antFactory)
antApp.render()
antApp.interact()

console.log('\n=== 抽象工厂模式的优势 ===')
console.log('1. 确保产品族的一致性（同一主题的所有组件风格统一）')
console.log('2. 易于切换产品族（只需更换工厂即可切换整套主题）')
console.log('3. 符合开闭原则（新增主题只需新增工厂，无需修改现有代码）')
console.log('4. 将客户端与具体产品类解耦')

// 导出主要类和接口供其他模块使用
export {
  UIFactory,
  MaterialFactory,
  AntFactory,
  Application,
  FactoryProvider,
  Button,
  Input,
  Dialog,
}
