// 1. 组件接口 (MenuItem)
interface MenuItem {
  getPrice(): number
  getName(): string
}

// 2. 叶子节点 (IndividualItem)
class IndividualItem implements MenuItem {
  constructor(
    private name: string,
    private price: number
  ) {}

  public getName(): string {
    return this.name
  }

  public getPrice(): number {
    console.log(`计算单品「${this.name}」的价格: ${this.price}元`)
    return this.price
  }
}

// 3. 组合节点 (ComboMeal)
class ComboMeal implements MenuItem {
  private children: MenuItem[] = []

  constructor(
    private name: string,
    private discount: number = 0
  ) {}

  public add(item: MenuItem): void {
    this.children.push(item)
  }

  public getName(): string {
    return this.name
  }

  public getPrice(): number {
    console.log(`--- 开始计算套餐「${this.name}」的总价 ---`)
    const total = this.children.reduce(
      (sum, child) => sum + child.getPrice(),
      0
    )
    const finalPrice = total - this.discount
    console.log(`--- 套餐「${this.name}」计算完毕，折后价: ${finalPrice}元 ---`)
    return finalPrice
  }
}

// 客户端代码
function order() {
  // 创建单品
  const burger = new IndividualItem('香辣鸡腿堡', 18)
  const fries = new IndividualItem('中薯条', 12.5)
  const coke = new IndividualItem('中杯可乐', 9)

  // 创建一个简单的套餐
  const burgerCombo = new ComboMeal('汉堡套餐', 2.5) // 套餐优惠2.5元
  burgerCombo.add(burger)
  burgerCombo.add(fries)
  burgerCombo.add(coke)

  // 计算套餐价格
  console.log(`\n顾客A点了一份「${burgerCombo.getName()}」`)
  const priceA = burgerCombo.getPrice()
  console.log(`顾客A应付: ${priceA}元`)

  console.log('\n=========================\n')

  // 创建一个更复杂的“全家桶”
  const familyBucket = new ComboMeal('豪华全家桶', 10) // 全家桶优惠10元
  familyBucket.add(new IndividualItem('原味鸡', 12))
  familyBucket.add(new IndividualItem('原味鸡', 12))
  familyBucket.add(new IndividualItem('香辣鸡翅', 11))
  familyBucket.add(new IndividualItem('香辣鸡翅', 11))
  // 套餐里可以包含另一个套餐！
  familyBucket.add(burgerCombo)

  console.log(`顾客B点了一份「${familyBucket.getName()}」`)
  const priceB = familyBucket.getPrice()
  console.log(`顾客B应付: ${priceB}元`)
}

order()
