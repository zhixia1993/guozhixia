import { useState, useMemo } from 'react'
import { X, Box, Wand2, Globe, ArrowRight, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

interface CreateObjectModalProps {
  open: boolean
  onClose: () => void
  onCreate?: (data: { name: string; key: string; parent: string; comment: string; llmDesc: string }) => void
  parentOptions?: { value: string; label: string }[]
}

function slugifyKey(name: string): string {
  return name
    .trim()
    .replace(/[\s\u4e00-\u9fff]+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^./, (c) => c.toUpperCase())
    .slice(0, 30) || 'NewObjectKey'
}

export function CreateObjectModal({
  open,
  onClose,
  onCreate,
  parentOptions = [
    { value: 'Thing', label: 'Thing (Root)' },
    { value: '用户', label: '用户' },
    { value: '账户', label: '账户' },
  ],
}: CreateObjectModalProps) {
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [parent, setParent] = useState('Thing')
  const [descTab, setDescTab] = useState<'comment' | 'llmDesc'>('comment')
  const [comment, setComment] = useState('')
  const [llmDesc, setLlmDesc] = useState('')

  const isNameValid = name.trim().length > 0 && name.length <= 20
  const isKeyValid = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key) && key.length > 0
  const canSubmit = isNameValid && isKeyValid

  const validationMsg = useMemo(() => {
    if (!name.trim() || !key.trim()) return '请完善基本信息'
    if (!isKeyValid) return '唯一标识 Key 格式不正确'
    return ''
  }, [name, key, isKeyValid])

  const autoGenerateKey = () => {
    if (name.trim()) setKey(slugifyKey(name))
  }

  const handleKeyChange = (val: string) => {
    setKey(val.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30))
  }

  const handleCreate = () => {
    if (!canSubmit) return
    onCreate?.({ name: name.trim(), key, parent, comment, llmDesc })
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setName('')
    setKey('')
    setParent('Thing')
    setComment('')
    setLlmDesc('')
    setDescTab('comment')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md shadow-orange-200">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">新建对象 (Class)</h2>
              <p className="mt-0.5 text-sm text-slate-500">定义业务对象及其属性结构</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* 图标 + 名称 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <p className="mb-2 text-xs font-medium text-slate-500">图标</p>
              <button className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-sm hover:shadow-md transition-shadow">
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-xs font-medium text-slate-500">
                名称 <span className="text-slate-400">(rdfs:label)</span>
              </label>
              <div className="relative flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  placeholder="新对象名称"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <div className="flex shrink-0 items-center gap-2 border-l border-slate-200 bg-slate-50 px-3">
                  <span className="text-xs text-slate-400">{name.length}/20</span>
                  <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">@zh</span>
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* 唯一标识 Key */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">唯一标识 Key</label>
            <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
              <span className="flex shrink-0 items-center bg-slate-50 px-3 text-sm text-slate-400">#</span>
              <input
                value={key}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="NewObjectKey"
                className="flex-1 px-2 py-2.5 font-mono text-sm outline-none"
              />
              <button
                onClick={autoGenerateKey}
                title="自动生成"
                className="flex shrink-0 items-center px-3 text-violet-500 hover:bg-violet-50"
              >
                <Wand2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 继承自 */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">
              继承自 <span className="text-slate-400">(rdfs:subClassOf)</span>
            </label>
            <div className="relative">
              <Box className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                {parentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* 描述 Tabs */}
          <div>
            <div className="mb-3 flex gap-4 border-b border-slate-200">
              <button
                onClick={() => setDescTab('comment')}
                className={cn(
                  'pb-2.5 text-sm font-medium transition-colors',
                  descTab === 'comment'
                    ? 'border-b-2 border-violet-600 text-violet-700'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                简短注释 <span className="text-slate-400 font-normal">(rdfs:comment)</span>
              </button>
              <button
                onClick={() => setDescTab('llmDesc')}
                className={cn(
                  'pb-2.5 text-sm font-medium transition-colors',
                  descTab === 'llmDesc'
                    ? 'border-b-2 border-violet-600 text-violet-700'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                语义描述 <span className="text-slate-400 font-normal">(exann:llmDesc)</span>
              </button>
            </div>
            {descTab === 'comment' ? (
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="简要描述该类型的业务含义 (Human Readable)..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            ) : (
              <textarea
                value={llmDesc}
                onChange={(e) => setLlmDesc(e.target.value)}
                rows={4}
                placeholder="面向 LLM 的语义描述，用于智能推理与问答..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <div>
            {!canSubmit && (
              <p className="flex items-center gap-1.5 text-sm text-red-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {validationMsg}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={!canSubmit}
              className={cn(
                'flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all',
                canSubmit
                  ? 'bg-slate-800 text-white hover:bg-slate-900'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              )}
            >
              创建对象
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
