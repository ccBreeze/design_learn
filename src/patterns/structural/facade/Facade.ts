/**
 * 外观模式（Facade Pattern）
 *
 * 定义：为子系统中的一组接口提供了一个一致的界面。
 * 此模式定义了一个高层接口，这个接口使得子系统更容易使用。
 *
 * 场景：新手炒股容易亏钱，需要了解很多知识。基金作为外观，
 * 将投资者分散的资金集中起来，交给专业经理人管理。
 */

/** 股票1类 */
class Stock1 {
  public sell(): void {
    console.log('股票1卖出')
  }

  public buy(): void {
    console.log('股票1买入')
  }
}

/** 股票2类 */
class Stock2 {
  public sell(): void {
    console.log('股票2卖出')
  }

  public buy(): void {
    console.log('股票2买入')
  }
}

/** 股票3类 */
class Stock3 {
  public sell(): void {
    console.log('股票3卖出')
  }

  public buy(): void {
    console.log('股票3买入')
  }
}

/** 房地产类 */
class Realty1 {
  public sell(): void {
    console.log('房地产1卖出')
  }

  public buy(): void {
    console.log('房地产1买入')
  }
}

/** 国债类 */
class NationalDebt1 {
  public sell(): void {
    console.log('国债1卖出')
  }

  public buy(): void {
    console.log('国债1买入')
  }
}

/**
 * 基金类（外观类）
 *
 * 作用：
 * 1. 隐藏子系统的复杂性
 * 2. 提供统一的接口
 * 3. 降低客户端与子系统的耦合度
 */
export class Fund {
  private stock1: Stock1
  private stock2: Stock2
  private stock3: Stock3
  private nationalDebt1: NationalDebt1
  private realty1: Realty1

  constructor() {
    this.stock1 = new Stock1()
    this.stock2 = new Stock2()
    this.stock3 = new Stock3()
    this.nationalDebt1 = new NationalDebt1()
    this.realty1 = new Realty1()
  }

  /**
   * 购买基金
   * 外观方法：统一购买所有投资产品
   */
  public buyFund(): void {
    console.log('=== 开始购买基金 ===')
    this.stock1.buy()
    this.stock2.buy()
    this.stock3.buy()
    this.nationalDebt1.buy()
    this.realty1.buy()
    console.log('=== 基金购买完成 ===\n')
  }

  /**
   * 卖出基金
   * 外观方法：统一卖出所有投资产品
   */
  public sellFund(): void {
    console.log('=== 开始卖出基金 ===')
    this.stock1.sell()
    this.stock2.sell()
    this.stock3.sell()
    this.nationalDebt1.sell()
    this.realty1.sell()
    console.log('=== 基金卖出完成 ===\n')
  }

  /**
   * 查看基金组合
   */
  public getFundComposition(): string[] {
    return [
      '股票1 - 科技股',
      '股票2 - 消费股',
      '股票3 - 金融股',
      '国债1 - 10年期国债',
      '房地产1 - REITs',
    ]
  }
}

// 使用示例
console.log('外观模式示例：基金投资系统')
console.log('================================\n')

// 客户端只需要与基金（外观）交互，无需了解底层复杂的投资产品
const fund = new Fund()

// 查看基金组合
console.log('基金组合包含：')
fund.getFundComposition().forEach((item, index) => {
  console.log(`${index + 1}. ${item}`)
})
console.log()

// 购买基金
fund.buyFund()

// 卖出基金
fund.sellFund()

console.log('优势：')
console.log('1. 客户端无需了解各种投资产品的复杂操作')
console.log('2. 降低了客户端与子系统的耦合度')
console.log('3. 提供了统一、简化的接口')
