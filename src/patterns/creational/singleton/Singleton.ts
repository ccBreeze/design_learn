export class Singleton {
  // 1.在类中添加一个私有静态成员变量用于保存单例实例
  private static instance: Singleton
  // 2.将类的构造函数设为私有
  // 防止外部 new
  private constructor() {}
  // 3.声明一个公有静态构建方法用于获取单例实例
  static getInstance(): Singleton {
    // 延迟初始化：在实际有需要时再创建该对象
    // 首次被调用时创建一个新对象, 并将其存储在静态成员变量中
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    // 此后该方法每次被调用时都返回该实例
    return Singleton.instance
  }

  // 用于演示状态共享
  private state: Record<string, unknown> = {}
  // 简单的状态读写方法，用于验证单例状态共享
  set(key: string, value: unknown): void {
    this.state[key] = value
  }
  get<T = unknown>(key: string): T | undefined {
    return this.state[key] as T | undefined
  }
}

// 目录导出：同时导出 demo
export * from './demo'
