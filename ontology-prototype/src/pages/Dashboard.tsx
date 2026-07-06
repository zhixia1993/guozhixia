import { Link } from 'react-router-dom'
import {
  PenTool, Bot, GitBranch, FileText, Code2, Database,
  ArrowRight, Clock, TrendingUp, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'

const modelingCards = [
  { title: '数据接入', desc: '接入 API 接口或数据库，绑定本体对象属性', icon: Database, path: '/modeling/data-access', gradient: 'from-cyan-500 to-blue-600' },
  { title: '专家自主建模', desc: '在线手动创建对象、关系、属性', icon: PenTool, path: '/modeling/manual/new', gradient: 'from-blue-500 to-indigo-600' },
  { title: '智能辅助建模', desc: '上传 CSV 与 Word 文档，AI 自动构建', icon: Bot, path: '/modeling/assist', gradient: 'from-violet-500 to-purple-600' },
  { title: '现有模型演进', desc: '基于已有本体模型增量构建', icon: GitBranch, path: '/modeling/evolve', gradient: 'from-emerald-500 to-teal-600' },
  { title: '规则建模', desc: '选择本体 + Skill + 自然语言生成规则', icon: FileText, path: '/modeling/rule', gradient: 'from-amber-500 to-orange-600' },
  { title: '逻辑建模', desc: '编辑 .md 技能文件，集成 MCP 接口', icon: Code2, path: '/modeling/logic', gradient: 'from-rose-500 to-pink-600' },
]

const recentItems = [
  { name: '电信经分本体', type: '本体模型', status: 'draft' as const, time: '2 小时前', path: '/modeling/manual/1' },
  { name: '欠费停机规则', type: '规则模型', status: 'reviewing' as const, time: '昨天', path: '/modeling/rule' },
  { name: '反诈溯源技能', type: '逻辑模型', status: 'published' as const, time: '3 天前', path: '/modeling/logic' },
]

export function Dashboard() {
  return (
    <div className="p-6 lg:p-8">
      <div className="gradient-header mb-8 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200/50">
        <h1 className="text-2xl font-bold">欢迎回来，张三</h1>
        <p className="mt-2 text-indigo-100">本体模型智能建模平台 — 构建、审核、发布、共享您的领域知识资产</p>
        <div className="mt-6 flex flex-wrap gap-4">
          {[
            { label: '我的模型', value: '12', icon: TrendingUp },
            { label: '待审核', value: '3', icon: AlertCircle },
            { label: '已发布', value: '8', icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.label} className="glass-panel flex items-center gap-3 rounded-xl px-5 py-3">
              <s.icon className="h-5 w-5 text-indigo-200" />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-indigo-100">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">快速开始建模</h2>
          <Link to="/modeling" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {modelingCards.map((card) => (
            <Link key={card.path} to={card.path} className="card-hover group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">{card.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">最近编辑</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3">名称</th>
              <th className="px-6 py-3">类型</th>
              <th className="px-6 py-3">状态</th>
              <th className="px-6 py-3">最后修改</th>
              <th className="px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {recentItems.map((item) => (
              <tr key={item.name} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.type}</td>
                <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{item.time}</span>
                </td>
                <td className="px-6 py-4">
                  <Link to={item.path} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">继续编辑</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ModelingHome() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">本体建模</h1>
        <p className="mt-1 text-slate-500">选择建模方式，构建您的领域本体、规则与逻辑模型</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modelingCards.map((card) => (
          <Link key={card.path} to={card.path} className="card-hover group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-10`} />
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
              开始建模 <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
