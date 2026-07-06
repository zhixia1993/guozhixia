import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Plus, Search, Network, GitBranch, Eye, Pencil, Share2, List } from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'
import { GraphCanvas } from '../components/GraphCanvas'
import { ModelDirectoryTree } from '../components/ModelDirectoryTree'
import { ModelCatalogPanel } from '../components/ModelCatalogPanel'
import {
  getDefaultOntologyModel,
  buildGraphFromObjects,
  buildDirectoryTree,
  type OntologyModel,
  type DirectoryNode,
} from '../lib/ontologyModel'
import type { ModelStatus } from '../lib/utils'
import { cn } from '../lib/utils'

type ModelType = 'ontology' | 'rule' | 'logic'

const modelData: Record<ModelType, { title: string; items: { name: string; version: string; status: ModelStatus; domain: string; updated: string; count: string }[] }> = {
  ontology: {
    title: '本体模型库',
    items: [
      { name: '电信经分本体', version: 'v1.2', status: 'published', domain: '电信经分', updated: '2025-06-01', count: '12 对象 · 8 关系' },
      { name: '反诈溯源本体', version: 'v0.8', status: 'draft', domain: '反诈溯源', updated: '2 小时前', count: '8 对象 · 5 关系' },
      { name: '客户画像本体', version: 'v1.0', status: 'reviewing', domain: '客户画像', updated: '昨天', count: '15 对象 · 12 关系' },
      { name: '渠道运营本体', version: 'v0.5', status: 'changing', domain: '渠道运营', updated: '3 天前', count: '10 对象 · 7 关系' },
      { name: '计费账务本体', version: 'v2.0', status: 'published', domain: '计费账务', updated: '2025-05-10', count: '18 对象 · 14 关系' },
      { name: '网络资源本体', version: 'v0.3', status: 'rejected', domain: '网络运维', updated: '1 周前', count: '6 对象 · 4 关系' },
    ],
  },
  rule: {
    title: '规则模型库',
    items: [
      { name: '欠费停机规则集', version: 'v1.0', status: 'published', domain: '电信经分', updated: '2025-05-20', count: '5 条规则' },
      { name: '复机校验规则集', version: 'v0.3', status: 'draft', domain: '电信经分', updated: '昨天', count: '3 条规则' },
      { name: '反诈预警规则集', version: 'v1.1', status: 'published', domain: '反诈溯源', updated: '2025-06-01', count: '8 条规则' },
    ],
  },
  logic: {
    title: '逻辑模型库',
    items: [
      { name: '反诈关停溯源技能', version: 'v1.0', status: 'published', domain: '反诈溯源', updated: '2025-05-30', count: '3 MCP 工具' },
      { name: '经分问答技能', version: 'v0.5', status: 'reviewing', domain: '电信经分', updated: '2 天前', count: '5 MCP 工具' },
      { name: '客户画像分析技能', version: 'v0.2', status: 'draft', domain: '客户画像', updated: '3 天前', count: '4 MCP 工具' },
    ],
  },
}

const filters: { label: string; value: ModelStatus | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '草稿', value: 'draft' },
  { label: '审核中', value: 'reviewing' },
  { label: '已发布', value: 'published' },
  { label: '变更审批中', value: 'changing' },
]

export function ModelLibrary() {
  const { type = 'ontology' } = useParams<{ type: string }>()
  const modelType = (type as ModelType) || 'ontology'
  const data = modelData[modelType]
  const [filter, setFilter] = useState<ModelStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const items = data.items.filter((item) => {
    if (filter !== 'all' && item.status !== filter) return false
    if (search && !item.name.includes(search)) return false
    return true
  })

  const createPath = modelType === 'ontology' ? '/modeling/manual/create' : modelType === 'rule' ? '/modeling/rule' : '/modeling/logic'

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
          <p className="mt-1 text-sm text-slate-500">管理、查看和发布您的{modelType === 'ontology' ? '本体' : modelType === 'rule' ? '规则' : '逻辑'}模型</p>
        </div>
        <Link to={createPath} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> 新建模型
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${filter === f.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索模型..."
            className="w-64 rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <Link
            key={item.name}
            to={modelType === 'ontology' ? `/models/${modelType}/${idx + 1}` : `/models/${modelType}/1`}
            className="card-hover group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100">
                {modelType === 'ontology' ? <Network className="h-5 w-5 text-indigo-600" /> : modelType === 'rule' ? <GitBranch className="h-5 w-5 text-indigo-600" /> : <GitBranch className="h-5 w-5 text-violet-600" />}
              </div>
              <StatusBadge status={item.status} />
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">{item.name}</h3>
            <p className="mt-1 text-xs text-slate-400">{item.version} · {item.domain}</p>
            <p className="mt-2 text-sm text-slate-500">{item.count}</p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-400">{item.updated}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                {item.status === 'draft' || item.status === 'rejected' ? <><Pencil className="h-3 w-3" /> 编辑</> : <><Eye className="h-3 w-3" /> 查看</>}
              </span>
            </div>
          </Link>
        ))}
        <Link to={createPath} className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-slate-400 transition-colors hover:border-indigo-300 hover:text-indigo-500">
          <Plus className="mb-2 h-8 w-8" />
          <span className="text-sm font-medium">新建模型</span>
        </Link>
      </div>
    </div>
  )
}

export function ModelDetail() {
  const { id = '1' } = useParams<{ type: string; id: string }>()
  const navigate = useNavigate()
  const [view, setView] = useState<'graph' | 'catalog'>('graph')
  const [model] = useState<OntologyModel>(() => getDefaultOntologyModel(id))
  const [selectedNode, setSelectedNode] = useState<DirectoryNode | null>(null)
  const [selectedGraphId, setSelectedGraphId] = useState<string | undefined>()

  const isPublished = true
  const editable = !isPublished

  const tree = useMemo(() => buildDirectoryTree(model), [model])
  const graphData = useMemo(() => buildGraphFromObjects(model.objects), [model.objects])

  const handleEdit = () => {
    navigate(`/modeling/manual/${model.id}`)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{model.name}</h1>
            <span className="text-sm text-slate-400">{model.version}</span>
            <StatusBadge status="published" />
          </div>
          <div className="flex gap-2">
            {isPublished && (
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">申请变更</button>
            )}
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <Pencil className="h-4 w-4" /> 进入建模编辑
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Share2 className="h-4 w-4" /> 共享到资源广场
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">导出</button>
          </div>
        </div>
        <div className="mt-4 flex gap-1">
          <button
            onClick={() => setView('graph')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium',
              view === 'graph' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <Network className="h-4 w-4" /> 知识图谱
          </button>
          <button
            onClick={() => setView('catalog')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium',
              view === 'catalog' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <List className="h-4 w-4" /> 目录视图
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {view === 'graph' ? (
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-6">
              <GraphCanvas
                nodes={graphData.nodes}
                edges={graphData.edges}
                selectedId={selectedGraphId}
                onNodeClick={setSelectedGraphId}
                readOnly={isPublished}
              />
            </div>
            <aside className="w-80 shrink-0 border-l border-slate-200 bg-white">
              {selectedGraphId ? (
                <ModelCatalogPanel
                  node={tree.flatMap((c) => c.children ?? []).find((n) => n.meta?.key === selectedGraphId) ?? null}
                  model={model}
                  editable={editable}
                  onEdit={handleEdit}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-400">
                  <Network className="mb-2 h-8 w-8 text-slate-200" />
                  <p className="text-sm">点击图谱节点查看对象详情</p>
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <aside className="w-80 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">模型目录</h3>
              </div>
              <p className="mb-4 text-xs text-slate-400">
                对象 · 属性 · 关系 · 字典 · 规则 · 逻辑
              </p>
              <ModelDirectoryTree
                tree={tree}
                selectedId={selectedNode?.id ?? null}
                onSelect={setSelectedNode}
                editable={editable}
              />
            </aside>
            <div className="flex-1 overflow-hidden bg-slate-50/30">
              <ModelCatalogPanel
                node={selectedNode}
                model={model}
                editable={editable}
                onEdit={handleEdit}
              />
            </div>
          </div>
        )}

        {isPublished && view === 'graph' && (
          <aside className="w-72 shrink-0 border-l border-slate-200 bg-white p-5">
            <h3 className="mb-1 font-semibold text-slate-900">标注</h3>
            <p className="mb-4 text-xs text-slate-500">已发布模型支持标注与目录浏览</p>
            <div className="mb-4 space-y-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">建议增加「实名状态」属性到用户对象</p>
              </div>
            </div>
            <button className="w-full rounded-lg border border-dashed border-indigo-300 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50">+ 添加标注</button>
          </aside>
        )}
      </div>
    </div>
  )
}
