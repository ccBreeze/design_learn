/**
 * 工厂方法模式（Factory Method）—最小可运行示例
 * 要点：
 * - 把对象创建延迟到子类，由子类决定实例化哪一个具体产品。
 * - Creator 定义工厂方法 factoryMethod，子类覆写返回不同 Product。
 */

// 1) 抽象产品
export interface Product {
  operation(): string
}

// 2) 具体产品
export class ConcreteProductA implements Product {
  operation(): string {
    return 'A'
  }
}

export class ConcreteProductB implements Product {
  operation(): string {
    return 'B'
  }
}

// 3) 创建者（包含工厂方法）
export abstract class Creator {
  // 工厂方法：由子类决定创建哪种具体产品
  protected abstract factoryMethod(): Product

  // 通用业务逻辑：依赖抽象产品，复用流程，解耦具体类
  someOperation(): string {
    const product = this.factoryMethod()
    return `Creator: working with -> ${product.operation()}`
  }
}

// 4) 具体创建者：覆写工厂方法，返回不同产品
export class ConcreteCreatorA extends Creator {
  protected factoryMethod(): Product {
    return new ConcreteProductA()
  }
}

export class ConcreteCreatorB extends Creator {
  protected factoryMethod(): Product {
    return new ConcreteProductB()
  }
}

// 5) 使用示例（注释以避免构建副作用）
// const creatorA = new ConcreteCreatorA();
// const creatorB = new ConcreteCreatorB();
// console.log(creatorA.someOperation()); // Creator: working with -> A
// console.log(creatorB.someOperation()); // Creator: working with -> B
