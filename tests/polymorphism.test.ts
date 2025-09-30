import { describe, it, expect } from 'vitest'
import { polymorphismDemo, renderAll, Circle, Square, Shape } from '../src'

describe('Polymorphism (统一接口下的不同实现)', () => {
  it('polymorphismDemo 展示运行时多态', () => {
    const out = polymorphismDemo()
    expect(out).toBe('Circle.draw() | Square.draw()')
  })

  it('renderAll 基于接口进行动态派发', () => {
    const shapes: Shape[] = [new Circle(), new Square()]
    expect(renderAll(shapes)).toBe('Circle.draw() | Square.draw()')
  })

  it('添加新类型无需修改渲染逻辑', () => {
    class Triangle implements Shape {
      draw(): string {
        return 'Triangle.draw()'
      }
    }
    const shapes: Shape[] = [new Circle(), new Triangle()]
    expect(renderAll(shapes)).toBe('Circle.draw() | Triangle.draw()')
  })
})
