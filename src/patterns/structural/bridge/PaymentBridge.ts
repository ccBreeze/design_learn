/**
 * 桥接模式（Bridge）—业务支付抽象 × 渠道实现
 * 适用：抽象（一次性/订阅/退款）与实现（Stripe/PayPal/ApplePay）独立演化、自由组合。
 */

// ========== 上下文与实现层（PSP） ==========
export interface PaymentContext {
  amount: number
  currency: 'USD' | 'EUR' | 'CNY'
  userId: string
}

/**
 * 渠道实现接口（PSPImplementor）
 * 作用：抽象各支付服务提供方的统一能力（Stripe/PayPal/ApplePay）。
 */
export interface PSPImplementor {
  /** 执行一次性扣款（单次支付）。返回渠道处理结果描述。 */
  charge(ctx: PaymentContext): string
  /** 执行原路或指定规则退款。返回渠道处理结果描述。 */
  refund(ctx: PaymentContext): string
  /** 创建订阅并按计划周期性扣款。返回渠道处理结果描述。 */
  subscribe(ctx: PaymentContext, planId: string): string
}

export class StripePSP implements PSPImplementor {
  charge(ctx: PaymentContext): string {
    return `Stripe charge: ${ctx.amount} ${ctx.currency} for ${ctx.userId}`
  }
  refund(ctx: PaymentContext): string {
    return `Stripe refund: ${ctx.amount} ${ctx.currency} to ${ctx.userId}`
  }
  subscribe(ctx: PaymentContext, planId: string): string {
    return `Stripe subscribe: plan=${planId} for ${ctx.userId}`
  }
}

export class PayPalPSP implements PSPImplementor {
  charge(ctx: PaymentContext): string {
    return `PayPal charge: ${ctx.amount} ${ctx.currency} for ${ctx.userId}`
  }
  refund(ctx: PaymentContext): string {
    return `PayPal refund: ${ctx.amount} ${ctx.currency} to ${ctx.userId}`
  }
  subscribe(ctx: PaymentContext, planId: string): string {
    return `PayPal subscribe: plan=${planId} for ${ctx.userId}`
  }
}

export class ApplePayPSP implements PSPImplementor {
  charge(ctx: PaymentContext): string {
    return `ApplePay charge: ${ctx.amount} ${ctx.currency} for ${ctx.userId}`
  }
  refund(ctx: PaymentContext): string {
    return `ApplePay refund: ${ctx.amount} ${ctx.currency} to ${ctx.userId}`
  }
  subscribe(ctx: PaymentContext, planId: string): string {
    return `ApplePay subscribe: plan=${planId} for ${ctx.userId}`
  }
}

// ========== 抽象层（业务支付类型） ==========
/**
 * 抽象层（Payment）
 * 作用：定义“业务支付类型”的抽象（一次性/订阅/退款等）。
 * 结构：持有渠道实现 `PSPImplementor`，在运行时组合形成桥接关系。
 * 扩展：具体支付类重写 `execute()`，按业务语义调用渠道方法。
 * 价值：让“业务抽象”与“渠道实现”各自独立演化、自由组合。
 */
export abstract class Payment {
  protected psp: PSPImplementor
  constructor(psp: PSPImplementor) {
    this.psp = psp
  }
  abstract execute(ctx: PaymentContext): string
}

export class OneTimePayment extends Payment {
  execute(ctx: PaymentContext): string {
    return this.psp.charge(ctx)
  }
}

export class SubscriptionPayment extends Payment {
  constructor(
    psp: PSPImplementor,
    private planId: string
  ) {
    super(psp)
  }
  execute(ctx: PaymentContext): string {
    return this.psp.subscribe(ctx, this.planId)
  }
}

export class RefundPayment extends Payment {
  execute(ctx: PaymentContext): string {
    return this.psp.refund(ctx)
  }
}

// ========== 最小可运行 Demo ==========
export function paymentBridgeDemo(): string {
  const ctx: PaymentContext = { amount: 299, currency: 'USD', userId: 'u42' }

  const onceStripe = new OneTimePayment(new StripePSP())
  const subPayPal = new SubscriptionPayment(new PayPalPSP(), 'pro-monthly')
  const refundApple = new RefundPayment(new ApplePayPSP())

  return [
    onceStripe.execute(ctx),
    subPayPal.execute(ctx),
    refundApple.execute(ctx),
  ].join(' | ')
}
