import { useState, useMemo } from 'react'
import { X, BookOpen, Tag, Hash, FileText, Globe, Wand2 } from 'lucide-react'
import { cn } from '../lib/utils'
import type { CreateDictionaryData } from '../types/dictionary'

interface CreateDictionaryModalProps {
  open: boolean
  onClose: () => void
  onCreate?: (data: CreateDictionaryData) => void
}

function slugifyDictType(name: string): string {
  const map: Record<string, string> = {
    状态: 'STATUS',
    类型: 'TYPE',
    帐目: 'ACCT',
  }
  for (const [zh, en] of Object.entries(map)) {
    if (name.includes(zh)) return en + '_TYPE'
  }
  return name
    .trim()
    .toUpperCase()
    .replace(/[\s\u4e00-\u9fff]+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 50) || 'DICT_TYPE'
}

export function CreateDictionaryModal({ open, onClose, onCreate }: CreateDictionaryModalProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [desc, setDesc] = useState('')

  const isNameValid = name.trim().length > 0
  const isCodeValid = /^[A-Z][A-Z0-9_]*$/.test(code) && code.length > 0
  const canSubmit = isNameValid && isCodeValid

  const validationMsg = useMemo(() => {
    if (!name.trim()) return '请填写字典名称'
    if (!isCodeValid) return '字典标识格式不正确（全大写英文下划线）'
    return ''
  }, [name, isCodeValid])

  const autoGenerateCode = () => {
    if (name.trim()) setCode(slugifyDictType(name))
  }

  const handleCodeChange = (val: string) => {
    setCode(val.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 50))
  }

  const resetForm = () => {
    setName('')
    setCode('')
    setDesc('')
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
      entries: [],
    })
    resetForm()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">新建字典类型</h2>
              <p className="mt-0.5 text-sm text-slate-500">定义新的业务枚举字典。</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* 图标 + 名称 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <p className="mb-2 text-xs font-medium text-slate-500">图标</p>
              <button
                type="button"
                className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 hover:border-violet-300 hover:bg-violet-50"
              >
                <BookOpen className="h-7 w-7 text-violet-500" />
              </button>
            </div>
            <div className="flex-1">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Tag className="h-3.5 w-3.5" /> 名称
              </label>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 30))}
                  placeholder="例如 状态"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <div className="flex shrink-0 items-center gap-2 border-l border-slate-200 bg-slate-50 px-3">
                  <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">@zh</span>
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* 字典标识 */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Hash className="h-3.5 w-3.5" /> 字典标识 (DictType)
            </label>
            <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
              <input
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="例如 STATUS"
                className="flex-1 px-3 py-2.5 font-mono text-sm outline-none"
              />
              <button
                type="button"
                onClick={autoGenerateCode}
                title="根据名称自动生成"
                className="flex shrink-0 items-center px-3 text-violet-500 hover:bg-violet-50"
              >
                <Wand2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">建议使用全大写英文下划线格式。</p>
          </div>

          {/* 说明 */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <FileText className="h-3.5 w-3.5" /> 说明
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="描述字典的用途..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
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
                canSubmit
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              )}
            >
              创建
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
