import { useState, useMemo } from 'react'
import { Link2, Search, Plus } from 'lucide-react'
import type { OntologyObject, ObjectRelation } from './ObjectDetailPanel'
import { RelationDetailPanel } from './RelationDetailPanel'
import { CreateRelationModal } from './CreateRelationModal'
import { flattenRelations } from '../lib/ontologyModel'

interface RelationListPanelProps {
  objects: OntologyObject[]
  onUpdateRelation: (domainKey: string, relationId: string, updated: ObjectRelation) => void
  onCreateRelation?: (data: {
    name: string; key: string; domain: string; range: string; comment: string; llmDesc: string
  }) => void
  objectOptions: string[]
}

export function RelationListPanel({
  objects, onUpdateRelation, onCreateRelation, objectOptions,
}: RelationListPanelProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<{ domainKey: string; relationId: string } | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const allRels = useMemo(() => flattenRelations(objects), [objects])

  const filtered = allRels.filter(
    (r) => !search || r.relation.name.includes(search) || r.domainName.includes(search) || r.relation.target.includes(search)
  )

  const selectedItem = selected
    ? allRels.find((r) => r.domainKey === selected.domainKey && r.relation.id === selected.relationId)
    : null

  const domainObject = selectedItem
    ? objects.find((o) => o.key === selectedItem.domainKey)
    : null

  if (selectedItem && domainObject) {
    return (
      <RelationDetailPanel
        relation={selectedItem.relation}
        domainObject={domainObject}
        rangeName={selectedItem.relation.target}
        onBack={() => setSelected(null)}
        onUpdate={(updated) => onUpdateRelation(selectedItem.domainKey, selectedItem.relation.id, updated)}
      />
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">关系</h3>
          <p className="text-xs text-slate-400">ObjectProperties · 共 {allRels.length} 项</p>
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
            placeholder="搜索关系名称、定义域或值域..."
            className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <Link2 className="mb-2 h-8 w-8 text-slate-200" />
            <p className="text-sm">暂无关系</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(({ relation, domainKey, domainName }) => (
              <button
                key={`${domainKey}-${relation.id}`}
                onClick={() => setSelected({ domainKey, relationId: relation.id })}
                className="group flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50/80"
              >
                <Link2 className="h-4 w-4 shrink-0 text-blue-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{relation.name}</p>
                  <p className="text-xs text-slate-400">
                    {domainName} → {relation.target}
                    {relation.key && <span className="ml-1 font-mono text-slate-300">#{relation.key}</span>}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <CreateRelationModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={onCreateRelation}
        objectOptions={objectOptions}
      />
    </div>
  )
}
