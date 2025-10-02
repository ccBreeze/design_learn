/* 抽象类 */
interface Subject {
  request(): void
}

/* 具体实现（本体接口） */
class RealSubject implements Subject {
  request(): void {
    console.log('RealSubject: Handling request.')
  }
}

/* 代理 */
class MyProxy implements Subject {
  private realSubject: RealSubject

  /**
   * 代理维护对 RealSubject 类对象的引用。
   * 它既可以懒加载，也可以由客户端传递给代理
   */
  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject
  }

  /**
   * 代理和本体接口的一致性
   * 用户可以放心地请求代理，他只关心是否能得到想要的结果。
   * 在任何使用本体的地方都可以替换成使用代理。
   */
  request(): void {
    // 可以增强各种功能
    // 延迟初始化（图片预加载）、缓存、合并http请求
    if (this.checkAccess()) {
      this.realSubject.request()
      this.logAccess()
    }
  }

  private checkAccess(): boolean {
    return true
  }
  private logAccess(): void {}
}

const realSubject = new RealSubject()
const proxy = new MyProxy(realSubject)
proxy.request()
