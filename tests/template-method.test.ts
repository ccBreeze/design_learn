import { describe, it, expect, vi } from 'vitest'

// 抽象类：定义模板方法
abstract class DataProcessor {
  // 模板方法：定义处理流程
  process(): string[] {
    const results: string[] = []

    results.push(this.readData())
    results.push(this.processData())
    results.push(this.saveData())

    return results
  }

  // 抽象方法：子类必须实现
  protected abstract readData(): string
  protected abstract processData(): string
  protected abstract saveData(): string
}

// 具体类：CSV 处理器
class CSVProcessor extends DataProcessor {
  protected readData(): string {
    return 'Read CSV file'
  }

  protected processData(): string {
    return 'Process CSV data'
  }

  protected saveData(): string {
    return 'Save to CSV'
  }
}

// 具体类：JSON 处理器
class JSONProcessor extends DataProcessor {
  protected readData(): string {
    return 'Read JSON file'
  }

  protected processData(): string {
    return 'Process JSON data'
  }

  protected saveData(): string {
    return 'Save to JSON'
  }
}

describe('模板方法模式', () => {
  it('应该按照模板方法定义的顺序执行', () => {
    const csv = new CSVProcessor()
    const result = csv.process()

    expect(result).toEqual(['Read CSV file', 'Process CSV data', 'Save to CSV'])
  })

  it('不同子类应该有不同的实现', () => {
    const csv = new CSVProcessor()
    const json = new JSONProcessor()

    const csvResult = csv.process()
    const jsonResult = json.process()

    expect(csvResult[0]).toBe('Read CSV file')
    expect(jsonResult[0]).toBe('Read JSON file')
  })

  it('模板方法应该调用所有抽象方法', () => {
    const processor = new CSVProcessor()

    // 使用 spy 监控方法调用
    const readSpy = vi.spyOn(processor as any, 'readData')
    const processSpy = vi.spyOn(processor as any, 'processData')
    const saveSpy = vi.spyOn(processor as any, 'saveData')

    processor.process()

    expect(readSpy).toHaveBeenCalledTimes(1)
    expect(processSpy).toHaveBeenCalledTimes(1)
    expect(saveSpy).toHaveBeenCalledTimes(1)
  })

  it('子类应该能够自定义具体步骤', () => {
    class CustomProcessor extends DataProcessor {
      protected readData(): string {
        return 'Custom read'
      }

      protected processData(): string {
        return 'Custom process'
      }

      protected saveData(): string {
        return 'Custom save'
      }
    }

    const custom = new CustomProcessor()
    const result = custom.process()

    expect(result).toEqual(['Custom read', 'Custom process', 'Custom save'])
  })
})
