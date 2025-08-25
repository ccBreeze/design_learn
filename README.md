# 设计模式学习索引

本仓库用于按类别整理与实践常见设计模式，并提供最小可运行 Demo 与学习笔记链接。

## 目录索引
- 结构型模式 (Structural)
  - 外观模式 (Facade)：src/patterns/structural/facade/README.md

后续将逐步补充：
- 创建型模式 (Creational)：Singleton、Factory Method、Abstract Factory、Builder、Prototype 等
- 行为型模式 (Behavioral)：Strategy、Observer、Command、Template Method、State 等

## 如何运行示例
- 运行 Playground（已包含外观模式 Demo 输出）：
  - pnpm start
  - 或：pnpm dev（监听模式）

## 项目结构（简）
- src/
  - patterns/
    - structural/
      - facade/  ← 外观模式 Demo 与学习笔记
  - playground.ts  ← 运行与调试入口（使用 tsx）

欢迎按照目录添加更多模式的 Demo 与 README 学习笔记。