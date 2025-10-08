/**
 * 模板方法模式 Demo
 * 演示：制作饮料的流程
 */

// 抽象类：饮料制作模板
abstract class Beverage {
  // 模板方法：定义制作流程（不能被重写）
  prepare(): void {
    console.log('\n开始制作...')
    this.boilWater()
    this.brew()
    this.pourInCup()
    if (this.customerWantsCondiments()) {
      this.addCondiments()
    }
    console.log('完成！\n')
  }

  // 具体方法：所有子类共用
  private boilWater(): void {
    console.log('1. 💧 烧开水')
  }

  private pourInCup(): void {
    console.log('3. ☕ 倒入杯中')
  }

  // 抽象方法：子类必须实现
  protected abstract brew(): void
  protected abstract addCondiments(): void

  // 钩子方法：子类可以选择性重写
  protected customerWantsCondiments(): boolean {
    return true
  }
}

// 具体类：茶
class Tea extends Beverage {
  protected brew(): void {
    console.log('2. 🍵 泡茶叶')
  }

  protected addCondiments(): void {
    console.log('4. 🍋 加柠檬')
  }
}

// 具体类：咖啡
class Coffee extends Beverage {
  protected brew(): void {
    console.log('2. ☕ 冲泡咖啡粉')
  }

  protected addCondiments(): void {
    console.log('4. 🥛 加糖和牛奶')
  }
}

// 具体类：黑咖啡（使用钩子方法）
class BlackCoffee extends Beverage {
  protected brew(): void {
    console.log('2. ☕ 冲泡咖啡粉')
  }

  protected addCondiments(): void {
    console.log('4. (跳过添加调料)')
  }

  // 重写钩子方法：不添加调料
  protected customerWantsCondiments(): boolean {
    return false
  }
}

// Demo 运行
export function templateMethodDemo(): void {
  console.log('=== 模板方法模式 - 饮料制作流程 ===')

  console.log('\n📋 制作流程:')
  console.log('  1. 烧开水')
  console.log('  2. 冲泡')
  console.log('  3. 倒入杯中')
  console.log('  4. 添加调料（可选）')

  console.log('\n' + '='.repeat(40))
  console.log('🍵 制作茶')
  console.log('='.repeat(40))
  const tea = new Tea()
  tea.prepare()

  console.log('='.repeat(40))
  console.log('☕ 制作咖啡')
  console.log('='.repeat(40))
  const coffee = new Coffee()
  coffee.prepare()

  console.log('='.repeat(40))
  console.log('☕ 制作黑咖啡（不加调料）')
  console.log('='.repeat(40))
  const blackCoffee = new BlackCoffee()
  blackCoffee.prepare()

  console.log('=== Demo 完成 ===')
  console.log('💡 关键点:')
  console.log('  1. prepare() 是模板方法，定义了算法骨架')
  console.log('  2. brew() 和 addCondiments() 是抽象方法，由子类实现')
  console.log('  3. boilWater() 和 pourInCup() 是具体方法，所有子类共用')
  console.log('  4. customerWantsCondiments() 是钩子方法，子类可选重写')
}

// 如果直接运行这个文件
if (import.meta.url === `file://${process.argv[1]}`) {
  templateMethodDemo()
}
