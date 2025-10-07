/**
 * 场景2: 表单验证链
 * 演示：用户注册表单验证（验证失败立即返回）
 */

import { Handler } from '../UltraMinimalChain'

interface FormData {
  username: string
  email: string
  password: string
}

type ValidationResult = { valid: boolean; error?: string }

// 最后一个验证器：所有验证通过
const allPassValidator = new Handler<FormData, ValidationResult>(() => ({
  valid: true,
}))

// 密码验证器
const passwordValidator = new Handler<FormData, ValidationResult>(data => {
  if (!data.password || data.password.length < 6) {
    return { valid: false, error: '密码至少6个字符' }
  }
  return undefined // 验证通过，继续下一个
}, allPassValidator)

// 邮箱验证器
const emailValidator = new Handler<FormData, ValidationResult>(data => {
  if (!data.email || !data.email.includes('@')) {
    return { valid: false, error: '邮箱格式不正确' }
  }
  return undefined // 验证通过，继续下一个
}, passwordValidator)

// 用户名验证器（第一个）
const usernameValidator = new Handler<FormData, ValidationResult>(data => {
  if (!data.username || data.username.length < 3) {
    return { valid: false, error: '用户名至少3个字符' }
  }
  return undefined // 验证通过，继续下一个
}, emailValidator)

export function validationChainDemo(): void {
  console.log('📋 场景2: 表单验证链\n')

  console.log(
    usernameValidator.handle({
      username: 'ab',
      email: 'test@example.com',
      password: '123456',
    })
  )
  // { valid: false, error: '用户名至少3个字符' }

  console.log(
    usernameValidator.handle({
      username: 'john',
      email: 'invalid',
      password: '123456',
    })
  )
  // { valid: false, error: '邮箱格式不正确' }

  console.log(
    usernameValidator.handle({
      username: 'john',
      email: 'john@example.com',
      password: '12345',
    })
  )
  // { valid: false, error: '密码至少6个字符' }

  console.log(
    usernameValidator.handle({
      username: 'john',
      email: 'john@example.com',
      password: '123456',
    })
  )
  // { valid: true }
}
