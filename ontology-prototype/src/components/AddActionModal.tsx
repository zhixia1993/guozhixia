import { useState } from 'react'
import { X, Database, Globe, Plug, Check, Search } from 'lucide-react'
import { cn } from '../lib/utils'

export type ActionSource = 'data' | 'api' | 'mcp'

export interface ObjectAction {
  id: string
  name: string
  source: ActionSource
  sourceLabel: string
  sourceDetail?: string
  desc?: string
}

interface AddActionModalProps {
  open: boolean
  onClose: () => void
  onAdd: (actions: ObjectAction[]) => void
  objectName: string
}

const sourceTabs: { key: ActionSource; label: string; icon: typeof Database }[] = [
  { key: 'data', label: '数据接入', icon: Database },
  { key: 'api', label: 'API 接入', icon: Globe },
  { key: 'mcp', label: 'MCP 接入', icon: Plug },
]

const availableActions: Record<ActionSource, { id: string; name: string; detail: string; desc: string }[]> = {
  data: [
    { id: 'd1', name: '经分 MySQL', detail: 't_user 表查询', desc: '查询用户基础信息' },
    { id: 'd2', name: '反诈 Hive', detail: 'call_log 表', desc: '查询通话记录数据' },
    { id: 'd3', name: '图谱 Neo4j', detail: '号码关联查询', desc: '图数据库关系溯源' },
  ],
  api: [
    { id: 'a1', name: '用户中心 API', detail: 'GET /v1/users/{id}', desc: '获取用户实时信息' },
    { id: 'a2', name: '健康检查接口', detail: 'GET /app/check-key/{key}', desc: '密钥有效性校验' },
    { id: 'a3', name: 'traceSource', detail: 'POST /trace', desc: '反诈溯源分析接口' },
  ],
  mcp: [
    { id: 'm1', name: 'getUserInfo', detail: '数据查询类', desc: 'MCP 获取用户基本信息' },
    { id: 'm2', name: 'queryCallLog', detail: '数据查询类', desc: 'MCP 查询通话记录' },
    { id: 'm3', name: 'submitTicket', detail: '业务操作类', desc: 'MCP 提交工单' },
    { id: 'm4', name: 'traceSource', detail: '业务操作类', desc: 'MCP 溯源分析' },
  ],
}

const sourceLabels: Record<ActionSource, string> = {
  data: '数据接入',
  api: 'API 接入',
  mcp: 'MCP 接入',
}

export function AddActionModal({ open, onClose, onAdd, objectName }: AddActionModalProps) {
  const [source, setSource] = useState<ActionSource>('data')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const items = availableActions[source].filter(
    (a) => !search || a.name.includes(search) || a.desc.includes(search)
  )

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConfirm = () => {
    const actions: ObjectAction[] = []
    for (const src of Object.keys(availableActions) as ActionSource[]) {
      for (const item of availableActions[src]) {
        if (selected.has(item.id)) {
          actions.push({
            id: `${src}-${item.id}-${Date.now()}`,
            name: item.name,
            source: src,
            sourceLabel: sourceLabels[src],
            sourceDetail: item.detail,
            desc: item.desc,
          })
        }
      }
    }
    if (actions.length > 0) onAdd(actions)
    handleClose()
  }

  const handleClose = () => {
    setSelected(new Set())
    setSearch('')
    setSource('data')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">新增动作</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              为 <span className="font-medium text-slate-700">{objectName}</span> 绑定动作，保存到当前本体版本
            </p>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Source tabs */}
        <div className="flex gap-1 border-b border-slate-100 px-6 py-3">
          {sourceTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setSource(tab.key); setSearch('') }}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                source === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-6 py-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索动作..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {items.map((item) => {
              const isSelected = selected.has(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all',
                    isSelected
                      ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                    isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                  )}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">{item.detail}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-sm text-slate-500">
            已选 <span className="font-medium text-slate-800">{selected.size}</span> 个动作
          </p>
          <div className="flex gap-3">
            <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className={cn(
                'rounded-lg px-5 py-2 text-sm font-medium',
                selected.size > 0
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              )}
            >
              确认绑定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
