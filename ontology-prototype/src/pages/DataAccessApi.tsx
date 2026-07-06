import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Play, CheckCircle2, Loader2, Save, ArrowLeft, ArrowRight } from 'lucide-react'
import { StepWizard } from '../components/StepWizard'

const steps = [
  { label: '接口配置' },
  { label: '认证设置' },
  { label: '探测测试' },
  { label: 'Schema 保存' },
  { label: '绑定本体' },
]

const schemaFields = [
  { name: 'userId', type: 'string', desc: '用户唯一标识' },
  { name: 'userName', type: 'string', desc: '用户姓名' },
  { name: 'status', type: 'string', desc: '用户状态' },
  { name: 'balance', type: 'number', desc: '账户余额' },
  { name: 'packageId', type: 'string', desc: '套餐编号' },
]

export function DataAccessApi() {
  const [step, setStep] = useState(0)
  const [probing, setProbing] = useState(false)
  const [probeDone, setProbeDone] = useState(false)

  const runProbe = () => {
    setProbing(true)
    setTimeout(() => {
      setProbing(false)
      setProbeDone(true)
    }, 2000)
  }

  return (
    <div className="flex h-full flex-col bg-slate-50/80">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mb-1 flex items-center gap-2 text-sm text-slate-400">
          <Link to="/modeling" className="hover:text-slate-600">本体建模</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/modeling/data-access" className="hover:text-slate-600">数据接入</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">API 接口</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">API 接口接入配置</h1>
      </div>

      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <StepWizard steps={steps} current={step} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          {step === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">接口配置</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">数据源名称 <span className="text-red-500">*</span></label>
                  <input defaultValue="用户中心 API" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">请求方式</label>
                  <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">接口地址 <span className="text-red-500">*</span></label>
                  <input defaultValue="https://api.example.com/v1/users/{userId}" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">描述</label>
                  <textarea rows={2} placeholder="接口用途说明..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">认证设置</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">认证方式</label>
                  <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400">
                    <option>Bearer Token</option>
                    <option>API Key</option>
                    <option>Basic Auth</option>
                    <option>无认证</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Token / API Key</label>
                  <input type="password" defaultValue="sk-xxxxxxxx" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">请求头（可选）</label>
                  <textarea rows={3} defaultValue={'{\n  "Content-Type": "application/json"\n}'} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">探测测试</h2>
              <p className="mb-4 text-sm text-slate-500">发送测试请求，验证接口连通性并自动解析响应结构</p>
              <div className="mb-4 rounded-xl bg-slate-900 p-4 font-mono text-sm text-emerald-400">
                GET https://api.example.com/v1/users/10001
              </div>
              <button
                onClick={runProbe}
                disabled={probing}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {probing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {probing ? '探测中...' : '开始探测'}
              </button>
              {probeDone && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> 接口连通成功 · 响应时间 128ms · HTTP 200
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-medium text-slate-500">响应示例</p>
                    <pre className="overflow-x-auto text-xs text-slate-700">{`{
  "userId": "10001",
  "userName": "张三",
  "status": "正常",
  "balance": 128.50
}`}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold">responseSchema 保存</h2>
                <p className="mt-1 text-sm text-slate-500">确认自动解析的响应字段结构，可手动调整</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                    <th className="px-6 py-3">字段名</th>
                    <th className="px-6 py-3">类型</th>
                    <th className="px-6 py-3">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {schemaFields.map((f) => (
                    <tr key={f.name} className="border-b border-slate-50">
                      <td className="px-6 py-3 font-mono text-sm text-indigo-700">{f.name}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{f.type}</td>
                      <td className="px-6 py-3 text-sm text-slate-500">{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {step === 4 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">绑定本体对象</h2>
              <p className="mb-4 text-sm text-slate-500">将 API 响应字段映射到本体模型的对象属性</p>
              <div className="space-y-3">
                {[
                  { field: 'userId', object: '用户', attr: '用户ID' },
                  { field: 'userName', object: '用户', attr: '姓名' },
                  { field: 'status', object: '用户', attr: '状态' },
                  { field: 'balance', object: '账户', attr: '余额' },
                ].map((m) => (
                  <div key={m.field} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                    <span className="w-28 font-mono text-sm text-emerald-700">{m.field}</span>
                    <span className="text-slate-300">→</span>
                    <select className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none">
                      <option>{m.object}.{m.attr}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : undefined}
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
