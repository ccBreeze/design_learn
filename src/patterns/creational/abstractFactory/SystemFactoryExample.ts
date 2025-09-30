/**
 * 抽象工厂替代外观模式 - 精简示例
 * 目标：仅隐藏“创建过程”，客户端只关心“使用”
 */

// 子系统组件（最小实现）
class DatabaseConnection {
  private host = 'localhost'
  private pool = 10
  private ssl = false

  setHost(host: string): void {
    this.host = host
  }
  setPool(size: number): void {
    this.pool = size
  }
  enableSSL(): void {
    this.ssl = true
  }
  connect(): void {
    console.log(`连接数据库: ${this.host}, pool=${this.pool}, ssl=${this.ssl}`)
  }
}

class CacheManager {
  initialize(): void {
    console.log('缓存初始化')
  }
}

class Logger {
  setup(): void {
    console.log('日志系统就绪')
  }
}

// 抽象工厂接口（核心）
interface SystemFactory {
  createDatabase(): DatabaseConnection
  createCache(): CacheManager
  createLogger(): Logger
}

// 生产环境工厂（隐藏生产环境创建细节）
class ProductionSystemFactory implements SystemFactory {
  createDatabase(): DatabaseConnection {
    const db = new DatabaseConnection()
    db.setHost('prod-db.company.com')
    db.setPool(100)
    db.enableSSL()
    return db
  }
  createCache(): CacheManager {
    return new CacheManager()
  }
  createLogger(): Logger {
    return new Logger()
  }
}

// 开发环境工厂（隐藏开发环境创建细节）
class DevelopmentSystemFactory implements SystemFactory {
  createDatabase(): DatabaseConnection {
    const db = new DatabaseConnection()
    db.setHost('localhost')
    db.setPool(5)
    return db
  }
  createCache(): CacheManager {
    return new CacheManager()
  }
  createLogger(): Logger {
    return new Logger()
  }
}

// 客户端（只关心使用，不关心创建）
class Application {
  constructor(private factory: SystemFactory) {}
  start(): void {
    const db = this.factory.createDatabase()
    const cache = this.factory.createCache()
    const logger = this.factory.createLogger()
    db.connect()
    cache.initialize()
    logger.setup()
  }
}

// 最小用法示例
function demonstrateSystemFactory(): void {
  new Application(new ProductionSystemFactory()).start()
}

export {
  SystemFactory,
  ProductionSystemFactory,
  DevelopmentSystemFactory,
  Application,
  DatabaseConnection,
  CacheManager,
  Logger,
  demonstrateSystemFactory,
}
