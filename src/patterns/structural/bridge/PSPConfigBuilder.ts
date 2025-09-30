/**
 * 组合示例：用生成器（Builder）封装渠道配置，再与桥接（Payment × PSPImplementor）结合
 * 目的：将「复杂实现配置的装配」与「业务抽象 × 渠道实现的组合」解耦。
 */

import {
  PaymentContext,
  PSPImplementor,
  StripePSP,
  PayPalPSP,
  ApplePayPSP,
  OneTimePayment,
  SubscriptionPayment,
} from './PaymentBridge'

// ========== 配置模型 ==========

export type Environment = 'sandbox' | 'live'
export type RiskLevel = 'strict' | 'relaxed'

export interface PSPConfig {
  environment: Environment
  apiKey?: string
  riskLevel: RiskLevel
  retryAttempts: number
  backoffMs: number
  label?: string
}

// ========== 配置包装：在不改动原有 PSP 实现的情况下附加配置语义 ==========

export class ConfiguredPSP implements PSPImplementor {
  constructor(
    private base: PSPImplementor,
    private config: PSPConfig
  ) {}

  private describe(): string {
    const key = this.config.apiKey
      ? `${this.config.apiKey.slice(0, 6)}…`
      : 'none'
    return `env=${this.config.environment}, risk=${this.config.riskLevel}, retry=${this.config.retryAttempts}x/${this.config.backoffMs}ms, key=${key}${this.config.label ? `, label=${this.config.label}` : ''}`
  }

  charge(ctx: PaymentContext): string {
    return `${this.base.charge(ctx)} [${this.describe()}]`
  }
  refund(ctx: PaymentContext): string {
    return `${this.base.refund(ctx)} [${this.describe()}]`
  }
  subscribe(ctx: PaymentContext, planId: string): string {
    return `${this.base.subscribe(ctx, planId)} [${this.describe()}]`
  }
}

// ========== 生成器接口与具体生成器 ==========

export interface PSPConfigBuilder {
  /** 清空当前构建状态，准备开始新的配置装配。 */
  reset(): void
  /** 设置运行环境（sandbox / live），影响密钥与风控策略等。 */
  setEnvironment(env: Environment): void
  /** 配置渠道密钥（API Key），用于调用鉴权。 */
  setApiKey(key: string): void
  /** 设置风控强度（strict / relaxed），用于风险策略选择。 */
  setRiskLevel(level: RiskLevel): void
  /** 设置重试策略：次数与退避时间（毫秒）。 */
  setRetry(attempts: number, backoffMs: number): void
  /** 可选标签，便于在日志或监控中识别该配置。 */
  setLabel(label: string): void
  /** 选择基础渠道实现类型（Stripe / PayPal / ApplePay）。 */
  setBaseImplementor(base: 'stripe' | 'paypal' | 'apple'): void
  /** 获取最终实现对象（PSPImplementor），包含前述配置包装。 */
  getProduct(): PSPImplementor
}

export class DefaultPSPConfigBuilder implements PSPConfigBuilder {
  private base!: PSPImplementor
  private config!: PSPConfig

  constructor() {
    this.reset()
  }

  reset(): void {
    this.base = new StripePSP()
    this.config = {
      environment: 'sandbox',
      apiKey: undefined,
      riskLevel: 'relaxed',
      retryAttempts: 0,
      backoffMs: 0,
      label: undefined,
    }
  }

  setEnvironment(env: Environment): void {
    this.config.environment = env
  }
  setApiKey(key: string): void {
    this.config.apiKey = key
  }
  setRiskLevel(level: RiskLevel): void {
    this.config.riskLevel = level
  }
  setRetry(attempts: number, backoffMs: number): void {
    this.config.retryAttempts = attempts
    this.config.backoffMs = backoffMs
  }
  setLabel(label: string): void {
    this.config.label = label
  }
  setBaseImplementor(base: 'stripe' | 'paypal' | 'apple'): void {
    switch (base) {
      case 'stripe':
        this.base = new StripePSP()
        break
      case 'paypal':
        this.base = new PayPalPSP()
        break
      case 'apple':
        this.base = new ApplePayPSP()
        break
      default:
        this.base = new StripePSP()
    }
  }

  getProduct(): PSPImplementor {
    // 返回带配置的实现，供桥接抽象（Payment）自由组合
    const cfgCopy: PSPConfig = { ...this.config }
    return new ConfiguredPSP(this.base, cfgCopy)
  }
}

// ========== 主管（Director）：编排常用配置组合 ==========

export class PSPDirector {
  buildLiveStrictStripe(builder: PSPConfigBuilder): void {
    builder.reset()
    builder.setBaseImplementor('stripe')
    builder.setEnvironment('live')
    builder.setRiskLevel('strict')
    builder.setRetry(3, 250)
    builder.setApiKey('live_stripe_1234567890')
    builder.setLabel('stripe-live-strict')
  }

  buildSandboxRelaxedPayPal(builder: PSPConfigBuilder): void {
    builder.reset()
    builder.setBaseImplementor('paypal')
    builder.setEnvironment('sandbox')
    builder.setRiskLevel('relaxed')
    builder.setRetry(1, 100)
    builder.setApiKey('sandbox_paypal_abcdef')
    builder.setLabel('paypal-sbx-relaxed')
  }

  buildLiveAppleWithRetry(builder: PSPConfigBuilder): void {
    builder.reset()
    builder.setBaseImplementor('apple')
    builder.setEnvironment('live')
    builder.setRiskLevel('relaxed')
    builder.setRetry(5, 300)
    builder.setApiKey('live_apple_xyz')
    builder.setLabel('apple-live-retry')
  }
}

// ========== 组合演示：Builder × Bridge ==========

export function pspConfigBuilderBridgeDemo(): string {
  const director = new PSPDirector()

  const b1 = new DefaultPSPConfigBuilder()
  director.buildLiveStrictStripe(b1)
  const stripePSP = b1.getProduct()
  const onceStripe = new OneTimePayment(stripePSP)

  const b2 = new DefaultPSPConfigBuilder()
  director.buildSandboxRelaxedPayPal(b2)
  const paypalPSP = b2.getProduct()
  const subPayPal = new SubscriptionPayment(paypalPSP, 'starter')

  const ctx: PaymentContext = { amount: 99, currency: 'USD', userId: 'u100' }

  return [onceStripe.execute(ctx), subPayPal.execute(ctx)].join(' | ')
}
