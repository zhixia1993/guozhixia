import { useState, useMemo } from 'react'
import { X, BookOpen, Wand2, Plus, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'
import type { CreateDictionaryData, DictionaryEntry } from '../types/dictionary'

interface CreateDictionaryModalProps {
  open: boolean
  onClose: () => void
  onCreate?: (data: CreateDictionaryData) => void
}

function slugifyCode(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[\s\u4e00-\u9fff]+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 50) || 'DICT_CODE'
}

const emptyEntry = (): DictionaryEntry => ({ code: '', displayName: '' })

export function CreateDictionaryModal({ open, onClose, onCreate }: CreateDictionaryModalProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [desc, setDesc] = useState('')
  const [entries, setEntries] = useState<DictionaryEntry[]>([emptyEntry(), emptyEntry()])

  const isNameValid = name.trim().length > 0
  const isCodeValid = /^[A-Z][A-Z0-9_]*$/.test(code) && code.length > 0
  const validEntries = entries.filter((e) => e.code.trim() && e.displayName.trim())
  const canSubmit = isNameValid && isCodeValid && validEntries.length > 0

  const validationMsg = useMemo(() => {
    if (!name.trim()) return '请填写字典名称'
    if (!isCodeValid) return '字典编码格式不正确（大写字母开头）'
    if (validEntries.length === 0) return '请至少添加一条码值'
    return ''
  }, [name, isCodeValid, validEntries.length])

  const autoGenerateCode = () => {
    if (name.trim()) setCode(slugifyCode(name))
  }

  const handleCodeChange = (val: string) => {
    setCode(val.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 50))
  }

  const updateEntry = (index: number, field: keyof DictionaryEntry, value: string) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)))
  }

  const addEntry = () => setEntries((prev) => [...prev, emptyEntry()])

  const removeEntry = (index: number) => {
    if (entries.length <= 1) return
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setName('')
    setCode('')
    setDesc('')
    setEntries([emptyEntry(), emptyEntry()])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleCreate = () => {
    if (!canSubmit) return
    onCreate?.({
      name: name.trim(),
      code,
      desc: desc.trim(),
      entries: validEntries,
    })
    resetForm()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">新建字典</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                定义业务枚举字典，包含一组标准的键值对，用于规范化字段取值。
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700">
                字典名称 <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：帐目类型字典"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700">
                字典编码 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="ACCT_ITEM_TYPE"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={autoGenerateCode}
                  className="flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-3 text-xs font-medium text-violet-700 hover:bg-violet-100"
                >
                  <Wand2 className="h-3.5 w-3.5" /> 生成
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">描述</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              placeholder="字典用途说明..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">码值列表</p>
                <p className="text-xs text-slate-400">码值与展示名的对应关系</p>
              </div>
              <button
                type="button"
                onClick={addEntry}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" /> 添加码值
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-[1fr_1fr_40px] gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
                <span>码值</span>
                <span>展示名</span>
                <span />
              </div>
              <div className="divide-y divide-slate-50">
                {entries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_40px] gap-2 px-4 py-2">
                    <input
                      value={entry.code}
                      onChange={(e) => updateEntry(index, 'code', e.target.value)}
                      placeholder="01"
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono text-sm outline-none focus:border-indigo-400"
                    />
                    <input
                      value={entry.displayName}
                      onChange={(e) => updateEntry(index, 'displayName', e.target.value)}
                      placeholder="语音通话费"
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-indigo-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      disabled={entries.length <= 1}
                      className="flex items-center justify-center rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">{validationMsg}</p>
          <div className="flex gap-3">
            <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={!canSubmit}
              className={cn(
                'rounded-lg px-5 py-2 text-sm font-medium',
                canSubmit ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'cursor-not-allowed bg-slate-200 text-slate-400'
              )}
            >
              创建字典
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
