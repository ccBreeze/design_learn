# 模板方法模式 - 快速总结

## 一句话概括

在父类中定义算法的骨架，将某些步骤延迟到子类中实现，使子类可以在不改变算法结构的情况下重定义特定步骤。

## 核心要点

### 问题

- 多个类有相似的算法流程，但具体步骤实现不同
- 公共代码重复，难以维护
- 算法结构需要保持一致，但部分步骤需要定制

### 解决方案

- 在父类中定义模板方法，确定算法骨架
- 将可变步骤定义为抽象方法，由子类实现
- 将不变步骤实现在父类中，所有子类共用

### 结构

```text
AbstractClass
  ├─ templateMethod()  ← 定义骨架（不可重写）
  │    ├─ step1()      ← 具体方法（父类实现）
  │    ├─ step2()      ← 抽象方法（子类实现）
  │    └─ step3()      ← 钩子方法（可选重写）
  │
  ├─ ConcreteClassA    ← 实现 step2()
  └─ ConcreteClassB    ← 实现 step2()
```

## 最少代码示例

```typescript
// 抽象类：定义模板方法
abstract class Beverage {
  // 模板方法：定义算法骨架
  prepare(): void {
    this.boilWater() // 具体方法
    this.brew() // 抽象方法
    this.pourInCup() // 具体方法
    this.addCondiments() // 抽象方法
  }

  // 具体方法：所有子类共用
  private boilWater(): void {
    console.log('烧开水')
  }

  private pourInCup(): void {
    console.log('倒入杯中')
  }

  // 抽象方法：子类必须实现
  protected abstract brew(): void
  protected abstract addCondiments(): void
}

// 具体类：茶
class Tea extends Beverage {
  protected brew(): void {
    console.log('泡茶叶')
  }

  protected addCondiments(): void {
    console.log('加柠檬')
  }
}

// 具体类：咖啡
class Coffee extends Beverage {
  protected brew(): void {
    console.log('冲泡咖啡')
  }

  protected addCondiments(): void {
    console.log('加糖和牛奶')
  }
}

// 使用
const tea = new Tea()
tea.prepare()
// 输出：烧开水 → 泡茶叶 → 倒入杯中 → 加柠檬
```

## 四种方法类型

| 方法类型 | 定义位置 | 是否可重写  | 说明                     |
| -------- | -------- | ----------- | ------------------------ |
| 模板方法 | 父类     | 否（final） | 定义算法骨架             |
| 具体方法 | 父类     | 否          | 不变的步骤，所有子类共用 |
| 抽象方法 | 父类声明 | 是（必须）  | 可变的步骤，子类必须实现 |
| 钩子方法 | 父类     | 是（可选）  | 在特定点插入自定义行为   |

## 优缺点对比

| 优点 ✅                | 缺点 ❌              |
| ---------------------- | -------------------- |
| 提取公共代码，避免重复 | 每个实现需要一个子类 |
| 父类控制流程，易于维护 | 需要使用继承         |
| 符合开闭原则           | 可能导致类爆炸       |
| 易于扩展               | 父子类耦合度较高     |

## 使用时机

✅ **适合使用**

- 多个类有相似的算法结构
- 算法有固定的流程，但某些步骤需要定制
- 需要控制子类的扩展点
- 需要提取公共代码到父类

❌ **不适合使用**

- 算法流程经常变化
- 不同子类的算法结构差异很大
- 只有一个实现（不需要多态）

## 实际应用场景

1. **前端框架生命周期** - React、Vue 的组件生命周期方法
2. **数据处理流程** - 读取 → 处理 → 保存（不同格式）
3. **HTTP 请求处理** - 前置处理 → 业务逻辑 → 后置处理
4. **游戏开发** - 关卡流程：开始 → 游戏 → 结算
5. **测试框架** - setUp → test → tearDown

## 记忆技巧

想象**做菜的流程**：

- 模板方法 = 菜谱流程（洗菜 → 切菜 → 炒菜 → 调味 → 装盘）
- 具体方法 = 固定步骤（洗菜、装盘）
- 抽象方法 = 可变步骤（切菜方式、炒菜时间、调味料）
- 不同的菜（子类）= 不同的具体实现

流程固定，但每道菜的具体做法不同。

## 与其他模式的区别

| 模式         | 区别                                               |
| ------------ | -------------------------------------------------- |
| **策略模式** | 策略模式改变整个算法；模板方法只改变算法的某些步骤 |
| **工厂方法** | 工厂方法是模板方法的特例                           |
| **命令模式** | 命令模式封装请求；模板方法定义算法骨架             |

## 代码特征

### 典型结构

```typescript
abstract class AbstractClass {
  // 1. 模板方法（public，定义流程）
  public templateMethod(): void {
    this.baseOperation1() // 具体方法
    this.requiredOperation1() // 抽象方法
    this.baseOperation2() // 具体方法
    this.hook1() // 钩子方法
  }

  // 2. 具体方法（protected/private）
  protected baseOperation1(): void {
    console.log('Fixed step 1')
  }

  // 3. 抽象方法（protected abstract）
  protected abstract requiredOperation1(): void

  // 4. 钩子方法（protected，默认实现）
  protected hook1(): void {
    // 默认为空或默认实现
  }
}

class ConcreteClass extends AbstractClass {
  // 实现抽象方法
  protected requiredOperation1(): void {
    console.log('Custom implementation')
  }

  // 可选：重写钩子方法
  protected hook1(): void {
    console.log('Custom hook behavior')
  }
}
```

## 钩子方法示例

钩子方法让子类可以"插入"到算法的特定点：

```typescript
abstract class DataProcessor {
  process(): void {
    this.readData()
    this.validateData()

    // 钩子：子类可以决定是否转换
    if (this.shouldTransform()) {
      this.transformData()
    }

    this.saveData()
  }

  // 钩子方法：默认转换
  protected shouldTransform(): boolean {
    return true
  }

  protected abstract readData(): void
  protected abstract validateData(): void
  protected abstract transformData(): void
  protected abstract saveData(): void
}

// 不转换数据的处理器
class RawDataProcessor extends DataProcessor {
  // 重写钩子：跳过转换
  protected shouldTransform(): boolean {
    return false
  }

  // ... 实现其他抽象方法
}
```

## 好莱坞原则

模板方法模式遵循"好莱坞原则"：

> "Don't call us, we'll call you"（别调用我们，我们会调用你）

- 父类（高层组件）控制流程
- 子类（低层组件）等待被调用
- 父类决定何时以及如何调用子类方法

```typescript
// 父类控制流程，调用子类方法
abstract class HighLevel {
  // 父类说："我来控制流程"
  public execute(): void {
    this.step1() // 我来调用你
    this.step2() // 我来调用你
  }

  protected abstract step1(): void
  protected abstract step2(): void
}

// 子类被动等待被调用
class LowLevel extends HighLevel {
  // 子类说："我等着被调用"
  protected step1(): void {
    console.log('被父类调用了')
  }

  protected step2(): void {
    console.log('再次被父类调用')
  }
}
```

## 实现清单

创建模板方法模式时的步骤：

- [ ] 1. 分析算法，找出公共步骤和可变步骤
- [ ] 2. 创建抽象类
- [ ] 3. 实现模板方法（定义算法骨架）
- [ ] 4. 实现具体方法（不变的步骤）
- [ ] 5. 声明抽象方法（可变的步骤）
- [ ] 6. 考虑是否需要钩子方法
- [ ] 7. 创建具体子类，实现抽象方法
- [ ] 8. 测试不同子类是否遵循相同流程

## 注意事项

### ✅ 好的实践

```typescript
// 1. 模板方法不应该被重写
abstract class Good {
  // 使用 final 概念（或私有化实现）
  public final(): void {
    this.step1()
    this.step2()
  }
}

// 2. 减少抽象方法数量
abstract class Minimal {
  process(): void {
    this.doWork() // 只有一个抽象方法
  }

  protected abstract doWork(): void
}

// 3. 为方法提供有意义的名字
abstract class Meaningful {
  process(): void {
    this.validateInput()
    this.executeBusinessLogic()
    this.formatOutput()
  }
}
```

### ❌ 避免的做法

```typescript
// 1. 不要让模板方法被重写
abstract class Bad {
  // ❌ 子类可能重写整个流程
  public process(): void {
    this.step1()
    this.step2()
  }
}

// 2. 不要有太多抽象方法
abstract class TooMany {
  process(): void {
    this.step1()
    this.step2()
    this.step3()
    this.step4()
    this.step5() // 太多了！
  }
}
```

## 总结

模板方法模式通过继承实现代码复用，在父类中定义算法骨架，将可变部分延迟到子类实现。这是一种非常常见的模式，特别适合在框架开发中使用。

**核心思想**：算法的结构保持不变，变化的只是算法中的某些步骤。父类控制流程，子类负责实现细节。
