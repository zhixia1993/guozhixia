import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, ChevronRight, GitCompare } from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'
import { GraphCanvas } from '../components/GraphCanvas'

const pendingItems = [
  { id: '1', type: '本体模型', name: '客户画像本体', submitter: '李四', time: '2025-06-02 14:30', desc: '新增客户标签体系，扩展用户属性枚举' },
  { id: '2', type: '规则模型', name: '欠费停机规则集', submitter: '王五', time: '2025-06-01 10:15', desc: '新增复机校验规则，优化停机触发条件' },
  { id: '3', type: '逻辑模型', name: '反诈关停溯源技能', submitter: '赵六', time: '2025-05-30 16:45', desc: '集成 traceSource MCP，完善溯源报告生成' },
]

const mySubmissions = [
  { name: '电信经分本体 v1.3', type: '本体模型', status: 'reviewing' as const, time: '昨天', reviewer: '李审核' },
  { name: '渠道运营本体', type: '本体模型', status: 'changing' as const, time: '3 天前', reviewer: '王审核' },
  { name: '网络资源本体', type: '本体模型', status: 'rejected' as const, time: '1 周前', reviewer: '李审核' },
]

export function AuditCenter() {
  const [tab, setTab] = useState<'pending' | 'mine' | 'history'>('pending')

  return (
    <div className="p-6 lg:p-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">审核中心</h1>
      <p className="mb-6 text-sm text-slate-500">审核本体、规则和逻辑模型的发布与变更申请</p>

      <div className="mb-6 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 w-fit">
        {[
          { key: 'pending' as const, label: '待我审核', count: 3 },
          { key: 'mine' as const, label: '我的提交', count: 3 },
          { key: 'history' as const, label: '审核历史' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t.key ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${tab === t.key ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-600'}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3">类型</th>
                <th className="px-6 py-3">名称</th>
                <th className="px-6 py-3">提交人</th>
                <th className="px-6 py-3">提交时间</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {pendingItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-6 py-4"><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{item.type}</span></td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.desc}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.submitter}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{item.time}</td>
                  <td className="px-6 py-4">
                    <Link to={`/audit/${item.id}`} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">审核</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'mine' && (
        <div className="space-y-3">
          {mySubmissions.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{item.name}</span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.type} · 审核人: {item.reviewer} · {item.time}</p>
              </div>
              {item.status === 'rejected' && (
                <button className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50">重新编辑</button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
          <Clock className="mx-auto mb-3 h-8 w-8" />
          <p className="text-sm">审核历史记录将在此展示</p>
        </div>
      )}
    </div>
  )
}

export function AuditDetail() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/audit" className="hover:text-slate-600">审核中心</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">审核详情</span>
        </div>
        <h1 className="mt-2 text-xl font-bold text-slate-900">客户画像本体 — 发布审核</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 border-r border-slate-200 bg-white p-6 overflow-y-auto">
          <h3 className="mb-4 font-semibold text-slate-900">变更信息</h3>
          <div className="space-y-4 text-sm">
            <div><p className="text-slate-400">提交人</p><p className="font-medium text-slate-800">李四</p></div>
            <div><p className="text-slate-400">提交时间</p><p className="font-medium text-slate-800">2025-06-02 14:30</p></div>
            <div><p className="text-slate-400">变更说明</p><p className="text-slate-700">新增客户标签体系，扩展用户状态枚举值，增加行为事件对象</p></div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-indigo-600" />
              <h4 className="font-semibold text-slate-900">变更摘要</h4>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-emerald-600">+ 新增对象: 客户标签</p>
              <p className="text-emerald-600">+ 新增对象: 行为事件</p>
              <p className="text-amber-600">~ 修改属性: 用户.状态</p>
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">审核意见</label>
            <textarea rows={4} placeholder="填写审核意见..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>

          <div className="mt-4 flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
              <XCircle className="h-4 w-4" /> 驳回
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
              <CheckCircle className="h-4 w-4" /> 通过并发布
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-4 flex gap-2">
            <button className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">图视图对比</button>
            <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">树视图对比</button>
          </div>
          <div className="grid h-[calc(100%-40px)] grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">变更前 v1.0</p>
              <GraphCanvas
                nodes={[
                  { id: 'u1', label: '用户', x: 150, y: 120, type: 'entity' },
                  { id: 'a1', label: '账户', x: 300, y: 120, type: 'entity' },
                ]}
                edges={[{ from: 'u1', to: 'a1', label: '包含' }]}
                readOnly
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-emerald-600">变更后 v1.1</p>
              <GraphCanvas
                nodes={[
                  { id: 'u2', label: '用户', x: 120, y: 120, type: 'entity' },
                  { id: 'a2', label: '账户', x: 270, y: 80, type: 'entity' },
                  { id: 't2', label: '客户标签', x: 270, y: 180, type: 'entity' },
                ]}
                edges={[
                  { from: 'u2', to: 'a2', label: '包含' },
                  { from: 'u2', to: 't2', label: '标记' },
                ]}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
