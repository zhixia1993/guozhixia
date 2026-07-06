import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Plus, ChevronRight, ChevronDown, Save, Send, Share2,
  ZoomIn, ZoomOut, Maximize2, Trash2,
} from 'lucide-react'
import { GraphCanvas } from '../components/GraphCanvas'
import { StatusBadge } from '../components/StatusBadge'
import { Modal } from '../components/Modal'
import { CreateObjectModal } from '../components/CreateObjectModal'

const initialTreeData = [
  { type: 'object', label: '对象', items: ['用户', '账户', '套餐', '账单'] },
  { type: 'relation', label: '关系', items: ['拥有', '包含', '消费'] },
  { type: 'attribute', label: '属性', items: ['用户ID', '姓名', '状态', '欠费天数'] },
]

const graphNodes = [
  { id: 'user', label: '用户', x: 200, y: 150, type: 'entity' as const },
  { id: 'account', label: '账户', x: 420, y: 100, type: 'entity' as const },
  { id: 'package', label: '套餐', x: 420, y: 220, type: 'entity' as const },
  { id: 'bill', label: '账单', x: 640, y: 160, type: 'entity' as const },
]

const graphEdges = [
  { from: 'user', to: 'account', label: '包含' },
  { from: 'user', to: 'package', label: '拥有' },
  { from: 'account', to: 'bill', label: '消费' },
]

export function ManualModeling() {
  const { id } = useParams<{ id: string }>()
  const [selectedNode, setSelectedNode] = useState('user')
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showCreateObject, setShowCreateObject] = useState(false)
  const [treeData, setTreeData] = useState(initialTreeData)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ object: true, relation: true, attribute: false })

  const objectItems = treeData.find((g) => g.type === 'object')?.items ?? []

  const handleCreateObject = (data: { name: string; key: string }) => {
    setTreeData((prev) =>
      prev.map((g) =>
        g.type === 'object' ? { ...g, items: [...g.items, data.name] } : g
      )
    )
    setSelectedNode(data.name)
    setExpanded((e) => ({ ...e, object: true }))
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <Link to="/modeling/manual/create" className="text-sm text-slate-400 hover:text-slate-600">创建空白本体</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-sm font-medium text-slate-900">专家自主建模</span>
          {id && <span className="rounded bg-violet-50 px-2 py-0.5 font-mono text-xs text-violet-600">ontology_{id}</span>}
          <StatusBadge status="draft" />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Save className="h-4 w-4" /> 保存
          </button>
          <button onClick={() => setShowAuditModal(true)} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Send className="h-4 w-4" /> 提交审核
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Share2 className="h-4 w-4" /> 共享
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-3">
            <input className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="电信经分本体" />
          </div>
          <div className="p-3 space-y-1">
            {treeData.map((group) => (
              <div key={group.type}>
                <button onClick={() => setExpanded({ ...expanded, [group.type]: !expanded[group.type] })} className="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {expanded[group.type] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  {group.label}
                  <span className="ml-auto text-xs text-slate-400">{group.items.length}</span>
                </button>
                {expanded[group.type] && group.items.map((item) => (
                  <button key={item} onClick={() => setSelectedNode(item)} className={`ml-5 block w-[calc(100%-20px)] rounded-lg px-3 py-1.5 text-left text-sm ${selectedNode === item ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 p-3 space-y-1.5">
            <button
              onClick={() => setShowCreateObject(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4" /> 添加对象
            </button>
            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Plus className="h-4 w-4" /> 添加关系
            </button>
          </div>
        </aside>

        <div className="relative flex-1 p-4">
          <div className="absolute right-6 top-6 z-10 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><ZoomIn className="h-4 w-4" /></button>
            <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><ZoomOut className="h-4 w-4" /></button>
            <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><Maximize2 className="h-4 w-4" /></button>
          </div>
          <GraphCanvas nodes={graphNodes} edges={graphEdges} selectedId={selectedNode} onNodeClick={setSelectedNode} />
        </div>

        <aside className="w-72 shrink-0 border-l border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="font-semibold text-slate-900">属性面板</h3>
            <p className="text-xs text-slate-400">编辑选中元素</p>
          </div>
          <div className="space-y-4 p-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">名称</label>
              <input defaultValue="用户" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">类型</label>
              <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400">
                <option>实体对象</option>
                <option>抽象对象</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">描述</label>
              <textarea rows={3} defaultValue="电信业务中的用户实体，包含个人用户和企业用户" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-500">属性列表</label>
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">+ 添加</button>
              </div>
              {['用户ID · string', '姓名 · string', '状态 · enum', '欠费天数 · int'].map((attr) => (
                <div key={attr} className="mb-1.5 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {attr}
                  <button className="text-slate-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700">保存</button>
              <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">删除</button>
            </div>
          </div>
        </aside>
      </div>

      <Modal
        open={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        title="提交审核"
        footer={
          <>
            <button onClick={() => setShowAuditModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">取消</button>
            <button onClick={() => setShowAuditModal(false)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">确认提交</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">指派审核人</label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
              <option>李审核（领域专家）</option>
              <option>王审核（架构师）</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">变更说明</label>
            <textarea rows={3} placeholder="说明本次建模的内容和变更..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="rounded border-slate-300 text-indigo-600" />
            审核通过后同时共享到本体资源广场
          </label>
        </div>
      </Modal>

      <CreateObjectModal
        open={showCreateObject}
        onClose={() => setShowCreateObject(false)}
        onCreate={handleCreateObject}
        parentOptions={[
          { value: 'Thing', label: 'Thing (Root)' },
          ...objectItems.map((item) => ({ value: item, label: item })),
        ]}
      />
    </div>
  )
}
