/**
 * 适配器模式（Adapter）—出国旅行插头/插座示例（美国 -> 欧洲/德国）
 * 场景：第一次从美国去欧洲（德国）旅行，笔记本的美标插头（Adaptee）无法直接插入德标插座（Target）。
 * 解决：购买“美插->欧插”转换器（Adapter），把不兼容的接口转为当地可用。
 * 扩展：旅行次数多后，你会积累多个国家的转换器（多个 Adapter）。
 */

// 1) 目标接口（Target）：欧洲/德国插座（Schuko，230V，示意）
export interface EUOutlet {
  supply230V(): string
}

// 2) 被适配者（Adaptee）：美国插头（Type A/B，120V，示意）
export class USPlug {
  provide120V(): string {
    return 'US Plug: 输出 120V（Type A/B 扁平两脚/三脚）'
  }
}

// 3) 适配器（Adapter）：将 USPlug 适配为 EUOutlet
export class USToEUAdapter implements EUOutlet {
  constructor(private usPlug: USPlug) {}
  supply230V(): string {
    const raw = this.usPlug.provide120V()
    // 说明：现实中电压转换需变压器；旅行适配器多为形状转换，
    // 这里仅做“语义示意”，把接口统一为 EUOutlet.supply230V()
    return `Adapter: 美插 -> 欧插（Schuko），从『${raw}』适配为『230V 接口形态兼容』`
  }
}

// 4) 客户端（Client）：面向目标接口 EUOutlet 编程
export class LaptopCharger {
  constructor(private outlet: EUOutlet) {}
  charge(): string {
    return `充电中 -> ${this.outlet.supply230V()}`
  }
}

// 5) 扩展示例：更多目的地（英国），展示“会越用越多的转换器”
export interface UKOutlet {
  supply230V_UK(): string
}
export class USToUKAdapter implements UKOutlet {
  constructor(private usPlug: USPlug) {}
  supply230V_UK(): string {
    const raw = this.usPlug.provide120V()
    return `Adapter: 美插 -> 英插（Type G），从『${raw}』适配为『230V/Type G』`
  }
}

// 6) 行李箱：收集不同国家的适配器（演示“第10次旅行后适配器变多”）
export class TravelSuitcase {
  private euAdapters: USToEUAdapter[] = []
  private ukAdapters: USToUKAdapter[] = []

  addEUAdapter(a: USToEUAdapter) {
    this.euAdapters.push(a)
  }
  addUKAdapter(a: USToUKAdapter) {
    this.ukAdapters.push(a)
  }

  summary(): string {
    return `行李箱适配器清单：EU x ${this.euAdapters.length}, UK x ${this.ukAdapters.length}`
  }
}

/** 使用示例（注释以避免构建期副作用）
// 第一次去欧洲（德国）：需要一个“美->欧”适配器
const usPlug = new USPlug();
const euAdapter = new USToEUAdapter(usPlug);
const chargerEU = new LaptopCharger(euAdapter);
console.log(chargerEU.charge());
// 充电中 -> Adapter: 美插 -> 欧插（Schuko），从『US Plug: 输出 120V（Type A/B 扁平两脚/三脚）』适配为『230V 接口形态兼容』

// 第10次旅行后：你可能已拥有多个国家的适配器
const suitcase = new TravelSuitcase();
suitcase.addEUAdapter(euAdapter);
suitcase.addUKAdapter(new USToUKAdapter(usPlug));
suitcase.addEUAdapter(new USToEUAdapter(new USPlug()));
console.log(suitcase.summary());
// 行李箱适配器清单：EU x 2, UK x 1
*/
