// ES6 版本的单例（不含 TypeScript 类型）

export class Singleton {
  static #instance

  constructor() {
    if (Singleton.#instance) {
      return Singleton.#instance
    }
    Singleton.#instance = this
  }

  static getInstance() {
    return (Singleton.#instance ??= new Singleton())
  }
}
