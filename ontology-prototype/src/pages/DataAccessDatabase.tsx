import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, X, User, KeyRound, CheckCircle2, Loader2,
  ChevronDown, Database,
} from 'lucide-react'
import { cn } from '../lib/utils'

type DbKey = 'mysql' | 'clickhouse' | 'doris' | 'hive' | 'hive-kyuubi'

interface DbType {
  key: DbKey
  name: string
  port: string
  metaModes: string[]
}

const dbTypes: DbType[] = [
  { key: 'mysql', name: 'MySQL', port: '3306', metaModes: ['information_schema（默认）', 'SHOW TABLES'] },
  { key: 'clickhouse', name: 'ClickHouse', port: '8123', metaModes: ['system.tables（默认）'] },
  { key: 'doris', name: 'Doris', port: '9030', metaModes: ['information_schema（默认）'] },
  { key: 'hive', name: 'Hive', port: '10000', metaModes: ['SHOW TABLES（默认）', 'Hive Metastore'] },
  { key: 'hive-kyuubi', name: 'Hive (Kyuubi)', port: '10009', metaModes: ['SHOW TABLES（默认）'] },
]

const tables = [
  { name: 't_user', rows: '1,280,000', cols: 12 },
  { name: 't_account', rows: '980,000', cols: 8 },
  { name: 't_package', rows: '156', cols: 6 },
  { name: 't_bill', rows: '5,600,000', cols: 10 },
  { name: 't_order', rows: '3,200,000', cols: 15 },
]

export function DataAccessDatabase() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'config' | 'resource'>('config')
  const [dbKey, setDbKey] = useState<DbKey>('mysql')
  const [name, setName] = useState('')
  const [host, setHost] = useState('')
  const [port, setPort] = useState('3306')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [database, setDatabase] = useState('')
  const [metaMode, setMetaMode] = useState('information_schema（默认）')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null)
  const [selectedTables, setSelectedTables] = useState<string[]>(['t_user', 't_account', 't_bill'])

  const currentDb = dbTypes.find((d) => d.key === dbKey)!

  const selectDb = (key: DbKey) => {
    const db = dbTypes.find((d) => d.key === key)!
    setDbKey(key)
    setPort(db.port)
    setMetaMode(db.metaModes[0])
    setTestResult(null)
  }

  const testConnection = () => {
    setTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setTesting(false)
      setTestResult('success')
    }, 1500)
  }

  const toggleTable = (tableName: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableName) ? prev.filter((n) => n !== tableName) : [...prev, tableName]
    )
  }

  if (step === 'resource') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-4">
            <button onClick={() => setStep('config')} className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">选择数据资源</h1>
              <p className="mt-1 text-sm text-slate-500">选择需要接入的表，后续可绑定到本体对象</p>
            </div>
          </div>
          <button onClick={() => navigate('/modeling/data-access')} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl rounded-xl border border-slate-200">
            <div className="border-b border-slate-100 px-5 py-3">
              <p className="text-sm text-slate-500">
                已连接 <span className="font-medium text-slate-800">{name || currentDb.name}</span>
                · 数据库 <span className="font-mono text-slate-700">{database || '—'}</span>
                · 已选 <span className="font-medium text-blue-600">{selectedTables.length}</span> 张表
              </p>
            </div>
            <div className="divide-y divide-slate-50">
              {tables.map((t) => (
                <label key={t.name} className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-slate-50/50">
                  <input
                    type="checkbox"
                    checked={selectedTables.includes(t.name)}
                    onChange={() => toggleTable(t.name)}
                    className="rounded text-blue-600"
                  />
                  <Database className="h-4 w-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-mono text-sm font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.rows} 行 · {t.cols} 列</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button onClick={() => setStep('config')} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            上一步
          </button>
          <button className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
            保存并完成接入
          </button>
        </div>
      </div>
    )
  }

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
            <h1 className="text-xl font-bold text-slate-900">配置数据库</h1>
            <p className="mt-1 text-sm text-slate-500">填写连接信息并完成连通性测试</p>
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
        {/* Left: DB type selection */}
        <div className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50/50">
          <div className="border-b border-slate-200 px-4 py-4">
            <p className="text-sm font-semibold text-slate-800">关系型数据库</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">事务型、分析型与仓库型数据源</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {dbTypes.map((db) => (
              <button
                key={db.key}
                onClick={() => selectDb(db.key)}
                className={cn(
                  'relative flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-all',
                  dbKey === db.key
                    ? 'border border-blue-400 bg-white text-slate-900 shadow-sm'
                    : 'border border-transparent text-slate-600 hover:bg-white hover:shadow-sm'
                )}
              >
                {db.name}
                {dbKey === db.key && (
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                    已选中
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-center py-3">
            <ChevronDown className="h-4 w-4 text-slate-300" />
          </div>
        </div>

        {/* Right: Config form */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-xl space-y-5">
            {/* 连接名称 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                连接名称 <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`例如：经分 ${currentDb.name}`}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* 主机 + 端口 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  主机地址 <span className="text-red-500">*</span>
                </label>
                <input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="192.168.1.100"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  端口 <span className="text-red-500">*</span>
                </label>
                <input
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* 用户名 + 密码 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  用户名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="readonly_user"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">密码</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* 数据库名 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">数据库名</label>
              <input
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                placeholder="biz_analysis"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* 元数据查询模式 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">元数据查询模式</label>
              <select
                value={metaMode}
                onChange={(e) => setMetaMode(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {currentDb.metaModes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* 测试结果 */}
            {testResult === 'success' && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                连接成功 · 延迟 32ms · 发现 {tables.length} 张表
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <Link
          to="/modeling/data-access"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          上一步
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={testConnection}
            disabled={testing}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            测试连接
          </button>
          <button
            onClick={() => setStep('resource')}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  )
}
