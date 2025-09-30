/**
 * 策略模式（Strategy）—支付风控与重试示例
 * 适用：仅在“算法/规则”维度（风控、重试）可替换，渠道固定。
 */

// ========== 基础请求模型 ==========
export interface PaymentRequest {
  amount: number
  currency: 'USD' | 'EUR' | 'CNY'
  userId: string
}

// ========== 固定渠道客户端（示例用：Stripe） ==========
export interface PSPClient {
  send(req: PaymentRequest): boolean
}

export class StripeClient implements PSPClient {
  send(req: PaymentRequest): boolean {
    // 为了可预测的 Demo：仅支持 USD 成功，其他币种视为失败
    return req.currency === 'USD'
  }
}

// ========== 风控策略 ==========
export interface RiskStrategy {
  allow(req: PaymentRequest): boolean
  name: string
}

export class StrictRisk implements RiskStrategy {
  name = 'StrictRisk'
  allow(req: PaymentRequest): boolean {
    // 金额超过 1000 拒绝
    return req.amount <= 1000
  }
}

export class RelaxedRisk implements RiskStrategy {
  name = 'RelaxedRisk'
  allow(req: PaymentRequest): boolean {
    // 金额超过 10000 才拒绝
    return req.amount <= 10000
  }
}

// ========== 重试策略 ==========
export interface RetryStrategy {
  /** 是否继续重试 */
  shouldRetry(attempt: number): boolean
  /** 等待时间（毫秒），Demo 不实际等待，仅记录 */
  delayMs(attempt: number): number
  name: string
}

export class ExponentialBackoff implements RetryStrategy {
  name = 'ExponentialBackoff'
  private max = 3
  shouldRetry(attempt: number): boolean {
    return attempt < this.max
  }
  delayMs(attempt: number): number {
    return Math.pow(2, attempt) * 100
  }
}

export class FixedIntervalRetry implements RetryStrategy {
  name = 'FixedIntervalRetry'
  private max = 2
  shouldRetry(attempt: number): boolean {
    return attempt < this.max
  }
  delayMs(): number {
    return 100
  }
}

// ========== 支付处理器（注入策略） ==========
export class PaymentProcessor {
  constructor(
    private client: PSPClient,
    private risk: RiskStrategy,
    private retry: RetryStrategy
  ) {}

  process(req: PaymentRequest): string {
    const logs: string[] = []
    logs.push(`Risk(${this.risk.name}) & Retry(${this.retry.name})`)

    // 风控判定
    if (!this.risk.allow(req)) {
      logs.push('risk=denied')
      return logs.join(' | ')
    }

    // 重试执行（不实际等待，仅记录）
    let attempt = 0
    let success = false
    while (true) {
      attempt++
      const ok = this.client.send(req)
      logs.push(`attempt#${attempt} -> ${ok ? 'success' : 'fail'}`)
      if (ok) {
        success = true
        break
      }
      if (!this.retry.shouldRetry(attempt)) break
      logs.push(`wait=${this.retry.delayMs(attempt)}ms`)
    }

    logs.push(`final=${success ? 'ok' : 'failed'}`)
    return logs.join(' | ')
  }
}

// ========== 最小可运行 Demo ==========
export function paymentStrategyDemo(): string {
  const client = new StripeClient()
  const req1: PaymentRequest = { amount: 500, currency: 'USD', userId: 'u1' }
  const req2: PaymentRequest = { amount: 1500, currency: 'EUR', userId: 'u2' }

  const procA = new PaymentProcessor(
    client,
    new StrictRisk(),
    new ExponentialBackoff()
  )
  const procB = new PaymentProcessor(
    client,
    new RelaxedRisk(),
    new FixedIntervalRetry()
  )

  const r1 = procA.process(req1)
  const r2 = procB.process(req2)
  return [r1, r2].join('\n')
}
