/**
 * 桥接模式（Bridge Pattern）
 *
 * 目的：将抽象与实现分离，让它们可以独立演化。
 * 在这里：
 * - 抽象层（RemoteControl、AdvancedRemoteControl）负责“控制接口”
 * - 实现层（Device、Tv、Radio）负责设备的具体操作
 */

// ========== 实现部分（Device 层次） ==========

export interface Device {
  isEnabled(): boolean
  enable(): void
  disable(): void
  getVolume(): number
  setVolume(percent: number): void
  getChannel(): number
  setChannel(channel: number): void
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export class Tv implements Device {
  private on = false
  private volume = 50
  private channel = 1

  isEnabled(): boolean {
    return this.on
  }
  enable(): void {
    this.on = true
  }
  disable(): void {
    this.on = false
  }
  getVolume(): number {
    return this.volume
  }
  setVolume(percent: number): void {
    this.volume = clamp(Math.round(percent), 0, 100)
  }
  getChannel(): number {
    return this.channel
  }
  setChannel(channel: number): void {
    this.channel = Math.max(1, Math.round(channel))
  }
}

export class Radio implements Device {
  private on = false
  private volume = 30
  private channel = 88 // FM 默认频点

  isEnabled(): boolean {
    return this.on
  }
  enable(): void {
    this.on = true
  }
  disable(): void {
    this.on = false
  }
  getVolume(): number {
    return this.volume
  }
  setVolume(percent: number): void {
    this.volume = clamp(Math.round(percent), 0, 100)
  }
  getChannel(): number {
    return this.channel
  }
  setChannel(channel: number): void {
    this.channel = Math.max(1, Math.round(channel))
  }
}

// ========== 抽象部分（Remote 层次） ==========

export class RemoteControl {
  protected device: Device

  constructor(device: Device) {
    this.device = device
  }

  togglePower(): void {
    if (this.device.isEnabled()) {
      this.device.disable()
    } else {
      this.device.enable()
    }
  }

  volumeDown(): void {
    this.device.setVolume(this.device.getVolume() - 10)
  }

  volumeUp(): void {
    this.device.setVolume(this.device.getVolume() + 10)
  }

  channelDown(): void {
    this.device.setChannel(this.device.getChannel() - 1)
  }

  channelUp(): void {
    this.device.setChannel(this.device.getChannel() + 1)
  }
}

export class AdvancedRemoteControl extends RemoteControl {
  mute(): void {
    this.device.setVolume(0)
  }
}

// ========== 最小可运行示例 ==========

export function bridgeDemo(): string {
  const tv = new Tv()
  const tvRemote = new RemoteControl(tv)
  tvRemote.togglePower() // 开机
  tvRemote.volumeUp()
  tvRemote.channelUp()

  const radio = new Radio()
  const radioRemote = new AdvancedRemoteControl(radio)
  radioRemote.togglePower() // 开机
  radioRemote.volumeUp()
  radioRemote.mute() // 一键静音

  return [
    `TV(on=${tv.isEnabled()}, vol=${tv.getVolume()}, ch=${tv.getChannel()})`,
    `Radio(on=${radio.isEnabled()}, vol=${radio.getVolume()}, ch=${radio.getChannel()})`,
  ].join('\n')
}
