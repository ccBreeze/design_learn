type SharedState = [brand: string, model: string, color: string]

type UniqueState = { owner: string; plates: string }

/**
 * 共同部分状态（内在状态）
 */
class Flyweight {
  private sharedState: SharedState

  /** 接受其余状态（外在状态）参数 */
  constructor(sharedState: SharedState) {
    this.sharedState = sharedState
  }

  operation(uniqueState: UniqueState): void {
    const s = JSON.stringify(this.sharedState)
    const u = JSON.stringify(uniqueState)
    console.log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`)
  }
}

/** 享元工厂 */
class FlyweightFactory {
  private flyweights: Record<string, Flyweight> = {}

  constructor(initialFlyweights: SharedState[]) {
    for (const state of initialFlyweights) {
      this.flyweights[this.getKey(state)] = new Flyweight(state)
    }
  }

  private getKey(state: SharedState): string {
    return state.join('_')
  }

  getFlyweight(sharedState: SharedState): Flyweight {
    const key = this.getKey(sharedState)
    // 复用工厂
    if (!Object.prototype.hasOwnProperty.call(this.flyweights, key)) {
      this.flyweights[key] = new Flyweight(sharedState)
    }
    return this.flyweights[key]
  }

  listFlyweights(): void {
    for (const key of Object.keys(this.flyweights)) {
      console.log(key)
    }
  }
}

/**
 * 客户端初始化工厂
 */
const initialShared: SharedState[] = [
  ['Chevrolet', 'Camaro2018', 'pink'],
  ['Mercedes Benz', 'C300', 'black'],
  ['Mercedes Benz', 'C500', 'red'],
  ['BMW', 'M5', 'red'],
  ['BMW', 'X6', 'white'],
]

const factory = new FlyweightFactory(initialShared)
factory.listFlyweights()
