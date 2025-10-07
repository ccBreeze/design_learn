/**
 * 责任链模式 - 所有示例的入口文件
 * 可以一次运行所有场景演示
 */

import { approvalChainDemo } from './ApprovalChain'
import { validationChainDemo } from './ValidationChain'
import { middlewareChainDemo } from './MiddlewareChain'

export function runAllChainExamples(): void {
  console.log('🎯 责任链模式 - 完整示例演示\n')
  console.log('='.repeat(60))

  approvalChainDemo()
  console.log('\n' + '='.repeat(60) + '\n')

  validationChainDemo()
  console.log('\n' + '='.repeat(60) + '\n')

  middlewareChainDemo()

  console.log('\n' + '='.repeat(60))
  console.log('\n✨ 责任链模式演示完成！')
  console.log('\n💡 想了解 Node.js 中间件的设计模式？')
  console.log(
    '   运行: npx tsx src/patterns/behavioral/chain/examples/SimpleExpressMiddleware.ts'
  )
}

export { approvalChainDemo, validationChainDemo, middlewareChainDemo }

// 直接运行所有示例
runAllChainExamples()
