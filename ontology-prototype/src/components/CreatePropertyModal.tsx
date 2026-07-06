import { useState, useMemo, useEffect } from 'react'
import { X, Tag, Wand2, Globe, Plus, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

export interface CreatePropertyData {
  name: string
  key: string
  domain: string
  type: string
  comment: string
}

interface CreatePropertyModalProps {
  open: boolean
  onClose: () => void
  onCreate?: (data: CreatePropertyData) => void
  objectOptions: string[]
  defaultDomain?: string
}

const dataTypes = [
  { value: 'string', label: 'String 文本' },
  { value: 'int', label: 'Integer 整数' },
  { value: 'decimal', label: 'Decimal 小数' },
  { value: 'boolean', label: 'Boolean 布尔' },
  { value: 'date', label: 'Date 日期' },
  { value: 'datetime', label: 'DateTime 日期时间' },
  { value: 'enum', label: 'Enum 枚举' },
]

function slugifyKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fff]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 50) || 'propertyKey'
}

export function CreatePropertyModal({
  open,
  onClose,
  onCreate,
  objectOptions,
  defaultDomain = '',
}: CreatePropertyModalProps) {
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [domain, setDomain] = useState(defaultDomain)
  const [dataType, setDataType] = useState('string')
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (open && defaultDomain) setDomain(defaultDomain)
  }, [open, defaultDomain])

  const isNameValid = name.trim().length > 0 && name.length <= 50
  const isKeyValid = /^[a-z][a-z0-9_]*$/.test(key) && key.length > 0
  const isDomainValid = domain.length > 0
  const canSubmit = isNameValid && isKeyValid && isDomainValid

  const validationMsg = useMemo(() => {
    if (!domain) return '请先选择所属对象'
    if (!name.trim() || !key.trim()) return '请完善基本信息'
    if (!isKeyValid) return '唯一标识 Key 格式不正确'
    return ''
  }, [domain, name, key, isKeyValid])

  const autoGenerateKey = () => {
    if (name.trim()) setKey(slugifyKey(name))
  }

  const handleKeyChange = (val: string) => {
    setKey(val.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 50))
  }

  const handleCreate = () => {
    if (!canSubmit) return
    onCreate?.({ name: name.trim(), key, domain, type: dataType, comment })
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setName('')
    setKey('')
    setDomain(defaultDomain)
    setDataType('string')
    setComment('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-md shadow-blue-200">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">新建属性 (DataType Property)</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                定义数据属性，需先选择所属对象。属性用于描述该类型的具体特征。
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* 图标 + 属性名称 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <p className="mb-2 text-xs font-medium text-slate-500">图标</p>
              <button className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <Tag className="h-7 w-7 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-xs font-medium text-slate-500">
                属性名称 <span className="text-slate-400">(rdfs:label)</span>
              </label>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 50))}
                  placeholder="例如：姓名"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <div className="flex shrink-0 items-center gap-2 border-l border-slate-200 bg-slate-50 px-3">
                  <span className="text-xs text-slate-400">{name.length}/50</span>
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">@zh</span>
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* 所属对象 */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">
              所属对象 <span className="text-red-500">*</span>{' '}
              <span className="font-normal text-slate-400">(rdfs:domain)</span>
            </label>
            <div className="relative">
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className={cn(
                  'w-full appearance-none rounded-lg border py-2.5 pl-3 pr-10 text-sm outline-none focus:ring-2',
                  !domain
                    ? 'border-red-300 text-slate-400 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 text-slate-900 focus:border-blue-400 focus:ring-blue-100'
                )}
              >
                <option value="">请选择所属对象...</option>
                {objectOptions.map((obj) => (
                  <option key={obj} value={obj}>{obj}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            {!domain && (
              <p className="mt-1.5 text-xs text-red-500">所属对象为必填项，请先选择</p>
            )}
          </div>

          {/* Key + 数据类型 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500"># 唯一标识 Key</label>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                <span className="flex shrink-0 items-center bg-slate-50 px-2 text-sm text-slate-400">#</span>
                <input
                  value={key}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  placeholder="propertyKey"
                  className="flex-1 px-2 py-2.5 font-mono text-sm outline-none"
                />
                <button
                  onClick={autoGenerateKey}
                  title="自动生成"
                  className="flex shrink-0 items-center px-2.5 text-blue-500 hover:bg-blue-50"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">数据类型</label>
              <div className="relative">
                <select
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-3 pr-10 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  {dataTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* 备注 */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">
              备注 <span className="text-slate-400">(rdfs:comment)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="可选注释..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
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
            <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={!canSubmit}
              className={cn(
                'flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all',
                canSubmit
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              )}
            >
              <Plus className="h-4 w-4" />
              创建属性
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
