import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, Trash2, Save, Send } from 'lucide-react'

const skills = [
  { id: 'rule-infer', name: '规则推理', desc: '基于本体结构自动推断规则' },
  { id: 'constraint', name: '约束校验', desc: '生成数据约束与校验规则' },
  { id: 'orchestrate', name: '业务编排', desc: '编排多步骤业务流程规则' },
]

const generatedRules = [
  { id: 1, name: '欠费停机规则', condition: '用户.欠费天数 > 30 AND 用户.状态 = "正常"', action: '触发.停机预警' },
  { id: 2, name: '复机校验规则', condition: '用户.状态 = "停机" AND 账户.余额 > 0', action: '触发.复机流程' },
  { id: 3, name: '套餐到期提醒', condition: '套餐.到期日 - 今天 <= 7', action: '触发.到期提醒' },
]

export function RuleModeling() {
  const [selectedSkill, setSelectedSkill] = useState('rule-infer')
  const [nlInput, setNlInput] = useState('当用户欠费超过30天且状态为正常时，触发停机预警；当用户已停机但账户余额大于0时，允许发起复机流程。')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/modeling" className="text-slate-400 hover:text-slate-600">本体建模</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="font-medium text-slate-900">规则建模</span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Save className="h-4 w-4" /> 保存草稿
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
            <Send className="h-4 w-4" /> 提交审核
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[420px] shrink-0 border-r border-slate-200 bg-white p-5 overflow-y-auto">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">选择本体模型 <span className="text-red-500">*</span></label>
              <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                <option>电信经分本体 v1.2</option>
                <option>反诈溯源本体 v0.8</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">选择 Skill <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {skills.map((s) => (
                  <button key={s.id} onClick={() => setSelectedSkill(s.id)} className={`w-full rounded-xl border p-3.5 text-left transition-all ${selectedSkill === s.id ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'}`}>
                    <p className="text-sm font-medium text-slate-900">{s.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">自然语言输入 <span className="text-red-500">*</span></label>
              <textarea
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-violet-700">
              <Sparkles className="h-4 w-4" /> 生成规则
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">规则预览</h3>
            <div className="rounded-xl bg-slate-900 p-5 font-mono text-sm leading-relaxed text-emerald-400">
              <p><span className="text-purple-400">IF</span> 用户.欠费天数 <span className="text-amber-400">&gt;</span> 30</p>
              <p className="ml-4"><span className="text-purple-400">AND</span> 用户.状态 <span className="text-amber-400">=</span> <span className="text-cyan-400">"正常"</span></p>
              <p><span className="text-purple-400">THEN</span> 触发.停机预警</p>
            </div>
          </div>

          <h3 className="mb-3 text-sm font-semibold text-slate-900">已生成规则 ({generatedRules.length})</h3>
          <div className="space-y-3">
            {generatedRules.map((rule, i) => (
              <div key={rule.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">#{i + 1}</span>
                    <span className="font-medium text-slate-900">{rule.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">编辑</button>
                    <button className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-500"><span className="font-medium text-slate-700">条件:</span> {rule.condition}</p>
                  <p className="text-slate-500"><span className="font-medium text-slate-700">动作:</span> {rule.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
