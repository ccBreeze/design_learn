# Node.js 中间件的设计模式

## 🎯 核心设计模式

Node.js 中间件主要使用以下设计模式：

### 1. **责任链模式 (Chain of Responsibility)** - 主要模式 ⭐

中间件函数形成一条链，每个中间件可以：

- 处理请求并继续传递
- 处理请求并终止链
- 直接传递给下一个中间件

### 2. **管道模式 (Pipeline Pattern)** - 数据流视角

请求像水流一样通过管道（中间件链），每个中间件都可以：

- 转换数据
- 过滤数据
- 增强数据

### 3. **装饰器模式 (Decorator)** - 功能增强视角

每个中间件都可以为请求/响应对象添加新功能，而不修改原始对象。

## 📊 Express.js 中间件示例

### 典型的 Express 中间件结构

```typescript
// 中间件签名
type Middleware = (req: Request, res: Response, next: NextFunction) => void

// 使用示例
app.use(middleware1) // 责任链的第一个节点
app.use(middleware2) // 责任链的第二个节点
app.use(middleware3) // 责任链的第三个节点
```

### 工作流程

```
请求进入
   ↓
middleware1 → next() → middleware2 → next() → middleware3 → 路由处理器
   ↓              ↓              ↓              ↓
 可以中断       可以中断       可以中断       发送响应
```

## 🔄 责任链模式在中间件中的体现

### 特征对比

| 特征           | 责任链模式            | Express 中间件            |
| -------------- | --------------------- | ------------------------- |
| **链式传递**   | ✅ 通过 `next` 引用   | ✅ 通过 `next()` 函数     |
| **可中断**     | ✅ 不调用 next 即中断 | ✅ 不调用 `next()` 即中断 |
| **顺序执行**   | ✅ 按注册顺序         | ✅ 按 `app.use()` 顺序    |
| **独立处理器** | ✅ 每个处理器独立     | ✅ 每个中间件独立         |

## 💡 实际对比示例

### 我们的责任链实现

```typescript
const authMiddleware = new Handler<HttpContext, HttpContext | string>(ctx => {
  if (!ctx.user) {
    return '401 未授权' // 中断链
  }
  return undefined // 继续下一个
}, nextHandler)
```

### Express 中间件实现

```typescript
const authMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('未授权') // 中断链
  }
  next() // 继续下一个
}
```

## 🌟 各框架的中间件实现

### 1. Express.js - 经典责任链

```javascript
app.use(logger) // 日志
app.use(auth) // 认证
app.use(validate) // 验证
app.use(handler) // 业务处理
```

**特点**：

- 线性责任链
- 使用 `next()` 传递
- 可以中途终止

### 2. Koa.js - 洋葱模型（增强版责任链）

```javascript
app.use(async (ctx, next) => {
  console.log('1. 进入')
  await next() // 等待后续中间件执行完
  console.log('6. 返回')
})

app.use(async (ctx, next) => {
  console.log('2. 进入')
  await next()
  console.log('5. 返回')
})

app.use(async (ctx, next) => {
  console.log('3. 进入')
  // 业务逻辑
  console.log('4. 处理')
})
```

**执行顺序**：1 → 2 → 3 → 4 → 5 → 6

**特点**：

- 双向责任链（洋葱模型）
- 支持异步/等待
- 可以在 `next()` 前后执行代码

### 3. NestJS - 装饰器 + 责任链

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...')
    next()
  }
}

// 应用中间件
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
```

**特点**：

- 使用装饰器增强
- 仍然是责任链核心
- 更面向对象

## 🔍 深度解析：为什么是责任链模式？

### 符合责任链模式的所有特征

#### ✅ 1. 解耦发送者和接收者

```javascript
// 请求发送者不需要知道哪个中间件会处理
app.get('/api/users', ...middlewares, controller)
```

#### ✅ 2. 动态组合处理器

```javascript
// 可以自由组合中间件
app.use(cors())
app.use(helmet())
app.use(bodyParser())
```

#### ✅ 3. 链式传递

```javascript
middleware1 → middleware2 → middleware3 → handler
```

#### ✅ 4. 可中断性

```javascript
const authMiddleware = (req, res, next) => {
  if (!authorized) {
    res.status(403).send('Forbidden')
    // 不调用 next()，链中断
    return
  }
  next() // 继续链
}
```

## 📝 与其他模式的区别

### vs 装饰器模式

| 装饰器模式               | 中间件（责任链）         |
| ------------------------ | ------------------------ |
| 主要用于**增强对象功能** | 主要用于**请求处理流程** |
| 包装对象                 | 处理请求                 |
| 每层都会执行             | 可以中途终止             |

### vs 管道模式

| 管道模式             | 中间件（责任链） |
| -------------------- | ---------------- |
| 强调**数据转换**     | 强调**责任传递** |
| 数据一定流过所有阶段 | 可以中途终止     |
| 输入→转换→输出       | 请求→处理→下一个 |

## 💻 实现一个简化的 Express 中间件系统

```typescript
type Middleware = (req: any, res: any, next: () => void) => void

class SimpleExpress {
  private middlewares: Middleware[] = []

  use(middleware: Middleware) {
    this.middlewares.push(middleware)
    return this
  }

  handle(req: any, res: any) {
    let index = 0

    const next = () => {
      if (index >= this.middlewares.length) return

      const middleware = this.middlewares[index++]
      middleware(req, res, next)
    }

    next() // 启动责任链
  }
}

// 使用
const app = new SimpleExpress()

app.use((req, res, next) => {
  console.log('Logger:', req.url)
  next()
})

app.use((req, res, next) => {
  if (!req.user) {
    res.status = 401
    res.body = 'Unauthorized'
    return // 中断链
  }
  next()
})

app.use((req, res, next) => {
  res.body = 'Success'
})

app.handle({ url: '/api' }, {})
```

## 🎓 总结

### Node.js 中间件 = 责任链模式的完美实践

1. **核心是责任链模式**：
   - 链式调用
   - 职责传递
   - 可中断性

2. **融合了管道模式思想**：
   - 数据流动
   - 逐步处理

3. **体现了装饰器模式**：
   - 功能增强
   - 不修改原对象

4. **实际应用场景**：
   - ✅ 认证授权
   - ✅ 日志记录
   - ✅ 错误处理
   - ✅ 数据验证
   - ✅ 缓存控制
   - ✅ 压缩响应
   - ✅ CORS 处理

### 为什么这么设计？

- **灵活性**：可以自由组合中间件
- **可维护性**：每个中间件职责单一
- **可扩展性**：容易添加新功能
- **可复用性**：中间件可以在不同路由复用
- **关注点分离**：业务逻辑与基础设施分离

## 📚 相关资源

- [Express 官方文档 - 中间件](https://expressjs.com/en/guide/using-middleware.html)
- [Koa 洋葱模型](https://koajs.com/#application)
- [责任链模式详解](./README.md)
- [中间件实现示例](./examples/MiddlewareChain.ts)
