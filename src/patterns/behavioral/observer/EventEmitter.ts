export type EventListener = (...args: unknown[]) => void

class EventEmitter {
  private listeners: Record<string, EventListener[]> = {}

  on(eventName: string, listener: EventListener): this {
    ;(this.listeners[eventName] ??= []).push(listener)
    return this
  }

  once(eventName: string, listener: EventListener): this {
    const wrapper: EventListener = (...args: unknown[]) => {
      listener(...args)
      this.removeListener(eventName, wrapper)
    }
    return this.on(eventName, wrapper)
  }

  emit(eventName: string, ...args: unknown[]): void {
    const list = this.listeners[eventName]
    if (!list || list.length === 0) return
    for (const cb of [...list]) {
      cb(...args)
    }
  }

  off(eventName: string, listener: EventListener): this {
    this.removeListener(eventName, listener)
    return this
  }

  removeListener(eventName: string, listener: EventListener): void {
    const list = this.listeners[eventName]
    if (!list) return

    const index = list.findIndex(item => item === listener)
    if (index !== -1) {
      list.splice(index, 1)
      if (list.length === 0) {
        delete this.listeners[eventName]
      }
    }
  }

  removeAllListeners(eventName?: string): void {
    if (typeof eventName === 'undefined') {
      this.listeners = {}
      return
    }
    delete this.listeners[eventName]
  }
}

export default EventEmitter
