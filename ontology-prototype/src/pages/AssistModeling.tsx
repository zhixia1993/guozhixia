import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileSpreadsheet, FileText, ChevronRight, Loader2, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'
import { StepWizard } from '../components/StepWizard'
import { GraphCanvas } from '../components/GraphCanvas'

const steps = [
  { label: '基本信息' },
  { label: '上传资料' },
  { label: 'AI 构建' },
  { label: '确认调整' },
]

const graphNodes = [
  { id: 'n1', label: '客户', x: 180, y: 140, type: 'entity' as const },
  { id: 'n2', label: '订单', x: 380, y: 100, type: 'entity' as const },
  { id: 'n3', label: '产品', x: 380, y: 200, type: 'entity' as const },
  { id: 'n4', label: '渠道', x: 580, y: 150, type: 'entity' as const },
]

const graphEdges = [
  { from: 'n1', to: 'n2', label: '下单' },
  { from: 'n2', to: 'n3', label: '包含' },
  { from: 'n2', to: 'n4', label: '来源' },
]

export function AssistModeling() {
  const [step, setStep] = useState(0)
  const [building, setBuilding] = useState(false)
  const [progress, setProgress] = useState(0)

  const startBuild = () => {
    setStep(2)
    setBuilding(true)
    let p = 0
    const interval = setInterval(() => {
      p += 12
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setBuilding(false)
        setTimeout(() => setStep(3), 500)
      }
    }, 400)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <Link to="/modeling" className="hover:text-slate-600">本体建模</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-700">智能辅助建模</span>
      </div>
      <h1 className="mb-8 text-2xl font-bold text-slate-900">智能辅助建模</h1>

      <div className="mb-10">
        <StepWizard steps={steps} current={step} />
      </div>

      <div className="mx-auto max-w-3xl">
        {step === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">基本信息</h2>
            <div className="space-y-4">
              {[
                { label: '模型名称', placeholder: '请输入模型名称', required: true },
                { label: '所属领域', placeholder: '选择领域', required: true, select: true },
                { label: '版本号', placeholder: 'v0.1', required: false },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  {f.select ? (
                    <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                      <option>电信经分</option>
                      <option>反诈溯源</option>
                      <option>客户画像</option>
                    </select>
                  ) : (
                    <input placeholder={f.placeholder} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                  )}
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">模型描述</label>
                <textarea rows={3} placeholder="描述本体的业务场景和目标..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
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
            <h2 className="mb-6 text-lg font-semibold">上传资料</h2>
            <div className="space-y-6">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> 元数据信息（CSV）
                </label>
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
                  <Upload className="mb-3 h-8 w-8 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">拖拽或点击上传 CSV 文件</p>
                  <p className="mt-1 text-xs text-slate-400">支持多文件，包含表名、字段名、类型、说明等</p>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-2.5">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  <span className="flex-1 text-sm text-emerald-800">metadata_tables.csv</span>
                  <button className="text-xs font-medium text-emerald-600">预览</button>
                  <button className="text-xs font-medium text-red-500">删除</button>
                </div>
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText className="h-4 w-4 text-blue-600" /> 业务说明文档（Word）
                </label>
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
                  <Upload className="mb-3 h-8 w-8 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">拖拽或点击上传 .doc / .docx</p>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-2.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="flex-1 text-sm text-blue-800">业务说明_v1.docx</span>
                  <button className="text-xs font-medium text-blue-600">预览</button>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" /> 上一步
              </button>
              <button onClick={startBuild} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                开始 AI 构建 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">AI 正在构建本体模型</h2>
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{building ? '构建中...' : '构建完成'}</span>
                <span className="text-indigo-600">{progress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="space-y-3">
              {[
                { text: '解析 CSV 元数据（128 个字段）', done: progress > 20 },
                { text: '解析业务文档（23 页）', done: progress > 40 },
                { text: '识别对象实体（12 个）', done: progress > 60 },
                { text: '推断对象关系（8 条）', done: progress > 80 },
                { text: '生成属性定义（64 个）', done: progress >= 100 },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm">
                  {item.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />}
                  <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold">确认调整</h2>
              <p className="text-sm text-slate-500">检查 AI 生成结果，可进行微调后保存</p>
            </div>
            <div className="flex h-96">
              <div className="w-48 border-r border-slate-100 p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">生成结果</p>
                {['客户', '订单', '产品', '渠道', '下单', '包含'].map((item, i) => (
                  <label key={item} className="mb-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                    <span className="text-slate-700">{item}</span>
                    <span className="ml-auto text-[10px] text-slate-400">{i < 4 ? '对象' : '关系'}</span>
                  </label>
                ))}
              </div>
              <div className="flex-1 p-4">
                <GraphCanvas nodes={graphNodes} edges={graphEdges} readOnly />
              </div>
            </div>
            <div className="flex justify-between border-t border-slate-100 px-6 py-4">
              <button onClick={() => setStep(1)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">返回修改资料</button>
              <div className="flex gap-3">
                <Link to="/modeling/manual/new" className="rounded-lg border border-indigo-200 px-5 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50">进入专家编辑</Link>
                <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">保存为草稿</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
