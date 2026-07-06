import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Database, CheckCircle2, Save, ArrowLeft, ArrowRight } from 'lucide-react'
import { StepWizard } from '../components/StepWizard'

const dbTypes = [
  { key: 'mysql', name: 'MySQL', desc: '事务型关系数据库', color: 'border-sky-300 bg-sky-50', icon: '🐬' },
  { key: 'hive', name: 'Hive', desc: '分析型数据仓库', color: 'border-amber-300 bg-amber-50', icon: '🐘' },
  { key: 'neo4j', name: 'Neo4j', desc: '图数据库', color: 'border-violet-300 bg-violet-50', icon: '🔗' },
]

const tables = [
  { name: 't_user', rows: '1,280,000', cols: 12, selected: true },
  { name: 't_account', rows: '980,000', cols: 8, selected: true },
  { name: 't_package', rows: '156', cols: 6, selected: false },
  { name: 't_bill', rows: '5,600,000', cols: 10, selected: true },
  { name: 't_order', rows: '3,200,000', cols: 15, selected: false },
]

const steps = [
  { label: '选择类型' },
  { label: '连接配置' },
  { label: '资源选择' },
  { label: '字段映射' },
  { label: '绑定本体' },
]

export function DataAccessDatabase() {
  const [step, setStep] = useState(0)
  const [dbType, setDbType] = useState('mysql')
  const [connected, setConnected] = useState(false)
  const [selectedTables, setSelectedTables] = useState(tables.filter((t) => t.selected).map((t) => t.name))

  const toggleTable = (name: string) => {
    setSelectedTables((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  return (
    <div className="flex h-full flex-col bg-slate-50/80">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mb-1 flex items-center gap-2 text-sm text-slate-400">
          <Link to="/modeling" className="hover:text-slate-600">本体建模</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/modeling/data-access" className="hover:text-slate-600">数据接入</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">数据库</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">数据库接入配置</h1>
      </div>

      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <StepWizard steps={steps} current={step} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          {step === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">选择数据库类型</h2>
              <div className="space-y-3">
                {dbTypes.map((db) => (
                  <button
                    key={db.key}
                    onClick={() => setDbType(db.key)}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${dbType === db.key ? `${db.color} ring-2 ring-offset-1` : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <span className="text-2xl">{db.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{db.name}</p>
                      <p className="text-sm text-slate-500">{db.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">连接配置</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">数据源名称 <span className="text-red-500">*</span></label>
                  <input defaultValue="经分 MySQL" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">主机地址</label>
                    <input defaultValue="192.168.1.100" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">端口</label>
                    <input defaultValue={dbType === 'neo4j' ? '7687' : dbType === 'hive' ? '10000' : '3306'} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">数据库名</label>
                  <input defaultValue="biz_analysis" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">用户名</label>
                    <input defaultValue="readonly_user" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">密码</label>
                    <input type="password" defaultValue="********" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                  </div>
                </div>
                <button
                  onClick={() => setConnected(true)}
                  className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  <Database className="h-4 w-4" /> 测试连接
                </button>
                {connected && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> 连接成功 · 延迟 32ms
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold">资源选择</h2>
                <p className="mt-1 text-sm text-slate-500">选择需要接入的表 / 集合，已选 {selectedTables.length} 项</p>
              </div>
              <div className="divide-y divide-slate-50">
                {tables.map((t) => (
                  <label key={t.name} className="flex cursor-pointer items-center gap-4 px-6 py-4 hover:bg-slate-50/50">
                    <input
                      type="checkbox"
                      checked={selectedTables.includes(t.name)}
                      onChange={() => toggleTable(t.name)}
                      className="rounded text-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="font-mono text-sm font-medium text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.rows} 行 · {t.cols} 列</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold">字段映射</h2>
                <p className="mt-1 text-sm text-slate-500">预览选中表的字段结构</p>
              </div>
              <div className="p-6">
                <p className="mb-3 text-sm font-medium text-slate-700">t_user 表字段</p>
                <div className="space-y-2">
                  {[
                    { col: 'user_id', type: 'VARCHAR(32)', pk: true },
                    { col: 'user_name', type: 'VARCHAR(64)' },
                    { col: 'status', type: 'TINYINT' },
                    { col: 'create_time', type: 'DATETIME' },
                  ].map((f) => (
                    <div key={f.col} className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-2.5">
                      <span className="font-mono text-sm text-indigo-700">{f.col}</span>
                      <span className="text-xs text-slate-400">{f.type}</span>
                      {f.pk && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">PK</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">绑定本体对象</h2>
              <div className="space-y-3">
                {[
                  { table: 't_user', object: '用户' },
                  { table: 't_account', object: '账户' },
                  { table: 't_bill', object: '账单' },
                ].map((m) => (
                  <div key={m.table} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                    <span className="w-28 font-mono text-sm text-blue-700">{m.table}</span>
                    <span className="text-slate-300">→</span>
                    <select className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none">
                      <option>本体对象: {m.object}</option>
                      <option>+ 新建对象</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              className={`flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-white ${step === 0 ? 'invisible' : ''}`}
            >
              <ArrowLeft className="h-4 w-4" /> 上一步
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                下一步 <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                <Save className="h-4 w-4" /> 保存并完成接入
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
