// 最少代码实现：模板方法模式
// 目标：最小结构演示"定义算法骨架，延迟部分步骤到子类"

// 抽象类：定义模板方法
abstract class Beverage {
  // 模板方法：定义算法骨架（final，不能被重写）
  prepare(): void {
    this.boilWater()
    this.brew()
    this.pourInCup()
    this.addCondiments()
  }

  // 具体方法：所有子类共用
  private boilWater(): void {
    console.log('烧开水')
  }

  private pourInCup(): void {
    console.log('倒入杯中')
  }

  // 抽象方法：子类必须实现
  protected abstract brew(): void
  protected abstract addCondiments(): void
}

// 具体类：茶
class Tea extends Beverage {
  protected brew(): void {
    console.log('泡茶叶')
  }

  protected addCondiments(): void {
    console.log('加柠檬')
  }
}

// 具体类：咖啡
class Coffee extends Beverage {
  protected brew(): void {
    console.log('冲泡咖啡')
  }

  protected addCondiments(): void {
    console.log('加糖和牛奶')
  }
}

export function templateMethodDemo(): void {
  console.log('=== 制作茶 ===')
  const tea = new Tea()
  tea.prepare()

  console.log('\n=== 制作咖啡 ===')
  const coffee = new Coffee()
  coffee.prepare()
}
