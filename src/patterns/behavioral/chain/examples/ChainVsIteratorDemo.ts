/**
 * 责任链模式 vs 迭代器模式 - 对比演示
 * 直观展示两者的区别
 */

console.log('🎯 责任链模式 vs 迭代器模式 - 对比演示\n')
console.log('='.repeat(70))

// ============================================================
// 1️⃣ 责任链模式：寻找处理者
// ============================================================

console.log('\n【责任链模式】目标：找到能处理请求的处理器\n')

class Handler<TRequest = unknown, TResponse = unknown> {
  constructor(
    private name: string,
    private process: (req: TRequest) => TResponse | undefined,
    private next?: Handler<TRequest, TResponse>
  ) {}

  handle(req: TRequest): TResponse | undefined {
    console.log(`  → 尝试: ${this.name}`)
    const result = this.process(req)

    if (result !== undefined) {
      console.log(`  ✅ ${this.name} 处理成功！`)
      return result // 找到处理器，停止
    }

    console.log(`  ❌ ${this.name} 无法处理，传递给下一个`)
    return this.next?.handle(req) // 继续传递
  }
}

// 创建责任链
const numberHandler = new Handler<unknown, string>('数字处理器', x =>
  typeof x === 'number' ? `处理了数字: ${x * 2}` : undefined
)

const stringHandler = new Handler<unknown, string>(
  '字符串处理器',
  x => (typeof x === 'string' ? `处理了字符串: ${x.toUpperCase()}` : undefined),
  numberHandler
)

const booleanHandler = new Handler<unknown, string>(
  '布尔处理器',
  x => (typeof x === 'boolean' ? `处理了布尔: ${!x}` : undefined),
  stringHandler
)

console.log('测试1: 处理字符串 "hello"')
console.log(booleanHandler.handle('hello'))
console.log('\n' + '-'.repeat(70) + '\n')

console.log('测试2: 处理数字 42')
console.log(booleanHandler.handle(42))
console.log('\n' + '-'.repeat(70) + '\n')

console.log('测试3: 处理布尔值 true')
console.log(booleanHandler.handle(true))
console.log('\n' + '-'.repeat(70) + '\n')

console.log('测试4: 处理数组 [] (无处理器)')
console.log(booleanHandler.handle([]))

console.log('\n' + '='.repeat(70))

// ============================================================
// 2️⃣ 迭代器模式：遍历所有元素
// ============================================================

console.log('\n【迭代器模式】目标：访问所有元素\n')

class ArrayIterator<T> {
  private index = 0

  constructor(private items: T[]) {}

  hasNext(): boolean {
    return this.index < this.items.length
  }

  next(): T | undefined {
    if (!this.hasNext()) return undefined
    const item = this.items[this.index]
    console.log(`  → 访问元素 ${this.index + 1}: ${item}`)
    this.index++
    return item
  }

  reset(): void {
    this.index = 0
  }
}

const items = ['苹果', '香蕉', '橙子', '葡萄', '西瓜']
const iterator = new ArrayIterator(items)

console.log(`遍历数组: [${items.join(', ')}]\n`)

let count = 0
while (iterator.hasNext()) {
  iterator.next()
  count++
}

console.log(`\n✅ 访问了所有 ${count} 个元素`)

console.log('\n' + '='.repeat(70))

// ============================================================
// 3️⃣ 对比：同样的数据，不同的处理方式
// ============================================================

console.log('\n【对比演示】同样的数据，不同的处理方式\n')

const numbers = [10, 20, 30, 40, 50]

// 方式1: 责任链 - 寻找符合条件的数字
console.log('方式1: 责任链模式 - 找到第一个大于25的数字\n')

const condition1 = new Handler<number, string>('检查 > 25', x =>
  x > 25 ? `找到了: ${x}` : undefined
)

for (const num of numbers) {
  console.log(`尝试: ${num}`)
  const result = condition1.handle(num)
  if (result) {
    console.log(result)
    console.log('✋ 找到后停止\n')
    break // 找到就停止
  }
}

console.log('-'.repeat(70) + '\n')

// 方式2: 迭代器 - 访问所有数字
console.log('方式2: 迭代器模式 - 访问所有数字并处理\n')

const numIterator = new ArrayIterator(numbers)
const results: number[] = []

while (numIterator.hasNext()) {
  const num = numIterator.next()!
  results.push(num * 2)
}

console.log(`\n✅ 处理了所有 ${results.length} 个元素`)
console.log(`结果: [${results.join(', ')}]`)

console.log('\n' + '='.repeat(70))

// ============================================================
// 4️⃣ 实际场景对比
// ============================================================

console.log('\n【实际场景】审批流程 vs 员工名单\n')

// 场景1: 责任链 - 审批流程（找到能批准的人就停止）
console.log('场景1: 审批流程（责任链）- 请假3天\n')

interface LeaveRequest {
  days: number
  name: string
}

const ceo = new Handler<LeaveRequest, string>('CEO', req =>
  req.days <= 10 ? `CEO批准了${req.name}的${req.days}天假期` : undefined
)

const manager = new Handler<LeaveRequest, string>(
  '经理',
  req =>
    req.days <= 3 ? `经理批准了${req.name}的${req.days}天假期` : undefined,
  ceo
)

const teamLeader = new Handler<LeaveRequest, string>(
  '组长',
  req =>
    req.days <= 1 ? `组长批准了${req.name}的${req.days}天假期` : undefined,
  manager
)

const result = teamLeader.handle({ days: 3, name: '张三' })
console.log(`\n结果: ${result}`)
console.log('💡 找到能批准的人就停止，不需要继续往上传递\n')

console.log('-'.repeat(70) + '\n')

// 场景2: 迭代器 - 员工名单（需要遍历所有人）
console.log('场景2: 员工点名（迭代器）\n')

const employees = ['张三', '李四', '王五', '赵六', '钱七']
const empIterator = new ArrayIterator(employees)

console.log('开始点名:\n')
let presentCount = 0

while (empIterator.hasNext()) {
  empIterator.next() // 访问每个员工
  presentCount++
}

console.log(`\n✅ 点名完成，共 ${presentCount} 人`)
console.log('💡 必须遍历所有人，不能跳过\n')

console.log('='.repeat(70))

// ============================================================
// 5️⃣ 核心区别总结
// ============================================================

console.log('\n🎯 核心区别总结\n')

console.log('责任链模式：')
console.log('  • 目标：找到能处理请求的处理器')
console.log('  • 特点：找到后通常停止')
console.log('  • 问题：谁来处理？')
console.log('  • 比喻：接力赛（传递到终点就停）')
console.log('  • 例子：中间件、审批流程、异常处理\n')

console.log('迭代器模式：')
console.log('  • 目标：访问集合中的所有元素')
console.log('  • 特点：遍历所有元素')
console.log('  • 问题：如何访问？')
console.log('  • 比喻：点名（必须叫到每个人）')
console.log('  • 例子：for...of、数组遍历、树遍历\n')

console.log('='.repeat(70))

console.log('\n💡 记住：')
console.log('  • 责任链 = "谁能处理？" → 寻找合适的处理者')
console.log('  • 迭代器 = "如何遍历？" → 访问所有元素\n')

console.log('✨ 演示完成！\n')

export {}
