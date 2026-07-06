import { useState } from 'react'
import { X, Search, BookOpen, Check } from 'lucide-react'
import { cn } from '../lib/utils'
import type { DictionaryInfo } from '../types/dictionary'

interface SelectDictionaryModalProps {
  open: boolean
  onClose: () => void
  onSelect: (dict: DictionaryInfo) => void
  dictionaries: DictionaryInfo[]
  currentDictId?: string
}

export function SelectDictionaryModal({ open, onClose, onSelect, dictionaries, currentDictId }: SelectDictionaryModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(currentDictId ?? null)

  const filtered = dictionaries.filter(
    (d) => !search || d.name.includes(search) || d.code.includes(search)
  )

  const handleConfirm = () => {
    const dict = dictionaries.find((d) => d.id === selected)
    if (dict) {
      onSelect(dict)
      handleClose()
    }
  }

  const handleClose = () => {
    setSearch('')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">选择字典</h2>
            <p className="text-sm text-slate-500">为属性关联码值字典，建立码值与展示名映射</p>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索字典名称或编码..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">暂无可用字典，请先在「字典」页创建</p>
            ) : filtered.map((dict) => (
              <button
                key={dict.id}
                onClick={() => setSelected(dict.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all',
                  selected === dict.id
                    ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                  selected === dict.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                )}>
                  {selected === dict.id && <Check className="h-3 w-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span className="font-medium text-slate-900">{dict.name}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{dict.code}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{dict.desc}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{dict.entryCount} 条码值</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">取消</button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={cn(
              'rounded-lg px-5 py-2 text-sm font-medium',
              selected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'cursor-not-allowed bg-slate-200 text-slate-400'
            )}
          >
            确认关联
          </button>
        </div>
      </div>
    </div>
  )
}
