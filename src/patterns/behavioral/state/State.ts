class Context {
  private state: State
  constructor(state: State) {
    this.transitionTo(state)
  }

  transitionTo(state: State) {
    this.state = state
    this.state.setContext(this)
  }

  request1() {
    this.state.handle1()
  }
  request2() {
    this.state.handle2()
  }
}

abstract class State {
  protected context: Context
  setContext(context: Context) {
    this.context = context
  }

  abstract handle1()
  abstract handle2()
}

/* 具体状态 */
class ConcreteStateA extends State {
  handle1() {
    // 自动转换
    this.context.transitionTo(new ConcreteStateB())
  }
  handle2() {}
}

class ConcreteStateB extends State {
  handle1() {}
  handle2() {
    this.context.transitionTo(new ConcreteStateA())
  }
}

const context = new Context(new ConcreteStateA())
context.request1()
context.request2()
