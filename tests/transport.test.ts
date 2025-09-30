import { describe, it, expect } from 'vitest'
import {
  Transport,
  Truck,
  Ship,
  Logistics,
  RoadLogistics,
  SeaLogistics,
  createLogistics
} from '../src/patterns/creational/factoryMethod/Transport'

describe('Factory Method Pattern - 物流运输示例', () => {
  describe('运输工具（产品）', () => {
    it('Truck 应该提供陆地运输服务', () => {
      const truck = new Truck()
      const result = truck.deliver()
      
      expect(result).toBe('Truck: deliver by land in boxes.')
    })

    it('Ship 应该提供海运服务', () => {
      const ship = new Ship()
      const result = ship.deliver()
      
      expect(result).toBe('Ship: deliver by sea in containers.')
    })

    it('运输工具应该实现 Transport 接口', () => {
      const truck: Transport = new Truck()
      const ship: Transport = new Ship()
      
      expect(typeof truck.deliver).toBe('function')
      expect(typeof ship.deliver).toBe('function')
    })

    it('不同运输工具应该有不同的交付方式', () => {
      const truck = new Truck()
      const ship = new Ship()
      
      const truckResult = truck.deliver()
      const shipResult = ship.deliver()
      
      expect(truckResult).not.toBe(shipResult)
      expect(truckResult).toContain('land')
      expect(shipResult).toContain('sea')
    })
  })

  describe('物流公司（创建者）', () => {
    it('RoadLogistics 应该创建 Truck 并规划陆地配送', () => {
      const roadLogistics = new RoadLogistics()
      const result = roadLogistics.planDelivery()
      
      expect(result).toBe('Logistics: planning delivery -> Truck: deliver by land in boxes.')
    })

    it('SeaLogistics 应该创建 Ship 并规划海运配送', () => {
      const seaLogistics = new SeaLogistics()
      const result = seaLogistics.planDelivery()
      
      expect(result).toBe('Logistics: planning delivery -> Ship: deliver by sea in containers.')
    })

    it('不同物流公司应该产生不同的配送计划', () => {
      const roadLogistics = new RoadLogistics()
      const seaLogistics = new SeaLogistics()
      
      const roadResult = roadLogistics.planDelivery()
      const seaResult = seaLogistics.planDelivery()
      
      expect(roadResult).not.toBe(seaResult)
      expect(roadResult).toContain('Truck')
      expect(seaResult).toContain('Ship')
    })
  })

  describe('工厂函数', () => {
    it('createLogistics("road") 应该返回 RoadLogistics 实例', () => {
      const logistics = createLogistics('road')
      const result = logistics.planDelivery()
      
      expect(result).toContain('Truck')
      expect(result).toContain('land')
    })

    it('createLogistics("sea") 应该返回 SeaLogistics 实例', () => {
      const logistics = createLogistics('sea')
      const result = logistics.planDelivery()
      
      expect(result).toContain('Ship')
      expect(result).toContain('sea')
    })

    it('工厂函数应该根据参数返回不同的物流实例', () => {
      const roadLogistics = createLogistics('road')
      const seaLogistics = createLogistics('sea')
      
      const roadResult = roadLogistics.planDelivery()
      const seaResult = seaLogistics.planDelivery()
      
      expect(roadResult).not.toBe(seaResult)
    })
  })

  describe('多态性和扩展性', () => {
    it('应该支持通过基类引用调用不同的实现', () => {
      const logisticsList: Logistics[] = [
        new RoadLogistics(),
        new SeaLogistics()
      ]
      
      const results = logisticsList.map(logistics => logistics.planDelivery())
      
      expect(results).toHaveLength(2)
      expect(results[0]).toContain('Truck')
      expect(results[1]).toContain('Ship')
    })

    it('业务流程模板应该保持一致，只有具体运输方式不同', () => {
      const roadLogistics = new RoadLogistics()
      const seaLogistics = new SeaLogistics()
      
      const roadResult = roadLogistics.planDelivery()
      const seaResult = seaLogistics.planDelivery()
      
      // 都应该有相同的业务流程前缀
      expect(roadResult).toMatch(/^Logistics: planning delivery -> /)
      expect(seaResult).toMatch(/^Logistics: planning delivery -> /)
      
      // 但运输方式不同
      expect(roadResult.split('-> ')[1]).toContain('Truck')
      expect(seaResult.split('-> ')[1]).toContain('Ship')
    })

    it('应该支持扩展新的运输方式和物流公司', () => {
      // 模拟扩展航空运输
      class Plane implements Transport {
        deliver(): string {
          return 'Plane: deliver by air in cargo holds.'
        }
      }

      class AirLogistics extends Logistics {
        protected createTransport(): Transport {
          return new Plane()
        }
      }

      const airLogistics = new AirLogistics()
      const result = airLogistics.planDelivery()
      
      expect(result).toBe('Logistics: planning delivery -> Plane: deliver by air in cargo holds.')
    })
  })

  describe('工厂方法模式的核心优势', () => {
    it('客户端代码不需要知道具体的产品类', () => {
      // 客户端只依赖抽象
      function processDelivery(logistics: Logistics): string {
        return logistics.planDelivery()
      }
      
      const roadResult = processDelivery(new RoadLogistics())
      const seaResult = processDelivery(new SeaLogistics())
      
      expect(roadResult).toContain('Truck')
      expect(seaResult).toContain('Ship')
    })

    it('添加新产品不需要修改现有代码', () => {
      // 这个测试展示了开闭原则：对扩展开放，对修改关闭
      const originalLogistics = [new RoadLogistics(), new SeaLogistics()]
      
      // 添加新的运输方式
      class Train implements Transport {
        deliver(): string {
          return 'Train: deliver by rail in wagons.'
        }
      }

      class RailLogistics extends Logistics {
        protected createTransport(): Transport {
          return new Train()
        }
      }

      // 原有代码不需要修改，新代码可以无缝集成
      const allLogistics = [...originalLogistics, new RailLogistics()]
      const results = allLogistics.map(logistics => logistics.planDelivery())
      
      expect(results).toHaveLength(3)
      expect(results[2]).toContain('Train')
    })
  })
})