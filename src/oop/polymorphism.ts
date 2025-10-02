// 最常见的多态示例：统一接口下的不同实现

// 抽象：统一的形状接口
interface Shape {
  draw(): string
}

// 不同的具体实现：圆形与正方形
class Circle implements Shape {
  draw(): string {
    return 'Circle.draw()'
  }
}

class Square implements Shape {
  draw(): string {
    return 'Square.draw()'
  }
}

// 以抽象编程：接收统一接口，运行时根据对象实际类型动态分派
function renderAll(shapes: Shape[]): string {
  return shapes.map(s => s.draw()).join(' | ')
}

// Demo：展示运行时多态
export function polymorphismDemo(): string {
  const shapes: Shape[] = [new Circle(), new Square()]
  return renderAll(shapes)
}
