/**
 * 简化版 Express 中间件系统
 * 演示责任链模式在 Node.js 中间件中的应用
 */

// ============ 类型定义 ============

interface Request {
  url: string
  method: string
  headers: Record<string, string>
  body?: any
  user?: { id: string; name: string }
  [key: string]: any
}

interface Response {
  statusCode: number
  headers: Record<string, string>
  body?: any
  status(code: number): Response
  send(data: any): void
  json(data: any): void
}

type NextFunction = () => void

type Middleware = (req: Request, res: Response, next: NextFunction) => void

// ============ 简化版 Express 实现 ============

class SimpleExpress {
  private middlewares: Middleware[] = []

  /**
   * 注册中间件（构建责任链）
   */
  use(middleware: Middleware): this {
    this.middlewares.push(middleware)
    return this
  }

  /**
   * 处理请求（执行责任链）
   */
  handle(req: Request, res: Response): void {
    let index = 0

    // next 函数：责任链的核心
    const next: NextFunction = () => {
      // 如果已经到链的末端，停止
      if (index >= this.middlewares.length) return

      // 取出当前中间件并移动索引
      const middleware = this.middlewares[index++]

      try {
        // 执行中间件，传入 next 以便继续链
        middleware(req, res, next)
      } catch (error) {
        console.error('中间件执行错误:', error)
      }
    }

    // 启动责任链
    next()
  }
}

// ============ 辅助函数 ============

function createRequest(
  url: string,
  method = 'GET',
  options: Partial<Request> = {}
): Request {
  return {
    url,
    method,
    headers: {},
    ...options,
  }
}

function createResponse(): Response {
  const res: Response = {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code: number) {
      this.statusCode = code
      return this
    },
    send(data: any) {
      this.body = data
      console.log(`📤 响应 [${this.statusCode}]:`, data)
    },
    json(data: any) {
      this.headers['Content-Type'] = 'application/json'
      this.send(JSON.stringify(data, null, 2))
    },
  }
  return res
}

// ============ 中间件示例 ============

// 1. 日志中间件
const loggerMiddleware: Middleware = (req, res, next) => {
  console.log(`\n📝 [Logger] ${req.method} ${req.url}`)
  console.log(`📝 [Logger] 时间: ${new Date().toISOString()}`)
  next() // 继续责任链
}

// 2. 认证中间件
const authMiddleware: Middleware = (req, res, next) => {
  console.log('🔐 [Auth] 检查认证...')

  const token = req.headers['authorization']

  if (!token) {
    console.log('❌ [Auth] 未提供 token')
    res.status(401).send({ error: 'Unauthorized: No token provided' })
    // 不调用 next()，中断责任链
    return
  }

  // 模拟验证成功，添加用户信息
  req.user = { id: '123', name: 'John Doe' }
  console.log('✅ [Auth] 认证成功:', req.user.name)
  next() // 继续责任链
}

// 3. 权限检查中间件
const roleMiddleware: Middleware = (req, res, next) => {
  console.log('👮 [Role] 检查权限...')

  if (req.url.startsWith('/admin') && req.user?.name !== 'Admin') {
    console.log('❌ [Role] 权限不足')
    res.status(403).send({ error: 'Forbidden: Insufficient permissions' })
    // 不调用 next()，中断责任链
    return
  }

  console.log('✅ [Role] 权限检查通过')
  next() // 继续责任链
}

// 4. 数据验证中间件
const validateBodyMiddleware: Middleware = (req, res, next) => {
  console.log('✔️  [Validate] 验证请求体...')

  if (req.method === 'POST' && !req.body) {
    console.log('❌ [Validate] 缺少请求体')
    res.status(400).send({ error: 'Bad Request: Missing body' })
    return
  }

  console.log('✅ [Validate] 验证通过')
  next()
}

// 5. 业务处理中间件
const userHandlerMiddleware: Middleware = (req, res) => {
  console.log('🎯 [Handler] 处理业务逻辑...')

  res.status(200).json({
    message: '请求处理成功',
    user: req.user,
    timestamp: new Date().toISOString(),
  })
  // 业务处理完成，不需要调用 next
}

// ============ 使用示例 ============

export function simpleExpressDemo(): void {
  console.log('🚀 简化版 Express 中间件系统演示')
  console.log('='.repeat(70))

  const app = new SimpleExpress()

  // 构建中间件责任链
  app
    .use(loggerMiddleware) // 1. 日志
    .use(authMiddleware) // 2. 认证
    .use(roleMiddleware) // 3. 权限
    .use(validateBodyMiddleware) // 4. 验证
    .use(userHandlerMiddleware) // 5. 业务处理

  // ========== 测试场景 ==========

  console.log('\n' + '='.repeat(70))
  console.log('📋 场景1: 正常请求（所有中间件都通过）')
  console.log('='.repeat(70))

  app.handle(
    createRequest('/api/users', 'GET', {
      headers: { authorization: 'Bearer token123' },
    }),
    createResponse()
  )

  console.log('\n' + '='.repeat(70))
  console.log('📋 场景2: 未认证请求（在认证中间件被拦截）')
  console.log('='.repeat(70))

  app.handle(
    createRequest('/api/users', 'GET', {
      headers: {}, // 没有 authorization
    }),
    createResponse()
  )

  console.log('\n' + '='.repeat(70))
  console.log('📋 场景3: 权限不足（在权限中间件被拦截）')
  console.log('='.repeat(70))

  const app2 = new SimpleExpress()
  app2
    .use(loggerMiddleware)
    .use(authMiddleware)
    .use(roleMiddleware)
    .use(userHandlerMiddleware)

  app2.handle(
    createRequest('/admin/settings', 'GET', {
      headers: { authorization: 'Bearer token123' },
    }),
    createResponse()
  )

  console.log('\n' + '='.repeat(70))
  console.log('📋 场景4: 缺少请求体（在验证中间件被拦截）')
  console.log('='.repeat(70))

  app.handle(
    createRequest('/api/users', 'POST', {
      headers: { authorization: 'Bearer token123' },
      // body 未提供
    }),
    createResponse()
  )

  console.log('\n' + '='.repeat(70))
  console.log('✨ 演示完成！')
  console.log('\n💡 关键点:')
  console.log(
    '  1. 中间件形成责任链：logger → auth → role → validate → handler'
  )
  console.log('  2. 每个中间件可以通过不调用 next() 来中断链')
  console.log('  3. 这就是 Express/Koa 等框架的核心设计模式！')
  console.log('='.repeat(70))
}

// 如果直接运行此文件，执行演示
simpleExpressDemo()
