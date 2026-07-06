import { useState, useMemo, useEffect } from 'react'
import { Tag, Search, Plus, BookOpen } from 'lucide-react'
import { cn } from '../lib/utils'
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

const typeLabel = (type: string) => {
  const map: Record<string, string> = {
    string: 'STR', int: 'INT', decimal: 'DEC', boolean: 'BOOL', enum: 'ENUM', date: 'DATE',
  }
  return map[type] ?? type.toUpperCase()
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

  useEffect(() => {
    if (!selected && filtered.length > 0) {
      const preferred = filtered.find((p) => p.property.id === 'acct_item_type_a')
      const first = preferred ?? filtered[0]
      setSelected({ objectKey: first.objectKey, propertyId: first.property.id })
    }
  }, [filtered, selected])

  const selectedItem = selected
    ? allProps.find((p) => p.objectKey === selected.objectKey && p.property.id === selected.propertyId)
    : null

  const selectedObject = selectedItem
    ? objects.find((o) => o.key === selectedItem.objectKey)
    : null

  return (
    <div className="flex h-full bg-white">
      {/* 属性列表 */}
      <div className="flex w-72 shrink-0 flex-col border-r border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">属性</h3>
            <p className="text-xs text-slate-400">DataTypeProperties</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" /> 添加
          </button>
        </div>
        <div className="border-b border-slate-100 px-4 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索属性..."
              className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <Tag className="mb-2 h-8 w-8 text-slate-200" />
              <p className="text-sm">暂无数据属性</p>
            </div>
          ) : (
            filtered.map(({ property, objectKey, objectName }) => {
              const isSelected = selected?.objectKey === objectKey && selected?.propertyId === property.id
              return (
                <button
                  key={`${objectKey}-${property.id}`}
                  onClick={() => setSelected({ objectKey, propertyId: property.id })}
                  className={cn(
                    'mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors',
                    isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <Tag className={cn('h-4 w-4 shrink-0', isSelected ? 'text-indigo-500' : 'text-sky-500')} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{property.name}</p>
                    <p className="truncate text-[10px] text-slate-400">{objectName}</p>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold',
                    isSelected ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-500'
                  )}>
                    {typeLabel(property.type)}
                  </span>
                  {property.dictionary && (
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* 属性详情 */}
      <div className="flex-1 overflow-hidden">
        {selectedItem && selectedObject ? (
          <PropertyDetailPanel
            property={selectedItem.property}
            object={selectedObject}
            dictionaries={dictionaries}
            embedded
            onUpdate={(updated) => onUpdateProperty(selectedItem.objectKey, selectedItem.property.id, updated)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <Tag className="mb-2 h-10 w-10 text-slate-200" />
            <p className="text-sm">选择左侧属性查看详情与字典关联</p>
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
