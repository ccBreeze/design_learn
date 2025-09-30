/**
 * Factory Method Pattern — Logistics example
 *
 * 对应示意图：
 * - Logistics(抽象创建者) 定义 planDelivery()，并通过 createTransport() 创建产品
 * - RoadLogistics / SeaLogistics(具体创建者) 覆写 createTransport() 决定返回 Truck / Ship
 * - Transport(抽象产品) 统一交付接口，Truck/Ship(具体产品) 去实现
 */

// 抽象产品
export interface Transport {
  deliver(): string
}

// 具体产品 A：卡车
export class Truck implements Transport {
  deliver(): string {
    return 'Truck: deliver by land in boxes.'
  }
}

// 具体产品 B：轮船
export class Ship implements Transport {
  deliver(): string {
    return 'Ship: deliver by sea in containers.'
  }
}

// 抽象创建者：定义工厂方法 + 复用的业务流程（模板方法）
export abstract class Logistics {
  // 工厂方法：由子类决定返回何种具体产品
  protected abstract createTransport(): Transport

  // 复用流程：父类中编排通用逻辑，具体产品由工厂方法提供
  public planDelivery(): string {
    const transport = this.createTransport()
    return `Logistics: planning delivery -> ${transport.deliver()}`
  }
}

// 具体创建者 A：公路物流
export class RoadLogistics extends Logistics {
  protected createTransport(): Transport {
    return new Truck()
  }
}

// 具体创建者 B：海运物流
export class SeaLogistics extends Logistics {
  protected createTransport(): Transport {
    return new Ship()
  }
}

// 可选：一个很薄的选择器，便于在应用层按条件选择具体创建者
export function createLogistics(kind: 'road' | 'sea'): Logistics {
  return kind === 'road' ? new RoadLogistics() : new SeaLogistics()
}

/**
// 使用示例（为避免构建期产生副作用，默认注释掉）：
const logisticsA = createLogistics('road');
console.log(logisticsA.planDelivery());

const logisticsB: Logistics = new SeaLogistics();
console.log(logisticsB.planDelivery());
*/
