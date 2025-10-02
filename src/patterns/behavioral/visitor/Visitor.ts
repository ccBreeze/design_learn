/**
 * 访问者模式（Visitor）—最少代码示例
 * 要点：将“对元素的操作”封装到访问者中，元素仅暴露 accept。
 */

// 访问者接口：针对不同元素暴露不同的访问方法
interface Visitor {
  visitCircle(e: Circle): string
  visitSquare(e: Square): string
}

// 元素接口：只负责接受访问者
interface Element {
  accept(v: Visitor): string
}

// 具体元素 A：圆形
class Circle implements Element {
  constructor(public radius: number) {}
  accept(v: Visitor): string {
    return v.visitCircle(this)
  }
}

// 具体元素 B：正方形
class Square implements Element {
  constructor(public side: number) {}
  accept(v: Visitor): string {
    return v.visitSquare(this)
  }
}

// 具体访问者：计算面积（演示单一操作）
class AreaVisitor implements Visitor {
  visitCircle(e: Circle): string {
    const area = Math.PI * e.radius * e.radius
    return `circle=${area.toFixed(2)}`
  }
  visitSquare(e: Square): string {
    const area = e.side * e.side
    return `square=${area}`
  }
}

// 最小可运行 demo：对一组元素应用同一个访问者
export function visitorDemo(): string {
  const shapes: Element[] = [new Circle(2), new Square(3)]
  const v = new AreaVisitor()
  return shapes.map(s => s.accept(v)).join(' | ')
}
