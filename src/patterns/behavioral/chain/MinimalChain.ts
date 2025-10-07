// 最少代码实现：责任链模式
// 目标：最小结构演示“无法处理则传给下一个”

interface Handler {
  setNext(next: Handler): Handler
  handle(req: unknown): unknown
}

class BaseHandler implements Handler {
  constructor(private next?: Handler) {}
  setNext(next: Handler) {
    this.next = next
    return next
  }
  handle(req: unknown) {
    return this.next?.handle(req)
  }
}

class NumberHandler extends BaseHandler {
  handle(req: unknown) {
    return typeof req === 'number' ? `number:${req}` : super.handle(req)
  }
}

class StringHandler extends BaseHandler {
  handle(req: unknown) {
    return typeof req === 'string' ? `string:${req}` : super.handle(req)
  }
}

export function chainDemo(): void {
  const h1 = new NumberHandler()
  const h2 = new StringHandler()
  h1.setNext(h2)

  console.log(h1.handle(42)) // number:42
  console.log(h1.handle('hello')) // string:hello
  console.log(h1.handle(true)) // undefined（无人处理）
}
