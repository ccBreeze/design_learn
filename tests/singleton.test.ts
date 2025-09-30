import { describe, it, expect } from 'vitest'
import { Singleton, singletonDemo } from '../src'

describe('Singleton pattern', () => {
  it('should return the same instance', () => {
    const a = Singleton.getInstance()
    const b = Singleton.getInstance()
    expect(a).toBe(b)
  })

  it('should share state across instances', () => {
    const a = Singleton.getInstance()
    a.set('key', 'value')
    const b = Singleton.getInstance()
    expect(b.get('key')).toBe('value')
  })

  it('demo output should reflect singleton behavior', () => {
    const output = singletonDemo()
    expect(output).toContain('sameInstance=true')
    expect(output).toContain('message=singleton works')
  })
})
