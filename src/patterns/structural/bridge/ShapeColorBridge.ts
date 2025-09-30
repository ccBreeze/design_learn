/**
 * 桥接模式示例：将“形状”与“颜色”拆分为两个相关的类层次
 * 目的：避免单个类层次（如 红色圆形、蓝色方形 等组合爆炸）而失控。
 * 通过组合（形状包含颜色），让两者独立演化、自由组合。
 */

// ========== 实现层（颜色） ==========

export interface Color {
  apply(): string
}

export class Red implements Color {
  apply(): string {
    return 'red'
  }
}

export class Blue implements Color {
  apply(): string {
    return 'blue'
  }
}

// ========== 抽象层（形状） ==========

export abstract class Shape {
  protected color: Color
  constructor(color: Color) {
    this.color = color
  }
  setColor(color: Color): void {
    this.color = color
  }
  abstract draw(): string
}

export class Circle extends Shape {
  draw(): string {
    return `Circle painted ${this.color.apply()}`
  }
}

export class Square extends Shape {
  draw(): string {
    return `Square painted ${this.color.apply()}`
  }
}

// ========== 最小可运行 Demo ==========

export function shapeBridgeDemo(): string {
  const circle = new Circle(new Red())
  const square = new Square(new Blue())

  // 动态切换颜色，演示抽象与实现可独立演化
  circle.setColor(new Blue())

  return [circle.draw(), square.draw()].join(' | ')
}
