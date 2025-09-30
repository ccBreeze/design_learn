/** 基础组件接口定义了可以被装饰器更改的操作 */
interface Component {
  operation(): string
}

/** 具体组件提供了操作的默认实现。这些类可能有几种变体 */
export class ConcreteComponent implements Component {
  public operation(): string {
    return 'ConcreteComponent'
  }
}

/**
 * 基础装饰器类
 * 主要目的：定义所有具体装饰器的包装接口
 */
class Decorator implements Component {
  protected component: Component

  constructor(component: Component) {
    this.component = component
  }

  /** 装饰器将所有工作委托给包装的组件 */
  public operation(): string {
    return this.component.operation()
  }
}

export class ConcreteDecoratorA extends Decorator {
  public operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`
  }
}

export class ConcreteDecoratorB extends Decorator {
  public operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`
  }
}
