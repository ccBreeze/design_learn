// 最小命令模式示例：接口 + 接收者 + 具体命令 + 调用者 + 演示函数
// 命令抽象：统一执行接口
interface Command {
  execute(): string
}

// 接收者：实际执行开/关操作
class Light {
  on(): string {
    return 'Light is ON'
  }
  off(): string {
    return 'Light is OFF'
  }
}

// 具体命令：打开灯（调用接收者接口）
class TurnOn implements Command {
  constructor(private receiver: Light) {}
  execute(): string {
    return this.receiver.on()
  }
}

// 具体命令：关闭灯（调用接收者接口）
class TurnOff implements Command {
  constructor(private receiver: Light) {}
  execute(): string {
    return this.receiver.off()
  }
}

// 调用者：持有当前命令，触发执行；支持切换命令
class Remote {
  constructor(private command: Command) {}
  setCommand(c: Command): void {
    this.command = c
  }
  press(): string {
    return this.command.execute()
  }
}

// Demo：创建接收者与命令，切换执行并返回结果字符串
export function commandDemo(): string {
  const light = new Light()
  const on = new TurnOn(light)
  const off = new TurnOff(light)
  const remote = new Remote(on)
  const a = remote.press()
  remote.setCommand(off)
  const b = remote.press()
  return `${a} | ${b}`
}
