/**
 * 适配器模式（Adapter）—最小可运行示例
 * 要点：
 * - 在不修改现有客户端代码的前提下，将一个已有类（Adaptee）的接口转换为客户端所期望的接口（Target）。
 * - 通过组合（Adapter 持有 Adaptee 实例）而非继承，完成接口适配。
 */

// 1) 客户端期望的目标接口（Target）
export interface Target {
  request(): string
}

// 2) 已有但接口不兼容的类（Adaptee）
export class Adaptee {
  // 客户端并不认识的旧接口
  specificRequest(): string {
    return '来自 Adaptee 的特殊格式数据'
  }
}

// 3) 适配器（Adapter）：把 Adaptee 的接口转换成 Target 接口
export class Adapter implements Target {
  constructor(private adaptee: Adaptee) {}

  // 统一转为客户端能理解的接口
  request(): string {
    const raw = this.adaptee.specificRequest()
    // 这里可以做格式转换、字段重命名、单位换算、协议映射等
    return `Adapter: 已转换 -> ${raw}`
  }
}

// 4) 使用示例（注释以避免构建期副作用）
/**
const adaptee = new Adaptee();
const target: Target = new Adapter(adaptee);
console.log(target.request());
// 输出：Adapter: 已转换 -> 来自 Adaptee 的特殊格式数据
*/
