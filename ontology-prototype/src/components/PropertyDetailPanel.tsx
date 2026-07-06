import { useState } from 'react'
import {
  ArrowLeft, Tag, Sparkles, BookOpen, Unlink,
} from 'lucide-react'
import type { DataProperty, OntologyObject, PropertyConstraints } from './ObjectDetailPanel'
import { SelectDictionaryModal, type DictionaryInfo } from './SelectDictionaryModal'

interface PropertyDetailPanelProps {
  property: DataProperty
  object: OntologyObject
  onBack: () => void
  onUpdate: (property: DataProperty) => void
}

const xsdTypeMap: Record<string, string> = {
  string: 'xsd:string',
  int: 'xsd:integer',
  decimal: 'xsd:decimal',
  boolean: 'xsd:boolean',
  date: 'xsd:date',
  datetime: 'xsd:dateTime',
  enum: 'xsd:string',
}

export function PropertyDetailPanel({ property, object, onBack, onUpdate }: PropertyDetailPanelProps) {
  const [showDictModal, setShowDictModal] = useState(false)
  const [constraints, setConstraints] = useState<PropertyConstraints>(
    property.constraints ?? { mandatory: false }
  )

  const handleSelectDictionary = (dict: DictionaryInfo) => {
    onUpdate({
      ...property,
      dictionary: {
        dictId: dict.id,
        dictName: dict.name,
        dictCode: dict.code,
        entries: dict.entries,
      },
    })
  }

  const handleUnbindDict = () => {
    onUpdate({ ...property, dictionary: undefined })
  }

  const handleSaveConstraints = () => {
    onUpdate({ ...property, constraints })
  }

  const xsdType = xsdTypeMap[property.type] ?? 'xsd:string'

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <button
          onClick={onBack}
          className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> 返回结构
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500">
            <Tag className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{property.name}</h2>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                #{property.key ?? property.id}
              </span>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                {property.type}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              继承自: <span className="font-medium text-slate-700">{property.parent ?? 'topDataProperty (Root)'}</span>
            </p>
          </div>
        </div>

        {/* Domain → Property → Range */}
        <div className="mt-5 flex items-center justify-center gap-3 rounded-xl bg-slate-50 py-4">
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-center">
            <p className="text-[10px] font-medium uppercase text-orange-500">Domain</p>
            <p className="text-sm font-semibold text-orange-800">{object.name}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-px w-8 border-t-2 border-dashed border-slate-300" />
            <span className="my-1 rounded bg-violet-100 px-2 py-0.5 font-mono text-[10px] text-violet-700">
              {property.key ?? property.id}
            </span>
            <div className="h-px w-8 border-t-2 border-dashed border-slate-300" />
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-center">
            <p className="text-[10px] font-medium uppercase text-blue-500">Range</p>
            <p className="text-sm font-semibold text-blue-800">{property.type}</p>
            <p className="font-mono text-[10px] text-blue-500">{xsdType}</p>
          </div>
        </div>
      </div>

      {/* Two panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Constraints */}
        <div className="flex w-1/2 flex-col border-r border-slate-200">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-semibold text-slate-900">属性与约束配置</h3>
            <p className="text-xs text-slate-400">Constraints</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Cardinality</p>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={constraints.mandatory}
                  onChange={(e) => setConstraints({ ...constraints, mandatory: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600"
                />
                Mandatory（必填）
              </label>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Value Facets</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Min Length</label>
                  <input
                    type="number"
                    value={constraints.minLength ?? ''}
                    onChange={(e) => setConstraints({ ...constraints, minLength: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    placeholder="—"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Max Length</label>
                  <input
                    type="number"
                    value={constraints.maxLength ?? ''}
                    onChange={(e) => setConstraints({ ...constraints, maxLength: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    placeholder="—"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Regex Pattern</p>
              <div className="flex gap-2">
                <input
                  value={constraints.regexPattern ?? ''}
                  onChange={(e) => setConstraints({ ...constraints, regexPattern: e.target.value })}
                  placeholder="正则模式"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-400"
                />
                <button className="flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 hover:bg-violet-100">
                  <Sparkles className="h-3.5 w-3.5" /> AI Generate
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 p-4">
            <button
              onClick={handleSaveConstraints}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              保存约束
            </button>
          </div>
        </div>

        {/* Dictionary mapping */}
        <div className="flex w-1/2 flex-col">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-semibold text-slate-900">字段字典对应</h3>
          </div>

          {!property.dictionary ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <BookOpen className="h-7 w-7 text-slate-300" />
              </div>
              <p className="mb-2 text-sm font-medium text-slate-700">当前属性未关联字典</p>
              <p className="mb-6 text-center text-xs leading-relaxed text-slate-400">
                选择字典后，此处将展示该属性的码值与展示名对应关系
              </p>
              <button
                onClick={() => setShowDictModal(true)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                选择字典
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-slate-900">{property.dictionary.dictName}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                    {property.dictionary.dictCode}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDictModal(true)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    更改
                  </button>
                  <button
                    onClick={handleUnbindDict}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600"
                  >
                    <Unlink className="h-3 w-3" /> 解绑
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b border-slate-100 bg-slate-50/80 px-5 py-2 text-xs font-medium text-slate-500">
                <span>码值</span>
                <span>展示名</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {property.dictionary.entries.map((entry) => (
                  <div key={entry.code} className="grid grid-cols-2 gap-2 border-b border-slate-50 px-5 py-2.5 hover:bg-slate-50/50">
                    <span className="font-mono text-sm text-slate-800">{entry.code}</span>
                    <span className="text-sm text-slate-600">{entry.displayName}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <SelectDictionaryModal
        open={showDictModal}
        onClose={() => setShowDictModal(false)}
        onSelect={handleSelectDictionary}
        currentDictId={property.dictionary?.dictId}
      />
    </div>
  )
}
