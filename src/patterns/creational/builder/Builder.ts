/**
 * 生成器模式（Builder Pattern）
 *
 * 适用场景：当产品较为复杂且需要按步骤进行详细配置时，
 * 通过生成器将构建步骤与具体产品解耦，支持创建不同但相关的产品。
 */

// ========== 基础部件与产品 ==========

/** 引擎接口（用于演示不同引擎类型） */
export interface Engine {
  name: string
}

/** 运动型引擎 */
export class SportEngine implements Engine {
  name = 'SportEngine'
}

/** SUV 引擎 */
export class SuvEngine implements Engine {
  name = 'SUVEngine'
}

/** 汽车产品：可能配备 GPS、行车电脑和多个座位 */
export class Car {
  seats: number = 0
  engine?: Engine
  tripComputer: boolean = false
  gps: boolean = false

  describe(): string {
    const engine = this.engine?.name ?? 'none'
    return `Car(seats=${this.seats}, engine=${engine}, tripComputer=${this.tripComputer}, gps=${this.gps})`
  }
}

/** 使用手册：根据汽车配置编制文档 */
export class Manual {
  private sections: string[] = []

  addSection(text: string): void {
    this.sections.push(text)
  }

  getContent(): string {
    return this.sections.join('\n')
  }
}

// ========== 生成器接口 ==========

/**
 * 生成器接口：声明创建产品对象不同部件的方法。
 * 注意：生成器可以创建不遵循相同接口的不同产品（如 Car 与 Manual）。
 */
export interface Builder {
  reset(): void
  setSeats(count: number): void
  setEngine(engine: Engine): void
  setTripComputer(enabled: boolean): void
  setGPS(enabled: boolean): void
}

// ========== 具体生成器：CarBuilder ==========

export class CarBuilder implements Builder {
  private car!: Car

  constructor() {
    this.reset()
  }

  /** 清空正在生成的对象 */
  reset(): void {
    this.car = new Car()
  }

  /** 与同一个产品实例交互，设置各部件 */
  setSeats(count: number): void {
    this.car.seats = count
  }

  setEngine(engine: Engine): void {
    this.car.engine = engine
  }

  setTripComputer(enabled: boolean): void {
    this.car.tripComputer = enabled
  }

  setGPS(enabled: boolean): void {
    this.car.gps = enabled
  }

  /** 获取最终产品，并重置以准备下一次构建 */
  getProduct(): Car {
    const product = this.car
    this.reset()
    return product
  }
}

// ========== 具体生成器：CarManualBuilder ==========

export class CarManualBuilder implements Builder {
  private manual!: Manual

  constructor() {
    this.reset()
  }

  reset(): void {
    this.manual = new Manual()
  }

  setSeats(count: number): void {
    this.manual.addSection(`座椅：${count} 个座位，支持调节与加热（视型号）`)
  }

  setEngine(engine: Engine): void {
    this.manual.addSection(`引擎：${engine.name}，请按说明进行维护`)
  }

  setTripComputer(enabled: boolean): void {
    this.manual.addSection(
      `行车电脑：${enabled ? '已安装，可显示油耗/里程等' : '未安装'}`
    )
  }

  setGPS(enabled: boolean): void {
    this.manual.addSection(`GPS：${enabled ? '已安装，支持导航' : '未安装'}`)
  }

  getProduct(): Manual {
    const product = this.manual
    this.reset()
    return product
  }
}

// ========== 主管（Director） ==========

/**
 * 主管只负责按照特定顺序执行生成步骤。
 * 客户端可通过传入不同的生成器来得到不同的产品类型。
 */
export class Director {
  constructSportsCar(builder: Builder): void {
    builder.reset()
    builder.setSeats(2)
    builder.setEngine(new SportEngine())
    builder.setTripComputer(true)
    builder.setGPS(true)
  }

  constructSUV(builder: Builder): void {
    builder.reset()
    builder.setSeats(5)
    builder.setEngine(new SuvEngine())
    builder.setTripComputer(true)
    builder.setGPS(true)
  }
}

// ========== 使用示例（最小可运行 Demo） ==========

export function builderDemo(): string {
  const director = new Director()

  const carBuilder = new CarBuilder()
  director.constructSportsCar(carBuilder)
  const car = carBuilder.getProduct()

  const manualBuilder = new CarManualBuilder()
  director.constructSportsCar(manualBuilder)
  const manual = manualBuilder.getProduct()

  return `${car.describe()}\n---\n${manual.getContent()}`
}
