import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search, Plus, Minus, Edit, ArrowLeft, ArrowRight } from 'lucide-react'
import { StepWizard } from '../components/StepWizard'
import { StatusBadge } from '../components/StatusBadge'

const baseModels = [
  { name: '电信经分本体', version: 'v1.2', status: 'published' as const, date: '2025-06-01', objects: 12 },
  { name: '反诈溯源本体', version: 'v0.8', status: 'published' as const, date: '2025-05-15', objects: 8 },
  { name: '客户画像本体', version: 'v1.0', status: 'published' as const, date: '2025-04-20', objects: 15 },
]

const diffItems = [
  { type: 'add', label: '新增对象: 客户标签', detail: '基于 CSV 字段 tag_name, tag_value 识别' },
  { type: 'add', label: '新增对象: 行为事件', detail: '基于业务文档第 5 章识别' },
  { type: 'add', label: '新增关系: 客户→行为事件', detail: '触发关系' },
  { type: 'edit', label: '修改属性: 用户.状态', detail: '枚举值扩展: 正常/欠费/停机/销户' },
  { type: 'edit', label: '修改属性: 账户.余额', detail: '精度调整为 decimal(12,2)' },
  { type: 'delete', label: '建议删除: 临时字段', detail: 'CSV 中 tmp_flag 字段无业务含义' },
]

export function EvolveModeling() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(1)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <Link to="/modeling" className="hover:text-slate-600">本体建模</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-700">现有模型演进</span>
      </div>
      <h1 className="mb-8 text-2xl font-bold text-slate-900">现有模型演进</h1>

      <div className="mb-10">
        <StepWizard steps={[{ label: '选择基础模型' }, { label: '上传资料' }, { label: '差异分析' }, { label: '合并确认' }]} current={step} />
      </div>

      <div className="mx-auto max-w-3xl">
        {step === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">选择现有本体模型</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input placeholder="搜索模型名称..." className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div className="space-y-2">
              {baseModels.map((m, i) => (
                <button key={m.name} onClick={() => setSelected(i)} className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${selected === i ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected === i ? 'border-indigo-600' : 'border-slate-300'}`}>
                    {selected === i && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{m.name}</span>
                      <span className="text-xs text-slate-400">{m.version}</span>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{m.objects} 个对象 · 发布于 {m.date}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                下一步 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 rounded-lg bg-indigo-50 px-4 py-3">
              <p className="text-sm text-indigo-800">基础模型: <strong>{baseModels[selected].name} {baseModels[selected].version}</strong></p>
            </div>
            <p className="mb-4 text-sm text-slate-500">上传新的元数据和业务文档，AI 将在现有模型基础上进行增量分析</p>
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center">
                <p className="text-sm font-medium text-slate-600">上传 CSV 元数据文件</p>
                <p className="mt-1 text-xs text-slate-400">已上传: new_metadata.csv</p>
              </div>
              <div className="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center">
                <p className="text-sm font-medium text-slate-600">上传 Word 业务说明文档</p>
                <p className="mt-1 text-xs text-slate-400">已上传: 业务变更说明.docx</p>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" /> 上一步
              </button>
              <button onClick={() => setStep(2)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                开始差异分析 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step >= 2 && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold">变更差异对比</h2>
              <div className="mt-3 flex gap-4">
                <span className="flex items-center gap-1.5 text-sm text-emerald-600"><Plus className="h-4 w-4" /> 新增 3 个对象</span>
                <span className="flex items-center gap-1.5 text-sm text-amber-600"><Edit className="h-4 w-4" /> 修改 2 个属性</span>
                <span className="flex items-center gap-1.5 text-sm text-red-600"><Minus className="h-4 w-4" /> 建议删除 1 个</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {diffItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50">
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.type === 'add' ? 'bg-emerald-100 text-emerald-600' : item.type === 'edit' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                    {item.type === 'add' ? <Plus className="h-3.5 w-3.5" /> : item.type === 'edit' ? <Edit className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                  </div>
                  <input type="checkbox" defaultChecked={item.type !== 'delete'} className="mt-1 rounded text-indigo-600" />
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-slate-100 px-6 py-4">
              <button onClick={() => setStep(1)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">放弃变更</button>
              <div className="flex gap-3">
                <Link to="/modeling/manual/new" className="rounded-lg border border-indigo-200 px-5 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50">进入专家编辑</Link>
                <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">合并到草稿</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
