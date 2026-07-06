import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Play, Trash2, Plus, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type AuthType = 'none' | 'bearer' | 'apikey' | 'basic'
type ParamTab = 'path' | 'query' | 'headers'

interface ParamRow {
  id: string
  name: string
  value: string
  desc: string
}

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const authOptions: { key: AuthType; label: string }[] = [
  { key: 'none', label: '无鉴权' },
  { key: 'bearer', label: 'Bearer' },
  { key: 'apikey', label: 'API Key' },
  { key: 'basic', label: 'Basic' },
]

const mockResponse = `{
  "key": "demo-key-001",
  "valid": true,
  "expiresAt": "2026-12-31T23:59:59Z",
  "owner": "admin"
}`

function parsePathParams(url: string): string[] {
  const matches = url.match(/\{([^}]+)\}/g)
  return matches ? matches.map((m) => m.slice(1, -1)) : []
}

let paramId = 0
function newParam(name = '', value = '', desc = ''): ParamRow {
  return { id: `p-${++paramId}`, name, value, desc }
}

export function DataAccessApi() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState('http://localhost:3001/app/check-key/{key}')
  const [auth, setAuth] = useState<AuthType>('none')
  const [paramTab, setParamTab] = useState<ParamTab>('query')
  const [pathParams, setPathParams] = useState<ParamRow[]>([newParam('key', '', '')])
  const [queryParams, setQueryParams] = useState<ParamRow[]>([newParam('', '', '')])
  const [headerParams, setHeaderParams] = useState<ParamRow[]>([newParam('', '', '')])
  const [sending, setSending] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [responseMeta, setResponseMeta] = useState<{ status: number; time: number } | null>(null)

  const syncPathParams = useCallback((newUrl: string) => {
    const names = parsePathParams(newUrl)
    setPathParams((prev) =>
      names.map((n) => {
        const existing = prev.find((p) => p.name === n)
        return existing ?? newParam(n, '', '')
      })
    )
  }, [])

  useEffect(() => {
    syncPathParams(url)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUrlChange = (val: string) => {
    setUrl(val)
    syncPathParams(val)
  }

  const handleUrlBlur = () => syncPathParams(url)

  const currentParams = paramTab === 'path' ? pathParams : paramTab === 'query' ? queryParams : headerParams
  const setCurrentParams = paramTab === 'path' ? setPathParams : paramTab === 'query' ? setQueryParams : setHeaderParams

  const updateParam = (id: string, field: keyof ParamRow, val: string) => {
    setCurrentParams((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: val } : p)))
  }

  const removeParam = (id: string) => {
    setCurrentParams((prev) => prev.filter((p) => p.id !== id))
  }

  const addParam = () => {
    setCurrentParams((prev) => [...prev, newParam()])
  }

  const sendRequest = () => {
    setSending(true)
    setResponse(null)
    setResponseMeta(null)
    setTimeout(() => {
      setSending(false)
      setResponse(mockResponse)
      setResponseMeta({ status: 200, time: 86 })
    }, 1200)
  }

  const paramTabs: { key: ParamTab; label: string; count: number }[] = [
    { key: 'path', label: 'Path', count: pathParams.length },
    { key: 'query', label: 'Query', count: queryParams.filter((p) => p.name).length },
    { key: 'headers', label: 'Headers', count: headerParams.filter((p) => p.name).length },
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
        <div className="flex items-start gap-4">
          <Link
            to="/modeling/data-access"
            className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">新建 API 接口</h1>
            <p className="mt-1 text-sm text-slate-500">
              填写 API 信息并完成测试，保存 responseSchema 后即可接入
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/modeling/data-access')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Config */}
        <div className="flex w-[55%] flex-col border-r border-slate-200 overflow-y-auto">
          <div className="flex-1 p-6 space-y-6">
            {/* 连接名称 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                连接名称 <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：健康检查接口"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* API URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                API URL <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  className="shrink-0 border-r border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-blue-600 outline-none"
                >
                  {methods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onBlur={handleUrlBlur}
                  className="flex-1 px-3 py-2.5 font-mono text-sm outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                路径中使用 {'{name}'} 定义 Path 参数；粘贴或输入框失焦后自动解析
              </p>
            </div>

            {/* 接口鉴权 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">接口鉴权</label>
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                {authOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setAuth(opt.key)}
                    className={cn(
                      'flex-1 rounded-md py-2 text-sm font-medium transition-all',
                      auth === opt.key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {auth === 'bearer' && (
                <input placeholder="Bearer Token" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              )}
              {auth === 'apikey' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input placeholder="Key 名称" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  <input placeholder="Key 值" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
              )}
              {auth === 'basic' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input placeholder="用户名" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  <input type="password" placeholder="密码" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
              )}
            </div>

            {/* 参数 Tabs */}
            <div>
              <div className="mb-3 flex gap-6 border-b border-slate-200">
                {paramTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setParamTab(tab.key)}
                    className={cn(
                      'pb-2.5 text-sm font-medium transition-colors',
                      paramTab === tab.key
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-slate-400">
                    <th className="pb-2 pr-3 font-medium">参数名</th>
                    <th className="pb-2 pr-3 font-medium">值</th>
                    <th className="pb-2 pr-3 font-medium">描述</th>
                    <th className="pb-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {currentParams.map((param) => (
                    <tr key={param.id} className="group">
                      <td className="py-1.5 pr-3">
                        <input
                          value={param.name}
                          onChange={(e) => updateParam(param.id, 'name', e.target.value)}
                          readOnly={paramTab === 'path'}
                          placeholder="参数名"
                          className={cn(
                            'w-full rounded border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-blue-400',
                            paramTab === 'path' && 'bg-slate-50 text-slate-600'
                          )}
                        />
                      </td>
                      <td className="py-1.5 pr-3">
                        <input
                          value={param.value}
                          onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                          placeholder="值"
                          className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
                        />
                      </td>
                      <td className="py-1.5 pr-3">
                        <input
                          value={param.desc}
                          onChange={(e) => updateParam(param.id, 'desc', e.target.value)}
                          placeholder="描述"
                          className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
                        />
                      </td>
                      <td className="py-1.5">
                        {paramTab !== 'path' && (
                          <button
                            onClick={() => removeParam(param.id)}
                            className="rounded p-1 text-slate-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {paramTab !== 'path' && (
                <button
                  onClick={addParam}
                  className="mt-3 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" /> 新增
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Test */}
        <div className="flex w-[45%] flex-col bg-slate-50/50">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-violet-600" />
              <span className="font-semibold text-slate-900">接口测试</span>
            </div>
            <button
              onClick={sendRequest}
              disabled={sending}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              发送请求
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!response && !sending && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-400">发送请求后在此查看响应与字段结构</p>
              </div>
            )}

            {sending && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-violet-500" />
                  <p className="text-sm text-slate-500">请求发送中...</p>
                </div>
              </div>
            )}

            {response && responseMeta && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">
                    {responseMeta.status} OK
                  </span>
                  <span className="text-slate-400">{responseMeta.time}ms</span>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">响应体</p>
                  <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-emerald-400">
                    {response}
                  </pre>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">responseSchema（自动解析）</p>
                  <div className="rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                          <th className="px-4 py-2.5 font-medium">字段名</th>
                          <th className="px-4 py-2.5 font-medium">类型</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'key', type: 'string' },
                          { name: 'valid', type: 'boolean' },
                          { name: 'expiresAt', type: 'string' },
                          { name: 'owner', type: 'string' },
                        ].map((f) => (
                          <tr key={f.name} className="border-b border-slate-50">
                            <td className="px-4 py-2 font-mono text-violet-700">{f.name}</td>
                            <td className="px-4 py-2 text-slate-600">{f.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <Link
          to="/modeling/data-access"
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          上一步
        </Link>
        <button className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
          保存 API
        </button>
      </div>
    </div>
  )
}
