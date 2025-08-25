// 外观（Facade）设计模式 - 最小示例
// 通过一个统一的门面（Facade）封装多个子系统的复杂调用，向外部提供简单接口。

class CPU {
  start(): string {
    return 'CPU: start';
  }
}

class Memory {
  load(): string {
    return 'Memory: load';
  }
}

class Disk {
  read(): string {
    return 'Disk: read';
  }
}

// Facade：对外暴露简化的方法
export class ComputerFacade {
  private cpu = new CPU();
  private memory = new Memory();
  private disk = new Disk();

  boot(): string {
    // 对外部调用者隐藏具体的子系统调用顺序与细节
    return [this.cpu.start(), this.memory.load(), this.disk.read()].join(' | ');
  }
}

// 提供一个最小可运行的 demo 函数
export function facadeDemo(): string {
  const pc = new ComputerFacade();
  return pc.boot();
}

export default { ComputerFacade, facadeDemo };