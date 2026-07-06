import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight, Save, Send, Share2,
  ZoomIn, ZoomOut, Maximize2, Network, List,
  Box, BookOpen, Tag, Link2,
} from 'lucide-react'
import { GraphCanvas } from '../components/GraphCanvas'
import { StatusBadge } from '../components/StatusBadge'
import { Modal } from '../components/Modal'
import { CreateObjectModal } from '../components/CreateObjectModal'
import { CreateRelationModal } from '../components/CreateRelationModal'
import {
  ObjectDetailPanel,
  ObjectSidebar,
  type OntologyObject,
  type ObjectRelation,
  type DataProperty,
} from '../components/ObjectDetailPanel'
import { type CreatePropertyData } from '../components/CreatePropertyModal'
import { DictionaryPanel } from '../components/DictionaryPanel'
import { PropertyListPanel } from '../components/PropertyListPanel'
import { RelationListPanel } from '../components/RelationListPanel'
import type { DictionaryInfo, CreateDictionaryData } from '../types/dictionary'
import {
  defaultOntologyObjects,
  defaultDictionaries,
  buildGraphFromObjects,
} from '../lib/ontologyModel'
import { cn } from '../lib/utils'

type DesignSection = 'objects' | 'properties' | 'relations' | 'dictionaries'

function toDictionaryInfo(data: CreateDictionaryData, id?: string): DictionaryInfo {
  const entries = data.entries ?? []
  return {
    id: id ?? `dict-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: data.name,
    code: data.code,
    desc: data.desc,
    entryCount: entries.length,
    entries,
  }
}

export function ManualModeling() {
  const { id } = useParams<{ id: string }>()
  const [objects, setObjects] = useState<OntologyObject[]>(defaultOntologyObjects)
  const [dictionaries, setDictionaries] = useState<DictionaryInfo[]>(defaultDictionaries)
  const [designSection, setDesignSection] = useState<DesignSection>('objects')
  const [selectedObjectKey, setSelectedObjectKey] = useState('card_disposal')
  const [objectSearch, setObjectSearch] = useState('')
  const [viewMode, setViewMode] = useState<'detail' | 'graph'>('detail')
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showCreateObject, setShowCreateObject] = useState(false)
  const [showCreateRelation, setShowCreateRelation] = useState(false)

  const selectedObject = useMemo(
    () => objects.find((o) => o.key === selectedObjectKey) ?? objects[0],
    [objects, selectedObjectKey]
  )

  const objectNames = objects.map((o) => o.name)

  const graphData = useMemo(() => buildGraphFromObjects(objects), [objects])

  const handleCreateObject = (data: { name: string; key: string; parent: string }) => {
    const newObj: OntologyObject = {
      name: data.name,
      key: data.key.toLowerCase().replace(/^ontology_/, ''),
      parent: data.parent === 'Thing' ? 'Thing (Root)' : data.parent,
      dataProperties: [],
      relations: [],
    actions: [],
    }
    setObjects((prev) => [...prev, newObj])
    setSelectedObjectKey(newObj.key)
    setViewMode('detail')
  }

  const handleUpdateObject = (updated: OntologyObject) => {
    setObjects((prev) => prev.map((o) => (o.key === updated.key ? updated : o)))
  }

  const handleCreateProperty = (data: CreatePropertyData) => {
    const targetObj = objects.find((o) => o.name === data.domain)
    if (!targetObj) return
    const newProp = {
      id: data.key || `prop-${Date.now()}`,
      name: data.name,
      key: data.key,
      parent: 'topDataProperty',
      desc: data.comment,
      type: data.type,
      constraints: { mandatory: false },
    }
    setObjects((prev) =>
      prev.map((o) =>
        o.key === targetObj.key
          ? { ...o, dataProperties: [...o.dataProperties, newProp] }
          : o
      )
    )
    if (targetObj.key === selectedObjectKey) {
      // refresh view
    } else {
      setSelectedObjectKey(targetObj.key)
      setViewMode('detail')
    }
  }

  const handleCreateRelation = (data: {
    name: string; key: string; domain: string; range: string; comment: string; llmDesc: string
  }) => {
    const domainObj = objects.find((o) => o.name === data.domain)
    if (!domainObj) return
    const newRel: ObjectRelation = {
      id: `rel-${Date.now()}`,
      name: data.name,
      key: data.key,
      target: data.range,
      domain: data.domain,
      comment: data.comment,
      llmDesc: data.llmDesc,
      desc: data.comment,
    }
    setObjects((prev) =>
      prev.map((o) =>
        o.key === domainObj.key ? { ...o, relations: [...o.relations, newRel] } : o
      )
    )
    setDesignSection('relations')
  }

  const handleUpdateProperty = (objectKey: string, propertyId: string, updated: DataProperty) => {
    setObjects((prev) =>
      prev.map((o) =>
        o.key === objectKey
          ? { ...o, dataProperties: o.dataProperties.map((p) => (p.id === propertyId ? updated : p)) }
          : o
      )
    )
  }

  const handleUpdateRelation = (domainKey: string, relationId: string, updated: ObjectRelation) => {
    setObjects((prev) =>
      prev.map((o) =>
        o.key === domainKey
          ? { ...o, relations: o.relations.map((r) => (r.id === relationId ? updated : r)) }
          : o
      )
    )
  }

  const handleCreateDictionary = (data: CreateDictionaryData) => {
    setDictionaries((prev) => [...prev, toDictionaryInfo(data)])
  }

  const handleBulkImportDictionaries = (items: CreateDictionaryData[]) => {
    setDictionaries((prev) => [
      ...prev,
      ...items.map((item) => toDictionaryInfo(item)),
    ])
  }

  const handleDeleteDictionary = (dictId: string) => {
    setDictionaries((prev) => prev.filter((d) => d.id !== dictId))
    setObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        dataProperties: obj.dataProperties.map((p) =>
          p.dictionary?.dictId === dictId ? { ...p, dictionary: undefined } : p
        ),
      }))
    )
  }

  const handleUpdateDictionary = (updated: DictionaryInfo) => {
    setDictionaries((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
    setObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        dataProperties: obj.dataProperties.map((p) => {
          if (p.dictionary?.dictId !== updated.id) return p
          return {
            ...p,
            dictionary: {
              dictId: updated.id,
              dictName: updated.name,
              dictCode: updated.code,
              entries: updated.entries,
            },
          }
        }),
      }))
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <Link to="/modeling/manual/create" className="text-sm text-slate-400 hover:text-slate-600">创建空白本体</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-sm font-medium text-slate-900">专家自主建模</span>
          {id && <span className="rounded bg-violet-50 px-2 py-0.5 font-mono text-xs text-violet-600">ontology_{id}</span>}
          <StatusBadge status="draft" />
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-2 flex rounded-lg border border-slate-200 p-0.5">
            <button
              onClick={() => setViewMode('detail')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
                viewMode === 'detail' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <List className="h-4 w-4" /> 对象编辑
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
                viewMode === 'graph' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <Network className="h-4 w-4" /> 图视图
            </button>
          </div>
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
        {/* Design nav */}
        <aside className="flex w-44 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">设计</p>
          </div>
          <nav className="flex-1 p-2">
            <button
              onClick={() => setDesignSection('objects')}
              className={cn(
                'mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                designSection === 'objects' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <Box className="h-4 w-4" /> 对象
            </button>
            <button
              onClick={() => setDesignSection('properties')}
              className={cn(
                'mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                designSection === 'properties' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <Tag className="h-4 w-4" /> 属性
            </button>
            <button
              onClick={() => setDesignSection('relations')}
              className={cn(
                'mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                designSection === 'relations' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <Link2 className="h-4 w-4" /> 关系
            </button>
            <button
              onClick={() => setDesignSection('dictionaries')}
              className={cn(
                'mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                designSection === 'dictionaries' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <BookOpen className="h-4 w-4" /> 字典
            </button>
          </nav>
        </aside>

        {designSection === 'dictionaries' ? (
          <div className="flex-1 overflow-hidden">
            <DictionaryPanel
              dictionaries={dictionaries}
              onCreate={handleCreateDictionary}
              onBulkImport={handleBulkImportDictionaries}
              onDelete={handleDeleteDictionary}
              onUpdate={handleUpdateDictionary}
            />
          </div>
        ) : designSection === 'properties' ? (
          <div className="flex-1 overflow-hidden">
            <PropertyListPanel
              objects={objects}
              dictionaries={dictionaries}
              objectOptions={objectNames}
              onUpdateProperty={handleUpdateProperty}
              onCreateProperty={handleCreateProperty}
            />
          </div>
        ) : designSection === 'relations' ? (
          <div className="flex-1 overflow-hidden">
            <RelationListPanel
              objects={objects}
              objectOptions={objectNames}
              onUpdateRelation={handleUpdateRelation}
              onCreateRelation={handleCreateRelation}
            />
          </div>
        ) : (
          <>
        {/* Object sidebar */}
        <ObjectSidebar
          objects={objects}
          selectedKey={selectedObjectKey}
          onSelect={(key) => {
            setSelectedObjectKey(key)
            setViewMode('detail')
          }}
          search={objectSearch}
          onSearchChange={setObjectSearch}
          onAddObject={() => setShowCreateObject(true)}
        />

        {/* Main content */}
        {viewMode === 'detail' ? (
          <div className="flex-1 overflow-hidden">
            {selectedObject && (
              <ObjectDetailPanel
                object={selectedObject}
                objectOptions={objectNames}
                dictionaries={dictionaries}
                onUpdate={handleUpdateObject}
                onCreateProperty={handleCreateProperty}
                onAddRelation={() => setShowCreateRelation(true)}
              />
            )}
          </div>
        ) : (
          <div className="relative flex-1 p-4">
            <div className="absolute right-6 top-6 z-10 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><ZoomIn className="h-4 w-4" /></button>
              <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><ZoomOut className="h-4 w-4" /></button>
              <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><Maximize2 className="h-4 w-4" /></button>
            </div>
            <GraphCanvas
              nodes={graphData.nodes}
              edges={graphData.edges}
              selectedId={selectedObjectKey}
              onNodeClick={(nodeId) => {
                setSelectedObjectKey(nodeId)
                setViewMode('detail')
              }}
            />
          </div>
        )}
          </>
        )}
      </div>

      {/* Secondary actions bar for relations */}
      {designSection === 'objects' && viewMode === 'detail' && (
      <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-5 py-2">
        <span className="text-xs text-slate-400">
          本体建模包含：对象、属性、关系、字典 · 点击左侧切换设计视图
        </span>
      </div>
      )}

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
          ...objectNames.map((name) => ({ value: name, label: name })),
        ]}
      />
      <CreateRelationModal
        open={showCreateRelation}
        onClose={() => setShowCreateRelation(false)}
        onCreate={handleCreateRelation}
        objectOptions={objectNames}
      />
    </div>
  )
}
