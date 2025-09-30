import { Singleton } from './Singleton'

// 提供一个最小可运行的 demo 函数
export function singletonDemo(): string {
  const a = Singleton.getInstance()
  const b = Singleton.getInstance()

  a.set('message', 'singleton works')
  const same = a === b
  const msg = b.get<string>('message')

  return `sameInstance=${same} | message=${msg}`
}