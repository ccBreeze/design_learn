// 责任链模式 - 极简实现（约15行核心代码）
// 核心思想：处理不了就传给下一个

/**
 * 责任链处理器
 * @template TRequest 请求类型
 * @template TResponse 响应类型
 */
export class Handler<TRequest = unknown, TResponse = unknown> {
  constructor(
    private process: (req: TRequest) => TResponse | undefined,
    private next?: Handler<TRequest, TResponse>
  ) {}

  /**
   * 处理请求，如果当前处理器无法处理，则传递给下一个处理器
   */
  handle(req: TRequest): TResponse | undefined {
    const result = this.process(req)
    return result !== undefined ? result : this.next?.handle(req)
  }

  /**
   * 设置下一个处理器（链式调用）
   */
  setNext(next: Handler<TRequest, TResponse>): this {
    this.next = next
    return this
  }
}

// ============ 使用示例 ============

// 示例1：基础用法 - 类型检查器
const numberHandler = new Handler<unknown, string>(x =>
  typeof x === 'number' ? `数字:${x}` : undefined
)
const stringHandler = new Handler<unknown, string>(
  x => (typeof x === 'string' ? `字符串:${x}` : undefined),
  numberHandler
)

console.log('📦 示例1: 基础用法')
console.log(stringHandler.handle('你好')) // 字符串:你好
console.log(stringHandler.handle(42)) // 数字:42
console.log(stringHandler.handle(true)) // undefined (无处理器)

// 示例4：实际应用 - 日志级别处理
console.log('\n📦 示例3: 日志级别处理')

interface LogRequest {
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
}
const errorLogger = new Handler<LogRequest, boolean>(req => {
  if (req.level === 'error') {
    console.log(`❌ ERROR: ${req.message}`)
    return true
  }
  return undefined
})
const warnLogger = new Handler<LogRequest, boolean>(req => {
  if (req.level === 'warn') {
    console.log(`⚠️  WARN: ${req.message}`)
    return true
  }
  return undefined
}, errorLogger)
const infoLogger = new Handler<LogRequest, boolean>(req => {
  if (req.level === 'info') {
    console.log(`ℹ️  INFO: ${req.message}`)
    return true
  }
  return undefined
}, warnLogger)

infoLogger.handle({ level: 'info', message: '应用启动' })
infoLogger.handle({ level: 'warn', message: '内存使用较高' })
infoLogger.handle({ level: 'error', message: '连接失败' })
