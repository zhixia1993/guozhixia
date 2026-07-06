import { useState, useEffect } from 'react'
import {
  Box, FileText, Bot, Plus, Pencil, Trash2, Link2, Search, BookOpen,
  Send, Database, Globe, Plug, ChevronRight,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { AddActionModal, type ObjectAction } from './AddActionModal'
import { ObjectDataTab, type VirtualDataMapping } from './ObjectDataTab'
import { CreatePropertyModal, type CreatePropertyData } from './CreatePropertyModal'
import { PropertyDetailPanel } from './PropertyDetailPanel'
import { RelationDetailPanel } from './RelationDetailPanel'
import type { DictionaryInfo } from '../types/dictionary'

export interface DictionaryMapping {
  dictId: string
  dictName: string
  dictCode: string
  entries: { code: string; displayName: string }[]
}

export interface PropertyConstraints {
  mandatory: boolean
  minLength?: number
  maxLength?: number
  regexPattern?: string
}

export interface DataProperty {
  id: string
  name: string
  key?: string
  parent?: string
  desc: string
  type: string
  dictionary?: DictionaryMapping
  constraints?: PropertyConstraints
}

export interface ObjectRelation {
  id: string
  name: string
  key?: string
  target: string
  domain?: string
  desc?: string
  comment?: string
  llmDesc?: string
}

export interface OntologyObject {
  name: string
  key: string
  parent: string
  source?: string
  comment?: string
  llmComment?: string
  dataProperties: DataProperty[]
  relations: ObjectRelation[]
  actions: ObjectAction[]
  dataMapping?: VirtualDataMapping
}

interface ObjectDetailPanelProps {
  object: OntologyObject
  objectOptions?: string[]
  dictionaries?: DictionaryInfo[]
  onUpdate?: (object: OntologyObject) => void
  onCreateProperty?: (data: CreatePropertyData) => void
  onAddRelation?: () => void
}

type TabKey = 'structure' | 'actions' | 'data'

export function ObjectDetailPanel({ object, objectOptions = [], dictionaries = [], onUpdate, onCreateProperty, onAddRelation }: ObjectDetailPanelProps) {
  const [tab, setTab] = useState<TabKey>('structure')
  const [showAddAction, setShowAddAction] = useState(false)
  const [showCreateProperty, setShowCreateProperty] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState(false)
  const [editingLlm, setEditingLlm] = useState(false)
  const [comment, setComment] = useState(object.comment ?? '')
  const [llmComment, setLlmComment] = useState(object.llmComment ?? '')

  useEffect(() => {
    setSelectedPropertyId(null)
    setSelectedRelationId(null)
    setComment(object.comment ?? '')
    setLlmComment(object.llmComment ?? '')
    setTab('structure')
  }, [object.key, object.comment, object.llmComment])

  const handleAddActions = (actions: ObjectAction[]) => {
    onUpdate?.({ ...object, actions: [...object.actions, ...actions] })
  }

  const handleRemoveAction = (actionId: string) => {
    onUpdate?.({ ...object, actions: object.actions.filter((a) => a.id !== actionId) })
  }

  const sourceIcon = (source: ObjectAction['source']) => {
    if (source === 'data') return Database
    if (source === 'api') return Globe
    return Plug
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'structure', label: '结构' },
    { key: 'actions', label: '动作' },
    { key: 'data', label: '数据' },
  ]

  const selectedProperty = object.dataProperties.find((p) => p.id === selectedPropertyId)
  const selectedRelation = object.relations.find((r) => r.id === selectedRelationId)

  const handleUpdateProperty = (updated: DataProperty) => {
    onUpdate?.({
      ...object,
      dataProperties: object.dataProperties.map((p) => (p.id === updated.id ? updated : p)),
    })
  }

  const handleUpdateRelation = (updated: ObjectRelation) => {
    onUpdate?.({
      ...object,
      relations: object.relations.map((r) => (r.id === updated.id ? updated : r)),
    })
  }

  if (selectedRelation && tab === 'structure') {
    return (
      <RelationDetailPanel
        relation={selectedRelation}
        domainObject={object}
        rangeName={selectedRelation.target}
        onBack={() => setSelectedRelationId(null)}
        onUpdate={handleUpdateRelation}
      />
    )
  }

  if (selectedProperty && tab === 'structure') {
    return (
      <PropertyDetailPanel
        property={selectedProperty}
        object={object}
        dictionaries={dictionaries}
        onBack={() => setSelectedPropertyId(null)}
        backLabel="返回对象结构"
        onUpdate={handleUpdateProperty}
      />
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Object header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-sm">
            <Box className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{object.name}</h2>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                #{object.key}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              继承自: <span className="font-medium text-slate-700">{object.parent}</span>
              {object.source && (
                <>
                  <span className="mx-2 text-slate-300">·</span>
                  From: <span className="font-mono text-slate-600">{object.source}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Comment rows */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <FileText className="h-3.5 w-3.5" /> Comment
              </span>
              <button onClick={() => setEditingComment(!editingComment)} className="text-slate-400 hover:text-slate-600">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            {editingComment ? (
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onBlur={() => {
                  setEditingComment(false)
                  onUpdate?.({ ...object, comment })
                }}
                rows={2}
                className="w-full resize-none rounded border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
                autoFocus
              />
            ) : (
              <p className="text-sm text-slate-600">{comment || <span className="text-slate-400">暂无注释</span>}</p>
            )}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Bot className="h-3.5 w-3.5" /> LLM-Comment
              </span>
              <button onClick={() => setEditingLlm(!editingLlm)} className="text-slate-400 hover:text-slate-600">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            {editingLlm ? (
              <textarea
                value={llmComment}
                onChange={(e) => setLlmComment(e.target.value)}
                onBlur={() => {
                  setEditingLlm(false)
                  onUpdate?.({ ...object, llmComment })
                }}
                rows={2}
                className="w-full resize-none rounded border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
                autoFocus
              />
            ) : (
              <p className="text-sm text-slate-600">{llmComment || <span className="text-slate-400">暂无 LLM 注释</span>}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors',
                tab === t.key
                  ? 'border-b-2 border-indigo-600 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'structure' && (
          <div className="flex h-full">
            {/* 数据属性 */}
            <div className="flex w-1/2 flex-col border-r border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">数据属性</h3>
                  <p className="text-xs text-slate-400">DataTypeProperties</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                    {object.dataProperties.length}
                  </span>
                  <button
                    onClick={() => setShowCreateProperty(true)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> 添加
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {object.dataProperties.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">暂无数据属性</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {object.dataProperties.map((prop) => (
                      <button
                        key={prop.id}
                        onClick={() => setSelectedPropertyId(prop.id)}
                        className={cn(
                          'group flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50/80',
                          selectedPropertyId === prop.id && 'bg-indigo-50/60'
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{prop.name}</p>
                          {prop.desc && (
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-400 line-clamp-2">{prop.desc}</p>
                          )}
                        </div>
                        <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500">
                          {prop.type}
                        </span>
                        {prop.dictionary && (
                          <BookOpen className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                        )}
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 关系 */}
            <div className="flex w-1/2 flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">关系</h3>
                  <p className="text-xs text-slate-400">ObjectProperties</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {object.relations.length}
                  </span>
                  <button
                    onClick={() => onAddRelation?.()}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> 添加
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {object.relations.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400">
                    <Link2 className="mb-2 h-8 w-8 text-slate-200" />
                    <p className="text-sm">暂无关系</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {object.relations.map((rel) => (
                      <button
                        key={rel.id}
                        onClick={() => setSelectedRelationId(rel.id)}
                        className="group flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50/80"
                      >
                        <Link2 className="h-4 w-4 shrink-0 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{rel.name}</p>
                          <p className="text-xs text-slate-400">→ {rel.target}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'actions' && (
          <div className="flex h-full flex-col">
            {object.actions.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6">
                <div className="relative mb-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100">
                    <Send className="h-10 w-10 text-slate-300 -rotate-12" />
                  </div>
                  <span className="absolute -right-2 -top-2 rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500">
                    EMPTY
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">还没有动作绑定</h3>
                <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-slate-500">
                  先为当前对象添加第一个动作。动作可以从数据接入、API 接入或 MCP 接入里挑选来源，并直接保存到当前本体版本。
                </p>
                <button
                  onClick={() => setShowAddAction(true)}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  新增动作
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">已绑定动作</h3>
                    <p className="text-xs text-slate-400">Actions bound to this object</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      {object.actions.length}
                    </span>
                    <button
                      onClick={() => setShowAddAction(true)}
                      className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      <Plus className="h-3.5 w-3.5" /> 新增动作
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                  {object.actions.map((action) => {
                    const Icon = sourceIcon(action.source)
                    return (
                      <div key={action.id} className="group flex items-start gap-4 px-6 py-4 hover:bg-slate-50/80">
                        <div className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                          action.source === 'data' ? 'bg-blue-50 text-blue-600' :
                          action.source === 'api' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-violet-50 text-violet-600'
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900">{action.name}</p>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                              {action.sourceLabel}
                            </span>
                          </div>
                          {action.sourceDetail && (
                            <p className="mt-0.5 font-mono text-xs text-slate-400">{action.sourceDetail}</p>
                          )}
                          {action.desc && <p className="mt-1 text-xs text-slate-500">{action.desc}</p>}
                        </div>
                        <button
                          onClick={() => handleRemoveAction(action.id)}
                          className="shrink-0 rounded p-1.5 text-slate-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'data' && (
          <ObjectDataTab
            mapping={object.dataMapping}
            onChangeMapping={() => {}}
            onUnbind={() => onUpdate?.({ ...object, dataMapping: undefined })}
          />
        )}
      </div>

      <AddActionModal
        open={showAddAction}
        onClose={() => setShowAddAction(false)}
        onAdd={handleAddActions}
        objectName={object.name}
      />
      <CreatePropertyModal
        open={showCreateProperty}
        onClose={() => setShowCreateProperty(false)}
        onCreate={onCreateProperty}
        objectOptions={objectOptions.length > 0 ? objectOptions : [object.name]}
        defaultDomain={object.name}
      />
    </div>
  )
}

interface ObjectSidebarProps {
  objects: OntologyObject[]
  selectedKey: string
  onSelect: (key: string) => void
  search: string
  onSearchChange: (v: string) => void
  onAddObject: () => void
}

export function ObjectSidebar({
  objects,
  selectedKey,
  onSelect,
  search,
  onSearchChange,
  onAddObject,
}: ObjectSidebarProps) {
  const filtered = objects.filter((o) =>
    !search || o.name.includes(search) || o.key.includes(search)
  )

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">对象</h3>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索对象..."
            className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map((obj) => (
          <button
            key={obj.key}
            onClick={() => onSelect(obj.key)}
            className={cn(
              'mb-0.5 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
              selectedKey === obj.key
                ? 'bg-indigo-50 font-medium text-indigo-700'
                : 'text-slate-700 hover:bg-slate-50'
            )}
          >
            <span className="truncate">{obj.name}</span>
            {obj.dataProperties.length > 0 && (
              <span className={cn(
                'ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                selectedKey === obj.key ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-500'
              )}>
                {obj.dataProperties.length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="border-t border-slate-100 p-3">
        <button
          onClick={onAddObject}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        >
          <Plus className="h-4 w-4" /> 添加对象
        </button>
      </div>
    </aside>
  )
}
