/**
 * 基础组件类声明了组成中的简单和复杂对象的操作。
 */
abstract class Component {
  protected parent: Component | null = null

  /**
   * 可选地，基础组件可以声明一个接口用于设置和访问组件在树结构中的父节点。
   * 它也可以为这些方法提供一些默认的实现。
   */
  public setParent(parent: Component | null) {
    this.parent = parent
  }

  public getParent(): Component | null {
    return this.parent
  }

  /**
   * 在某些情况下，在基础组件类中定义子元素管理操作是有益的。
   * 这样，你就不需要在客户端代码中暴露任何具体的组件类，即使在对象树的组装过程中也是如此。
   * 缺点是这些方法对于叶级组件将是空的。
   */
  public add(_component: Component): void {}

  public remove(_component: Component): void {}

  /**
   * 你可以提供一个方法，让客户端代码判断组件是否可以拥有子元素。
   */
  public isComposite(): boolean {
    return false
  }

  /**
   * 基础组件可以实现一些默认的行为或将其声明为抽象方法（通过声明包含行为的方法为“抽象”）。
   */
  public abstract operation(): string
}

/**
 * 叶类代表组成中的终端对象。叶子不能有任何子元素。
 *
 * 通常，是叶对象执行实际的工作，而复合对象只是将工作委托给其子组件。
 */
class Leaf extends Component {
  public operation(): string {
    return 'Leaf'
  }
}

/**
 * 复合类代表可以拥有子元素的复杂组件。
 * 通常，复合对象会将实际的工作委托给它们的子元素，然后汇总结果。
 */
class Composite extends Component {
  protected children: Component[] = []

  /**
   * 复合对象可以向其子列表中添加或移除其他组件（无论是简单的还是复杂的）。
   */
  public add(component: Component): void {
    this.children.push(component)
    component.setParent(this)
  }

  public remove(component: Component): void {
    const componentIndex = this.children.indexOf(component)
    this.children.splice(componentIndex, 1)
    component.setParent(null)
  }

  public isComposite(): boolean {
    return true
  }

  /**
   * 复合对象以特定的方式执行其主要逻辑。它递归遍历所有子元素，
   * 收集并汇总它们的结果。由于子元素将这些调用传递给它们的子元素等等，
   * 结果整个对象树都被遍历。
   */
  public operation(): string {
    const results = []
    for (const child of this.children) {
      results.push(child.operation())
    }

    return `Branch(${results.join('+')})`
  }
}

/** 叶组件 */
const _simple = new Leaf()

/** 复杂的复合树 */
const branch1 = new Composite()
branch1.add(new Leaf())
branch1.add(new Leaf())

const branch2 = new Composite()
branch2.add(new Leaf())

const tree = new Composite()
tree.add(branch1)
tree.add(branch2)
