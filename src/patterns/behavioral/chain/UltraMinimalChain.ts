/**
 * ============================================================
 * 责任链模式 (Chain of Responsibility Pattern) - 极简实现
 * ============================================================
 *
 * 核心思想：处理不了就传给下一个
 *
 * ✅ 优点：
 * 1. 降低耦合度：请求发送者和接收者解耦，发送者不需要知道谁会处理请求
 * 2. 增强灵活性：可以动态地增加或删除责任链中的处理器，改变链的顺序
 * 3. 符合单一职责原则：每个处理器只负责自己能处理的请求
 * 4. 符合开闭原则：可以添加新的处理器而不影响现有代码
 * 5. 简化对象：每个对象只需要保存对下一个对象的引用，无需知道整个链的结构
 *
 * ❌ 缺点：
 * 1. 不保证被处理：请求可能到达链的末端都没有被处理（返回 undefined）
 * 2. 性能问题：如果链太长，可能会影响性能，特别是在调试时难以追踪
 * 3. 调试困难：请求的处理路径不明确，需要从头到尾检查整条链
 * 4. 可能产生循环引用：如果链配置不当，可能会造成死循环
 *
 * 🎯 适用场景：
 * 1. 多个对象可以处理同一请求，但具体由哪个对象处理在运行时确定
 *    例如：审批流程（经理→总监→CEO）
 *
 * 2. 不希望显式指定请求的接收者
 *    例如：事件冒泡（按钮→面板→窗口）
 *
 * 3. 需要动态指定处理请求的对象集合
 *    例如：日志处理（debug→info→warn→error）
 *
 * 4. 有多个条件判断，每个条件对应不同的处理逻辑
 *    例如：表单验证（非空检查→格式检查→业务规则检查）
 *
 * 5. 中间件和过滤器链
 *    例如：HTTP 请求处理（认证→授权→日志→业务逻辑）
 *
 * 🌟 实际应用示例：
 * - Express.js/Koa.js 的中间件机制
 * - Java Servlet 的 Filter 链
 * - Android 的事件分发机制
 * - GUI 框架的事件处理（事件冒泡）
 * - 日志框架（Log4j、Winston）
 * - 异常处理链
 * - 审批流程系统
 *
 * ============================================================
 */

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

// 示例2：实际应用 - 日志级别处理
console.log('\n📦 示例2: 日志级别处理')

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

console.log('\n💡 更多示例请查看 examples/ 目录')
console.log('   - ApprovalChain.ts: 审批流程示例')
console.log('   - ValidationChain.ts: 表单验证链示例')
console.log('   - MiddlewareChain.ts: HTTP 中间件链示例')
console.log('   - index.ts: 运行所有示例')
