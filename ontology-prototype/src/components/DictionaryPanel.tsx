import { useState, useRef, useEffect } from 'react'
import { BookOpen, Plus, ChevronDown, Search, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'
import type { DictionaryInfo, CreateDictionaryData, DictionaryEntry } from '../types/dictionary'
import { CreateDictionaryModal } from './CreateDictionaryModal'
import { BulkImportDictionaryModal } from './BulkImportDictionaryModal'

interface DictionaryPanelProps {
  dictionaries: DictionaryInfo[]
  onCreate: (data: CreateDictionaryData) => void
  onBulkImport: (items: CreateDictionaryData[]) => void
  onDelete?: (dictId: string) => void
  onUpdate?: (dict: DictionaryInfo) => void
}

export function DictionaryPanel({ dictionaries, onCreate, onBulkImport, onDelete, onUpdate }: DictionaryPanelProps) {
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newEntryCode, setNewEntryCode] = useState('')
  const [newEntryName, setNewEntryName] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const prevDictCount = useRef(dictionaries.length)

  const filtered = dictionaries.filter(
    (d) => !search || d.name.includes(search) || d.code.includes(search)
  )

  const selected = dictionaries.find((d) => d.id === selectedId) ?? filtered[0]

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCreateMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (dictionaries.length > prevDictCount.current) {
      setSelectedId(dictionaries[dictionaries.length - 1].id)
    }
    prevDictCount.current = dictionaries.length
  }, [dictionaries])

  const handleAddEntry = () => {
    if (!selected || !onUpdate || !newEntryCode.trim() || !newEntryName.trim()) return
    const entry: DictionaryEntry = { code: newEntryCode.trim(), displayName: newEntryName.trim() }
    if (selected.entries.some((e) => e.code === entry.code)) return
    const entries = [...selected.entries, entry]
    onUpdate({ ...selected, entries, entryCount: entries.length })
    setNewEntryCode('')
    setNewEntryName('')
  }

  const handleRemoveEntry = (code: string) => {
    if (!selected || !onUpdate) return
    const entries = selected.entries.filter((e) => e.code !== code)
    onUpdate({ ...selected, entries, entryCount: entries.length })
  }

  if (dictionaries.length === 0) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <BookOpen className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">暂无字典</h2>
          <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-slate-500">
            在此定义业务枚举字典 (Dictionary)。字典包含一组标准的键值对，用于规范化字段取值。
          </p>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowCreateMenu((v) => !v)}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              新建字典
              <ChevronDown className={cn('h-4 w-4 transition-transform', showCreateMenu && 'rotate-180')} />
            </button>

            {showCreateMenu && (
              <div className="absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                <button
                  onClick={() => {
                    setShowCreateMenu(false)
                    setShowCreateModal(true)
                  }}
                  className="flex w-full flex-col px-4 py-3 text-left hover:bg-slate-50"
                >
                  <span className="text-sm font-semibold text-slate-900">新建字典类型</span>
                  <span className="mt-0.5 text-xs text-slate-400">使用弹窗创建单个字典</span>
                </button>
                <button
                  onClick={() => {
                    setShowCreateMenu(false)
                    setShowImportModal(true)
                  }}
                  className="flex w-full flex-col px-4 py-3 text-left hover:bg-slate-50"
                >
                  <span className="text-sm font-semibold text-slate-900">批量导入字典</span>
                  <span className="mt-0.5 text-xs text-slate-400">上传 CSV 批量导入字典与码值</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <CreateDictionaryModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreate}
        />
        <BulkImportDictionaryModal
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={onBulkImport}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full bg-white">
      {/* Dictionary list */}
      <div className="flex w-72 shrink-0 flex-col border-r border-slate-200">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">字典</h3>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowCreateMenu((v) => !v)}
                className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800"
              >
                <Plus className="h-3.5 w-3.5" /> 新建
                <ChevronDown className="h-3 w-3" />
              </button>
              {showCreateMenu && (
                <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                  <button
                    onClick={() => { setShowCreateMenu(false); setShowCreateModal(true) }}
                    className="flex w-full flex-col px-4 py-2.5 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm font-semibold text-slate-900">新建字典类型</span>
                    <span className="text-xs text-slate-400">使用弹窗创建单个字典</span>
                  </button>
                  <button
                    onClick={() => { setShowCreateMenu(false); setShowImportModal(true) }}
                    className="flex w-full flex-col px-4 py-2.5 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm font-semibold text-slate-900">批量导入字典</span>
                    <span className="text-xs text-slate-400">上传 CSV 批量导入字典与码值</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索字典..."
              className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.map((dict) => (
            <button
              key={dict.id}
              onClick={() => setSelectedId(dict.id)}
              className={cn(
                'mb-0.5 flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors',
                selected?.id === dict.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{dict.name}</p>
                <p className="font-mono text-[10px] text-slate-400">{dict.code}</p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                {dict.entryCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary detail */}
      {selected && (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                <p className="mt-1 font-mono text-sm text-slate-500">{selected.code}</p>
                {selected.desc && <p className="mt-1 text-sm text-slate-500">{selected.desc}</p>}
              </div>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(selected.id)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" /> 删除
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 border-b border-slate-100 bg-slate-50/80 px-6 py-2 text-xs font-medium text-slate-500">
            <span>码值</span>
            <span>展示名</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {selected.entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <p className="text-sm text-slate-500">暂无码值，请添加键值对</p>
                <p className="mt-1 text-xs text-slate-400">创建字典类型后，在此维护码值与展示名</p>
              </div>
            ) : (
              selected.entries.map((entry) => (
                <div key={entry.code} className="group grid grid-cols-2 gap-2 border-b border-slate-50 px-6 py-3 hover:bg-slate-50/50">
                  <span className="font-mono text-sm text-slate-800">{entry.code}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{entry.displayName}</span>
                    {onUpdate && (
                      <button
                        onClick={() => handleRemoveEntry(entry.code)}
                        className="rounded p-1 text-slate-300 opacity-0 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {onUpdate && (
            <div className="border-t border-slate-100 px-6 py-4">
              <p className="mb-2 text-xs font-medium text-slate-500">添加码值</p>
              <div className="flex gap-2">
                <input
                  value={newEntryCode}
                  onChange={(e) => setNewEntryCode(e.target.value)}
                  placeholder="码值"
                  className="w-28 rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:border-violet-400"
                />
                <input
                  value={newEntryName}
                  onChange={(e) => setNewEntryName(e.target.value)}
                  placeholder="展示名"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEntry()}
                />
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntryCode.trim() || !newEntryName.trim()}
                  className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  <Plus className="h-4 w-4" /> 添加
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <CreateDictionaryModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={onCreate}
      />
      <BulkImportDictionaryModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={onBulkImport}
      />
    </div>
  )
}
