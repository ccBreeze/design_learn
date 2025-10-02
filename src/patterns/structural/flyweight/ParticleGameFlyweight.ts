// 根据图示实现享元模式示例：Particle（内在状态） + MovingParticle（外在状态） + Game 客户端

export type Coords = { x: number; y: number }
export type Vector = { dx: number; dy: number }

/** 简单画布接口（示例用，打印输出） */
export interface Canvas {
  drawSprite(sprite: string, color: string, x: number, y: number): void
}

export class ConsoleCanvas implements Canvas {
  drawSprite(sprite: string, color: string, x: number, y: number): void {
    console.log(`draw ${sprite} (${color}) at (${x}, ${y})`)
  }
}

/**
 * 享元：粒子的内在状态（color、sprite）与与之相关的操作。
 */
export class Particle {
  private color: string
  private sprite: string

  constructor(color: string, sprite: string) {
    this.color = color
    this.sprite = sprite
  }

  move(coords: Coords, vector: Vector, speed: number): Coords {
    return {
      x: coords.x + vector.dx * speed,
      y: coords.y + vector.dy * speed,
    }
  }

  draw(coords: Coords, canvas: Canvas): void {
    canvas.drawSprite(this.sprite, this.color, coords.x, coords.y)
  }
}

/**
 * 外在状态包装：指向共享的 Particle，并持有可变的坐标、向量与速度。
 */
export class MovingParticle {
  private particle: Particle
  private coords: Coords
  private vector: Vector
  private speed: number

  constructor(
    particle: Particle,
    coords: Coords,
    vector: Vector,
    speed: number
  ) {
    this.particle = particle
    this.coords = { ...coords }
    this.vector = { ...vector }
    this.speed = speed
  }

  move(): void {
    this.coords = this.particle.move(this.coords, this.vector, this.speed)
  }

  draw(canvas: Canvas): void {
    this.particle.draw(this.coords, canvas)
  }
}

/**
 * 客户端：管理共享粒子与移动粒子，按需复用共享对象。
 */
export class Game {
  mps: MovingParticle[] = []
  private particles: Map<string, Particle> = new Map()

  private key(color: string, sprite: string): string {
    return `${color}__${sprite}`
  }

  private getOrCreateParticle(color: string, sprite: string): Particle {
    const k = this.key(color, sprite)
    const existing = this.particles.get(k)
    if (existing) return existing
    const created = new Particle(color, sprite)
    this.particles.set(k, created)
    return created
  }

  addParticle(
    coords: Coords,
    vector: Vector,
    speed: number,
    color: string,
    sprite: string
  ): void {
    const particle = this.getOrCreateParticle(color, sprite)
    const mp = new MovingParticle(particle, coords, vector, speed)
    this.mps.push(mp)
  }

  draw(canvas: Canvas): void {
    for (const mp of this.mps) {
      mp.move()
      mp.draw(canvas)
    }
  }

  countFlyweights(): number {
    return this.particles.size
  }
}

/**
 * 单位：示例性发射行为，向目标坐标发射共享子弹粒子。
 */
export class Unit {
  constructor(
    public coords: Coords,
    public weaponPower: number
  ) {}

  fireAt(target: Unit, game: Game): void {
    const vector: Vector = {
      dx: target.coords.x - this.coords.x,
      dy: target.coords.y - this.coords.y,
    }
    // 颜色与贴图作为共享内在状态，复用相同子弹粒子
    game.addParticle(
      this.coords,
      vector,
      this.weaponPower,
      'red',
      'bullet.jpeg'
    )
  }
}

/**
 * 演示：创建游戏与单位，发射多颗子弹，打印共享粒子数量与移动粒子数量。
 */
export function flyweightParticleDemo(): string {
  const game = new Game()
  const attacker = new Unit({ x: 0, y: 0 }, 1)
  const target = new Unit({ x: 100, y: 50 }, 1)

  // 连续发射同类型子弹，复用同一个共享粒子（内在状态）
  for (let i = 0; i < 5; i++) {
    attacker.fireAt(target, game)
  }

  const canvas = new ConsoleCanvas()
  game.draw(canvas)

  return `flyweights=${game.countFlyweights()}, moving=${game.mps.length}`
}
