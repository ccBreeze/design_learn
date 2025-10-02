/**
 * 原型模式（Prototype Pattern）
 *
 * 通过克隆现有对象来创建新对象，避免依赖具体类的构造逻辑，
 * 在需要批量复制、保留运行时状态或按多态方式复制对象的场景下非常适用。
 */

// ========== 基础原型 ==========

/**
 * 抽象形状：声明公共属性与抽象的 clone 方法。
 * 支持「默认构造」与「原型构造（拷贝构造）」两种方式。
 */
export abstract class Shape {
  x: number = 0
  y: number = 0
  color: string = 'black'

  /**
   * 原型构造函数：从已有对象拷贝状态。
   */
  constructor(source?: Shape) {
    if (source) {
      this.x = source.x
      this.y = source.y
      this.color = source.color
    }
  }

  /** 克隆当前对象（由子类具体实现） */
  abstract clone(): Shape
}

// ========== 具体原型：矩形 ==========

export class Rectangle extends Shape {
  width: number = 0
  height: number = 0

  constructor(source?: Rectangle) {
    super(source)
    if (source) {
      this.width = source.width
      this.height = source.height
    }
  }

  clone(): Shape {
    return new Rectangle(this)
  }
}

// ========== 具体原型：圆形 ==========

export class Circle extends Shape {
  radius: number = 0

  constructor(source?: Circle) {
    super(source)
    if (source) {
      this.radius = source.radius
    }
  }

  clone(): Shape {
    return new Circle(this)
  }
}

// ========== 客户端示例 ==========

/**
 * 应用：维护一组形状，并在不关心具体类型的情况下批量克隆它们。
 */
export class Application {
  shapes: Shape[] = []

  constructor() {
    const circle = new Circle()
    circle.x = 10
    circle.y = 10
    circle.radius = 20
    circle.color = 'red'
    this.shapes.push(circle)

    const anotherCircle = circle.clone()
    anotherCircle.x = 30
    this.shapes.push(anotherCircle)

    const rectangle = new Rectangle()
    rectangle.width = 10
    rectangle.height = 20
    rectangle.color = 'blue'
    this.shapes.push(rectangle)
  }

  businessLogic(): Shape[] {
    const shapesCopy: Shape[] = []
    for (const s of this.shapes) {
      shapesCopy.push(s.clone())
    }
    return shapesCopy
  }
}

// ========== 演示函数（最小可运行 Demo） ==========

function describeShape(shape: Shape): string {
  if (shape instanceof Circle) {
    return `Circle(x=${shape.x}, y=${shape.y}, color=${shape.color}, radius=${shape.radius})`
  }
  if (shape instanceof Rectangle) {
    return `Rectangle(x=${shape.x}, y=${shape.y}, color=${shape.color}, width=${shape.width}, height=${shape.height})`
  }
  return `Shape(x=${shape.x}, y=${shape.y}, color=${shape.color})`
}

/**
 * 原型模式 Demo：构建初始集合并批量克隆，输出描述文本。
 */
export function prototypeDemo(): string {
  const app = new Application()
  const clones = app.businessLogic()
  const originalDesc = app.shapes.map(describeShape).join('\n')
  const cloneDesc = clones.map(describeShape).join('\n')
  return `Original Shapes:\n${originalDesc}\n---\nCloned Shapes:\n${cloneDesc}`
}

console.log(prototypeDemo())
