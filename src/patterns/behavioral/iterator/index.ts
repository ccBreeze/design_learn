/**
 * 迭代器模式 (Iterator Pattern)
 *
 * 提供一种方法顺序访问聚合对象中的各个元素，而又不暴露其内部表示
 *
 * 本目录包含两种实现：
 * - MinimalIterator: 最简实现，包含 reset() 功能
 * - StandardIterator: 标准 UML 实现，符合 GoF 规范
 */

// 最简实现 - 使用命名空间避免冲突
export * as Minimal from './MinimalIterator'

// 标准 UML 实现 - 使用命名空间避免冲突
export * as Standard from './StandardIterator'
