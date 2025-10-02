interface ISubject {
  /** 添加观察者 */
  attach(observer: IObserver): void

  /** 移除观察者 */
  detach(observer: IObserver): void

  /** 通知观察者 */
  notify(): void
}

class ConcreteSubject implements ISubject {
  state: number = 0

  /**
   * 订阅者名单
   * 「发布订阅者模式」可以存储得更全面（按事件、类型等）
   */
  private observers = new Set<IObserver>()

  attach(observer: IObserver) {
    this.observers.add(observer)
  }

  detach(observer: IObserver) {
    this.observers.delete(observer)
  }

  notify() {
    for (const observer of this.observers) {
      observer.update(this)
    }
  }

  someBusinessLogic(): void {
    console.log("\nSubject: I'm doing something important.")
    this.state = Math.floor(Math.random() * (10 + 1))

    console.log(`Subject: My state has just changed to: ${this.state}`)
    this.notify()
  }
}

interface IObserver {
  update(subject: ISubject): void
}

class ConcreteObserverA implements IObserver {
  public update(subject: ISubject): void {
    if (subject instanceof ConcreteSubject && subject.state < 3) {
      console.log('ConcreteObserverA: Reacted to the event.')
    }
  }
}
class ConcreteObserverB implements IObserver {
  public update(subject: ISubject): void {
    if (
      subject instanceof ConcreteSubject &&
      (subject.state === 0 || subject.state >= 2)
    ) {
      console.log('ConcreteObserverB: Reacted to the event.')
    }
  }
}

/**
 * The client code.
 */

const subject = new ConcreteSubject()

const observer1 = new ConcreteObserverA()
subject.attach(observer1)

const observer2 = new ConcreteObserverB()
subject.attach(observer2)

subject.someBusinessLogic()
subject.someBusinessLogic()

subject.detach(observer2)

subject.someBusinessLogic()
