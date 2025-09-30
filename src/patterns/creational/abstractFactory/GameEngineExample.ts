/**
 * 游戏引擎组件创建 - 精简抽象工厂示例
 * 目标：通过工厂隐藏不同平台的组件创建差异
 */

class Renderer {
  private api = 'OpenGL'
  private quality = 'Medium'
  setAPI(api: string): void {
    this.api = api
  }
  setQuality(q: string): void {
    this.quality = q
  }
  start(): void {
    console.log(`Renderer: api=${this.api}, quality=${this.quality}`)
  }
}

class PhysicsEngine {
  private threads = 1
  setThreads(n: number): void {
    this.threads = n
  }
  start(): void {
    console.log(`Physics: threads=${this.threads}`)
  }
}

class AudioSystem {
  private buffer = 256
  setBuffer(size: number): void {
    this.buffer = size
  }
  start(): void {
    console.log(`Audio: buffer=${this.buffer}`)
  }
}

// 抽象工厂接口（核心）
interface GameEngineFactory {
  createRenderer(): Renderer
  createPhysicsEngine(): PhysicsEngine
  createAudioSystem(): AudioSystem
}

// 高性能平台工厂（隐藏高端配置）
class HighPerformanceGameFactory implements GameEngineFactory {
  createRenderer(): Renderer {
    const r = new Renderer()
    r.setAPI('Vulkan')
    r.setQuality('Ultra')
    return r
  }
  createPhysicsEngine(): PhysicsEngine {
    const p = new PhysicsEngine()
    p.setThreads(8)
    return p
  }
  createAudioSystem(): AudioSystem {
    const a = new AudioSystem()
    a.setBuffer(1024)
    return a
  }
}

// 移动平台工厂（隐藏移动优化）
class MobileGameFactory implements GameEngineFactory {
  createRenderer(): Renderer {
    const r = new Renderer()
    r.setAPI('DirectX12')
    r.setQuality('Medium')
    return r
  }
  createPhysicsEngine(): PhysicsEngine {
    const p = new PhysicsEngine()
    p.setThreads(2)
    return p
  }
  createAudioSystem(): AudioSystem {
    const a = new AudioSystem()
    a.setBuffer(256)
    return a
  }
}

// 客户端（只关心使用，不关心创建）
class Game {
  constructor(private factory: GameEngineFactory) {}
  start(): void {
    const r = this.factory.createRenderer()
    const p = this.factory.createPhysicsEngine()
    const a = this.factory.createAudioSystem()
    r.start()
    p.start()
    a.start()
  }
}

// 最小用法示例
function demonstrateGameEngineFactory(): void {
  new Game(new HighPerformanceGameFactory()).start()
}

export {
  GameEngineFactory,
  HighPerformanceGameFactory,
  MobileGameFactory,
  Game,
  Renderer,
  PhysicsEngine,
  AudioSystem,
  demonstrateGameEngineFactory,
}
