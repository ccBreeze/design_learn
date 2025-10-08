# 模板方法模式 (Template Method Pattern)

## 定义

定义一个操作中算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。

## 核心思想

- **定义骨架**：在抽象类中定义算法的框架
- **延迟实现**：将某些步骤的实现延迟到子类
- **不变部分**：算法的结构不变，变化的是具体步骤

## 结构

```text
┌─────────────────┐
│ AbstractClass   │
│                 │
│ templateMethod()│◀───── 定义算法骨架（final）
│   step1()       │
│   step2()       │
│   step3()       │
│                 │
│ primitiveOp1()  │◀───── 抽象方法（子类实现）
│ primitiveOp2()  │
└────────┬────────┘
         │
         ├──────────────┬──────────────┐
         │              │              │
    ┌────▼─────┐   ┌────▼─────┐  ┌────▼─────┐
    │ConcreteA │   │ConcreteB │  │ConcreteC │
    │          │   │          │  │          │
    │实现抽象  │   │实现抽象  │  │实现抽象  │
    │方法      │   │方法      │  │方法      │
    └──────────┘   └──────────┘  └──────────┘
```

## 参与者

1. **AbstractClass（抽象类）**
   - 定义抽象的原语操作（primitive operations）
   - 实现模板方法，定义算法骨架
   - 模板方法调用原语操作及其他方法

2. **ConcreteClass（具体类）**
   - 实现原语操作以完成算法中与特定子类相关的步骤

## 优点

✅ **封装不变部分**：将算法的公共部分封装在父类中
✅ **扩展可变部分**：将可变部分提取到子类中，便于扩展
✅ **提取公共代码**：父类中提取公共代码，避免重复
✅ **控制子类扩展**：通过钩子方法控制特定点的行为

## 缺点

❌ **类数量增加**：每个不同实现都需要一个子类
❌ **继承关系**：需要使用继承，增加了系统复杂度
❌ **阅读困难**：父类和子类之间的调用关系可能不够直观

## 使用场景

- 一次性实现算法的不变部分，将可变部分留给子类实现
- 各子类中公共的行为应被提取出来并集中到一个公共父类中
- 需要控制子类的扩展

## 实际应用

1. **框架开发**：生命周期方法（React、Vue 等）
2. **数据处理**：不同格式的数据导入导出流程
3. **构建流程**：编译、测试、部署流程
4. **HTTP 请求**：请求的前置、后置处理
5. **游戏开发**：游戏关卡的通用流程

## 代码示例

### 最小实现

```typescript
// 抽象类：定义模板方法
abstract class Beverage {
  // 模板方法：定义算法骨架
  prepare(): void {
    this.boilWater()
    this.brew()
    this.pourInCup()
    this.addCondiments()
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
```

### 使用

```typescript
const tea = new Tea()
tea.prepare()
// 输出：
// 烧开水
// 泡茶叶
// 倒入杯中
// 加柠檬

const coffee = new Coffee()
coffee.prepare()
// 输出：
// 烧开水
// 冲泡咖啡
// 倒入杯中
// 加糖和牛奶
```

## 进阶实现

### 带钩子方法的模板

```typescript
abstract class Beverage {
  prepare(): void {
    this.boilWater()
    this.brew()
    this.pourInCup()
    // 钩子：子类可以决定是否添加调料
    if (this.customerWantsCondiments()) {
      this.addCondiments()
    }
  }

  // 钩子方法：默认返回 true，子类可以重写
  protected customerWantsCondiments(): boolean {
    return true
  }

  protected abstract brew(): void
  protected abstract addCondiments(): void
}

// 黑咖啡：不添加调料
class BlackCoffee extends Beverage {
  protected brew(): void {
    console.log('冲泡咖啡')
  }

  protected addCondiments(): void {
    // 不会被调用
  }

  // 重写钩子方法
  protected customerWantsCondiments(): boolean {
    return false // 不添加调料
  }
}
```

### 多步骤模板方法

```typescript
abstract class DataProcessor {
  // 模板方法：定义完整的处理流程
  process(): void {
    this.validateInput()
    this.readData()
    this.processData()
    this.validateOutput()
    this.saveData()
    this.cleanup()
  }

  // 具体方法
  private validateInput(): void {
    console.log('验证输入')
  }

  private validateOutput(): void {
    console.log('验证输出')
  }

  // 抽象方法
  protected abstract readData(): void
  protected abstract processData(): void
  protected abstract saveData(): void

  // 钩子方法：默认实现
  protected cleanup(): void {
    // 子类可以选择性重写
  }
}
```

## 方法类型

模板方法模式中常见的方法类型：

### 1. 模板方法（Template Method）

- 定义算法骨架
- 通常声明为 `final`（不可重写）
- 调用其他方法组成算法流程

### 2. 抽象方法（Abstract Methods）

- 必须由子类实现
- 算法中的可变部分

### 3. 具体方法（Concrete Methods）

- 在父类中实现
- 算法中的不变部分
- 所有子类共用

### 4. 钩子方法（Hook Methods）

- 在父类中提供默认实现（通常为空或返回默认值）
- 子类可以选择性重写
- 用于在算法特定点插入自定义行为

```typescript
abstract class Algorithm {
  // 模板方法
  execute(): void {
    this.step1() // 具体方法
    this.step2() // 抽象方法
    if (this.hook()) {
      // 钩子方法
      this.step3() // 抽象方法
    }
  }

  // 具体方法
  private step1(): void {
    console.log('Step 1: Common for all')
  }

  // 抽象方法
  protected abstract step2(): void
  protected abstract step3(): void

  // 钩子方法
  protected hook(): boolean {
    return true // 默认实现
  }
}
```

## 与其他模式的关系

- **策略模式**：模板方法使用继承改变算法的一部分；策略模式使用委托改变整个算法
- **工厂方法模式**：工厂方法是模板方法的特例
- **观察者模式**：可以使用模板方法来定义通知的流程

## 实现要点

1. **确定不变部分**：找出算法中固定的步骤
2. **确定可变部分**：找出需要子类定制的步骤
3. **使用访问控制**：模板方法通常是 `public`，原语操作通常是 `protected`
4. **减少原语操作**：原语操作越少，子类实现越容易
5. **命名规范**：给原语操作取有意义的名字

## TypeScript 实现技巧

### 防止模板方法被重写

TypeScript 没有 `final` 关键字，但可以通过设计避免重写：

```typescript
abstract class Base {
  // 使用 private 方法实现模板逻辑
  private templateMethodImpl(): void {
    this.step1()
    this.step2()
  }

  // public 方法调用 private 模板方法
  public execute(): void {
    this.templateMethodImpl()
  }

  protected abstract step1(): void
  protected abstract step2(): void
}
```

### 使用泛型增强类型安全

```typescript
abstract class DataProcessor<T, R> {
  process(input: T): R {
    const validated = this.validate(input)
    const processed = this.transform(validated)
    return this.format(processed)
  }

  protected abstract validate(input: T): T
  protected abstract transform(input: T): any
  protected abstract format(data: any): R
}

class JSONProcessor extends DataProcessor<string, object> {
  protected validate(input: string): string {
    return input.trim()
  }

  protected transform(input: string): any {
    return JSON.parse(input)
  }

  protected format(data: any): object {
    return data
  }
}
```

## 关键点

1. 模板方法定义算法骨架，子类实现具体步骤
2. 算法的结构保持不变，变化的是具体实现
3. 父类控制算法流程，子类负责实现细节
4. 使用钩子方法可以让子类选择性参与算法
