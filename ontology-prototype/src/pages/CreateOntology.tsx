import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, X, Box, Fingerprint, Globe, Tag, FileText,
  GitBranch, Wand2, ArrowRight, Sun,
} from 'lucide-react'
import { cn } from '../lib/utils'

const suggestedTags = ['企业', '医疗', '金融', '法律', '教育', '电商', '政府', '通用']

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fff]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 50)
}

export function CreateOntology() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [namespace, setNamespace] = useState('http://www.example.com')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [version] = useState('0.1')

  const keySuffix = key || 'unique_key'

  const isNameValid = name.trim().length > 0 && name.length <= 50
  const isKeyValid = /^[a-z0-9_]+$/.test(key) && key.length > 0 && key.length <= 50
  const isDescValid = description.length <= 100
  const canSubmit = isNameValid && isKeyValid && isDescValid

  const validationMsg = useMemo(() => {
    if (!name.trim()) return '本体名称、唯一标识不能为空'
    if (!key.trim()) return '本体名称、唯一标识不能为空'
    if (!isKeyValid) return '唯一标识仅支持英文、数字、下划线'
    if (!isDescValid) return '描述说明不能超过 100 字'
    return ''
  }, [name, key, isKeyValid, isDescValid])

  const autoGenerateKey = () => {
    if (name.trim()) {
      const generated = slugify(name) || 'unique_key'
      setKey(generated.slice(0, 50))
    }
  }

  const handleKeyChange = (val: string) => {
    setKey(val.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 50))
  }

  const addTag = (tag: string) => {
    const t = tag.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const handleCreate = () => {
    if (!canSubmit) return
    navigate(`/modeling/manual/${key}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
        <div className="flex items-start gap-4">
          <Link
            to="/modeling"
            className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">创建空白本体</h1>
            <p className="mt-1 text-sm text-slate-500">
              配置本体的基础信息，后续可在设计器中完善细节
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/modeling')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column */}
        <div className="flex w-[55%] flex-col overflow-y-auto border-r border-slate-200 p-8">
          <div className="mx-auto w-full max-w-lg space-y-6">
            {/* 本体名称 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Box className="h-4 w-4 text-slate-400" />
                本体名称
              </label>
              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 50))}
                  placeholder="例如：企业知识图谱"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-14 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {name.length}/50
                </span>
              </div>
            </div>

            {/* 唯一标识 KEY */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Fingerprint className="h-4 w-4 text-slate-400" />
                唯一标识 KEY
              </label>
              <p className="mb-2 text-xs text-slate-400">仅支持英文、数字、下划线</p>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
                <span className="flex shrink-0 items-center bg-violet-50 px-3 text-sm font-medium text-violet-600">
                  ontology_
                </span>
                <input
                  value={key}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  placeholder="unique_key"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <button
                  onClick={autoGenerateKey}
                  title="自动生成"
                  className="flex shrink-0 items-center px-3 text-violet-500 hover:bg-violet-50"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
                <span className="flex shrink-0 items-center px-3 text-xs text-slate-400">
                  {key.length}/50
                </span>
              </div>
            </div>

            {/* 命名空间 */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Globe className="h-4 w-4 text-slate-400" />
                命名空间
              </label>
              <p className="mb-2 text-xs text-slate-400">推荐使用公司域名或项目名作为前缀</p>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
                <input
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  placeholder="http://www.example.com"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <span className="flex shrink-0 items-center bg-slate-100 px-3 font-mono text-sm text-slate-500">
                  /{keySuffix}
                </span>
              </div>
            </div>

            {/* 业务标签 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Tag className="h-4 w-4 text-slate-400" />
                业务标签
              </label>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="输入标签后回车..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                    >
                      {t}
                      <button onClick={() => setTags(tags.filter((x) => x !== t))} className="text-violet-400 hover:text-violet-600">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestedTags
                  .filter((t) => !tags.includes(t))
                  .map((t) => (
                    <button
                      key={t}
                      onClick={() => addTag(t)}
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                    >
                      + {t}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex w-[45%] flex-col overflow-y-auto bg-slate-50/50 p-8">
          <div className="mx-auto w-full max-w-md space-y-6">
            {/* 描述说明 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="h-4 w-4 text-slate-400" />
                描述说明
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                  rows={8}
                  placeholder="请简要描述该本体的业务背景、应用场景以及预期的核心能力..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <span className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {description.length}/100
                </span>
              </div>
            </div>

            {/* 版本号 */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                <GitBranch className="h-4 w-4 text-slate-400" />
                版本号
              </label>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono">HEAD</span>
                  <span>→</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-white">main</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">v</span>
                    <input
                      value={version}
                      readOnly
                      className="w-16 rounded border border-slate-200 px-2 py-1 text-sm font-medium outline-none"
                    />
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    <Sun className="h-3.5 w-3.5" />
                    Draft
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  首次创建默认开启草稿模式（Draft Mode）
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <div>
          {!canSubmit && validationMsg && (
            <p className="flex items-center gap-1.5 text-sm text-red-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {validationMsg}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/modeling')}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className={cn(
              'flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all',
              canSubmit
                ? 'bg-slate-800 text-white hover:bg-slate-900'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            )}
          >
            创建本体
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
