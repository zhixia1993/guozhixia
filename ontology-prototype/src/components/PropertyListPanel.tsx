import { useState, useMemo } from 'react'
import { Tag, Search, Plus, BookOpen } from 'lucide-react'
import type { OntologyObject } from './ObjectDetailPanel'
import type { DictionaryInfo } from '../types/dictionary'
import { PropertyDetailPanel } from './PropertyDetailPanel'
import { CreatePropertyModal, type CreatePropertyData } from './CreatePropertyModal'
import { flattenProperties, type FlatProperty } from '../lib/ontologyModel'

interface PropertyListPanelProps {
  objects: OntologyObject[]
  dictionaries: DictionaryInfo[]
  onUpdateProperty: (objectKey: string, propertyId: string, updated: FlatProperty['property']) => void
  onCreateProperty?: (data: CreatePropertyData) => void
  objectOptions: string[]
}

export function PropertyListPanel({
  objects, dictionaries, onUpdateProperty, onCreateProperty, objectOptions,
}: PropertyListPanelProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<{ objectKey: string; propertyId: string } | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const allProps = useMemo(() => flattenProperties(objects), [objects])

  const filtered = allProps.filter(
    (p) => !search || p.property.name.includes(search) || (p.property.key ?? '').includes(search) || p.objectName.includes(search)
  )

  const selectedItem = selected
    ? allProps.find((p) => p.objectKey === selected.objectKey && p.property.id === selected.propertyId)
    : null

  const selectedObject = selectedItem
    ? objects.find((o) => o.key === selectedItem.objectKey)
    : null

  if (selectedItem && selectedObject) {
    return (
      <PropertyDetailPanel
        property={selectedItem.property}
        object={selectedObject}
        dictionaries={dictionaries}
        onBack={() => setSelected(null)}
        onUpdate={(updated) => onUpdateProperty(selectedItem.objectKey, selectedItem.property.id, updated)}
      />
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">属性</h3>
          <p className="text-xs text-slate-400">DataTypeProperties · 共 {allProps.length} 项</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Plus className="h-3.5 w-3.5" /> 添加
        </button>
      </div>
      <div className="border-b border-slate-100 px-5 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索属性名称、标识或所属对象..."
            className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <Tag className="mb-2 h-8 w-8 text-slate-200" />
            <p className="text-sm">暂无数据属性</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(({ property, objectKey, objectName }) => (
              <button
                key={`${objectKey}-${property.id}`}
                onClick={() => setSelected({ objectKey, propertyId: property.id })}
                className="group flex w-full items-start gap-3 px-5 py-3.5 text-left hover:bg-slate-50/80"
              >
                <Tag className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{property.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {objectName} · #{property.key ?? property.id}
                  </p>
                </div>
                <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500">
                  {property.type}
                </span>
                {property.dictionary && <BookOpen className="h-3.5 w-3.5 shrink-0 text-indigo-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
      <CreatePropertyModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={onCreateProperty}
        objectOptions={objectOptions}
      />
    </div>
  )
}
