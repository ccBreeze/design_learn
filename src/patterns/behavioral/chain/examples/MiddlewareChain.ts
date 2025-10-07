/**
 * 场景3: HTTP 中间件链
 * 演示：模拟 Express.js 中间件机制
 */

import { Handler } from '../UltraMinimalChain'

interface HttpContext {
  url: string
  user?: { id: string; role: string }
  isAuthenticated?: boolean
  logs?: string[]
}

// 最终处理器：业务逻辑
const businessHandler = new Handler<HttpContext, HttpContext | string>(ctx => {
  console.log(`✅ 请求处理成功: ${ctx.url}`)
  return ctx // 返回处理后的上下文
})

// 角色验证中间件
const roleMiddleware = new Handler<HttpContext, HttpContext | string>(ctx => {
  if (ctx.url.startsWith('/admin') && ctx.user?.role !== 'admin') {
    return '403 禁止访问：需要管理员权限'
  }
  return undefined // 继续下一个中间件
}, businessHandler)

// 认证中间件
const authMiddleware = new Handler<HttpContext, HttpContext | string>(ctx => {
  // 模拟认证检查
  if (ctx.url.startsWith('/admin') && !ctx.user) {
    return '401 未授权：需要登录'
  }
  ctx.isAuthenticated = !!ctx.user
  return undefined // 继续下一个中间件
}, roleMiddleware)

// 日志中间件（第一个）
const logMiddleware = new Handler<HttpContext, HttpContext | string>(ctx => {
  ctx.logs = ctx.logs || []
  ctx.logs.push(`访问: ${ctx.url} at ${new Date().toISOString()}`)
  return undefined // 继续下一个中间件
}, authMiddleware)

export function middlewareChainDemo(): void {
  console.log('📋 场景3: HTTP 中间件链\n')

  console.log('请求1: 未登录访问管理页面')
  console.log(logMiddleware.handle({ url: '/admin/users' }))

  console.log('\n请求2: 普通用户访问管理页面')
  console.log(
    logMiddleware.handle({
      url: '/admin/users',
      user: { id: '123', role: 'user' },
    })
  )

  console.log('\n请求3: 管理员访问管理页面')
  const adminResult = logMiddleware.handle({
    url: '/admin/users',
    user: { id: '456', role: 'admin' },
  })
  console.log(adminResult)
}
