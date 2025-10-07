/**
 * 场景1: 审批流程
 * 演示：请假审批系统（从小权限到大权限链接）
 */

import { Handler } from '../UltraMinimalChain'

interface LeaveRequest {
  days: number
  employeeName: string
}

// 总监（最高级别）
const director = new Handler<LeaveRequest, string>(req =>
  req.days <= 7
    ? `总监批准了 ${req.employeeName} 的 ${req.days} 天假期`
    : undefined
)

// 经理（中级）
const manager = new Handler<LeaveRequest, string>(
  req =>
    req.days <= 3
      ? `经理批准了 ${req.employeeName} 的 ${req.days} 天假期`
      : undefined,
  director // 处理不了传给总监
)

// 组长（初级）
const teamLeader = new Handler<LeaveRequest, string>(
  req =>
    req.days <= 1
      ? `组长批准了 ${req.employeeName} 的 ${req.days} 天假期`
      : undefined,
  manager // 处理不了传给经理
)

export function approvalChainDemo(): void {
  console.log('📋 场景1: 审批流程\n')

  console.log(teamLeader.handle({ days: 1, employeeName: '张三' })) // 组长批准
  console.log(teamLeader.handle({ days: 3, employeeName: '李四' })) // 经理批准
  console.log(teamLeader.handle({ days: 7, employeeName: '王五' })) // 总监批准
  console.log(teamLeader.handle({ days: 10, employeeName: '赵六' })) // undefined (需要更高层级)
}
