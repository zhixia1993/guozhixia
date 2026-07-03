import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Upload, Star, ExternalLink, Plug, Bot, Network,
  FileText, AppWindow, ChevronRight, ArrowRight,
} from 'lucide-react'

const toolAssets = [
  { name: 'getUserInfo', type: 'API', rating: 4.8, uses: 256, desc: '获取用户基本信息' },
  { name: '数据查询 MCP', type: 'MCP', rating: 4.6, uses: 189, desc: '统一数据查询接口集' },
  { name: '规则推理 Skill', type: '技能', rating: 4.9, uses: 142, desc: '基于本体的规则自动推理' },
  { name: 'traceSource', type: 'API', rating: 4.7, uses: 98, desc: '反诈溯源分析接口' },
]

const modelAssets = [
  { name: '电信经分本体', version: 'v1.2', type: '本体模型', rating: 4.8, uses: 128, access: 'apply' },
  { name: '反诈溯源本体', version: 'v0.8', type: '本体模型', rating: 4.5, uses: 86, access: 'download' },
  { name: '欠费停机规则集', version: 'v1.0', type: '规则模型', rating: 4.7, uses: 64, access: 'apply' },
]

const appAssets = [
  { name: '经分问答应用', desc: '基于经分本体的智能问答，支持指标查询与归因分析', icon: Bot, color: 'from-blue-500 to-indigo-600', action: '体验' },
  { name: '反诈关停溯源问答', desc: '关停工单自动溯源，判断关停合理性', icon: AppWindow, color: 'from-rose-500 to-pink-600', action: '申请' },
  { name: '客户画像洞察', desc: '多维度客户标签分析与群体洞察', icon: Network, color: 'from-emerald-500 to-teal-600', action: '申请' },
]

export function PlazaHome() {
  const [activeTab, setActiveTab] = useState<'all' | 'tools' | 'models' | 'apps'>('all')

  return (
    <div>
      <div className="gradient-header px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-white">本体资源广场</h1>
          <p className="mt-2 text-indigo-100">发现、申请和共享本体模型、工具链与智能体应用</p>
          <div className="mt-6 flex gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input placeholder="搜索资产名称、描述、标签..." className="w-full rounded-xl border-0 py-3 pl-12 pr-4 text-sm shadow-lg outline-none" />
            </div>
            <Link to="/plaza/upload" className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-sm font-medium text-white backdrop-blur hover:bg-white/30">
              <Upload className="h-4 w-4" /> 上传共享
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6 lg:px-8">
        <div className="mb-8 flex gap-2">
          {[
            { key: 'all' as const, label: '全部' },
            { key: 'tools' as const, label: '工具链资产' },
            { key: 'models' as const, label: '模型资产' },
            { key: 'apps' as const, label: '应用资产' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {(activeTab === 'all' || activeTab === 'tools') && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">工具链资产中心</h2>
                <div className="ml-2 flex gap-1">
                  {['API', 'MCP', '技能'].map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{tag}</span>
                  ))}
                </div>
              </div>
              <Link to="/plaza/tools" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {toolAssets.map((asset) => (
                <Link key={asset.name} to="/plaza/asset/tool/1" className="card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">{asset.type}</span>
                    <span className="flex items-center gap-1 text-xs text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-400" />{asset.rating}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">{asset.desc}</p>
                  <p className="mt-3 text-xs text-slate-400">{asset.uses} 次使用</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'models') && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900">模型资产中心</h2>
                <div className="ml-2 flex gap-1">
                  {['本体模型', '规则模型'].map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{tag}</span>
                  ))}
                </div>
              </div>
              <Link to="/plaza/models" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modelAssets.map((asset) => (
                <Link key={asset.name} to="/plaza/asset/model/1" className="card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600">{asset.type}</span>
                    <span className="flex items-center gap-1 text-xs text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-400" />{asset.rating}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{asset.version} · {asset.uses} 次引用</p>
                  <div className="mt-4">
                    <span className={`rounded-lg px-3 py-1.5 text-xs font-medium ${asset.access === 'download' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                      {asset.access === 'download' ? '开放下载' : '需申请'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'apps') && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AppWindow className="h-5 w-5 text-rose-600" />
                <h2 className="text-lg font-semibold text-slate-900">应用资产中心</h2>
              </div>
              <Link to="/plaza/apps" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {appAssets.map((app) => (
                <div key={app.name} className="card-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${app.color} shadow-lg`}>
                    <app.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{app.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{app.desc}</p>
                  <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    {app.action === '体验' ? '立即体验' : '申请使用'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export function PlazaAssetDetail() {
  const [activeTab, setActiveTab] = useState<'func' | 'usage' | 'version' | 'review'>('func')

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <Link to="/plaza" className="hover:text-slate-600">资源广场</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-700">资产详情</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600">本体模型</span>
              <span className="flex items-center gap-1 text-sm text-amber-500"><Star className="h-4 w-4 fill-amber-400" />4.8</span>
              <span className="text-sm text-slate-400">128 次使用</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">电信经分本体 v1.2</h1>
            <p className="mt-2 text-sm text-slate-500">提供者: 张三 · 发布时间: 2025-06-01 · 领域: 电信经分</p>
          </div>
          <button className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-indigo-700">申请使用</button>
        </div>

        <div className="mt-6 flex gap-1 border-b border-slate-100">
          {[
            { key: 'func' as const, label: '功能说明' },
            { key: 'usage' as const, label: '使用说明' },
            { key: 'version' as const, label: '版本历史' },
            { key: 'review' as const, label: '评价' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === t.key ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 prose prose-sm max-w-none text-slate-600">
          {activeTab === 'func' && (
            <div>
              <h3 className="text-base font-semibold text-slate-900">功能说明</h3>
              <p className="mt-2 leading-relaxed">面向电信经营分析场景的本体模型，覆盖用户、账户、套餐、账单等核心实体及其关系。支持经分指标归因、欠费分析、套餐推荐等业务场景。</p>
              <h3 className="mt-6 text-base font-semibold text-slate-900">适用场景</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>经营分析指标查询与归因</li>
                <li>欠费用户分析与预警</li>
                <li>套餐结构优化分析</li>
              </ul>
            </div>
          )}
          {activeTab === 'usage' && (
            <div>
              <h3 className="text-base font-semibold text-slate-900">使用说明</h3>
              <ol className="mt-2 list-decimal pl-5 space-y-2">
                <li>申请权限后，资产将出现在「我的资产」中</li>
                <li>在「现有模型演进」中可选择此模型作为基础模型</li>
                <li>在「规则建模」中可关联此本体生成业务规则</li>
              </ol>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span className="text-sm text-slate-700">接入示例文档</span>
                <button className="ml-auto flex items-center gap-1 text-sm font-medium text-indigo-600"><ExternalLink className="h-3.5 w-3.5" /> 查看</button>
              </div>
            </div>
          )}
          {activeTab === 'version' && (
            <div className="space-y-3">
              {['v1.2 — 2025-06-01 新增客户标签对象', 'v1.1 — 2025-05-01 扩展用户属性', 'v1.0 — 2025-04-01 初始发布'].map((v) => (
                <div key={v} className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">{v}</div>
              ))}
            </div>
          )}
          {activeTab === 'review' && (
            <div className="space-y-4">
              {[{ user: '李四', rating: 5, text: '模型结构清晰，非常适合经分场景' }, { user: '王五', rating: 4, text: '建议补充渠道相关对象' }].map((r) => (
                <div key={r.user} className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium text-slate-800">{r.user}</span>
                    <span className="flex text-amber-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p className="text-sm text-slate-600">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PlazaUpload() {
  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <Link to="/plaza" className="hover:text-slate-600">资源广场</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-700">上传共享</span>
      </div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">上传共享能力</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">资产类型 <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {['API', 'MCP', '技能', '本体模型', '规则模型', '应用'].map((type) => (
                <label key={type} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-indigo-300 has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50">
                  <input type="radio" name="type" className="text-indigo-600" />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">资产名称 <span className="text-red-500">*</span></label>
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="输入资产名称" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">功能说明 <span className="text-red-500">*</span></label>
            <textarea rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="描述资产的功能和适用场景" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">使用说明 <span className="text-red-500">*</span></label>
            <textarea rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="描述如何使用此资产，支持 Markdown" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">上传文件</label>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-10 hover:border-indigo-300">
              <Upload className="mb-2 h-8 w-8 text-slate-400" />
              <p className="text-sm text-slate-600">拖拽或点击上传文件</p>
              <p className="mt-1 text-xs text-slate-400">API 文档 / MCP 配置 / .md 技能文件等</p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">可见范围</label>
            <div className="flex gap-3">
              {['全平台公开', '需申请', '仅指定组织'].map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-indigo-300 has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50">
                  <input type="radio" name="scope" className="text-indigo-600" />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Link to="/plaza" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">取消</Link>
          <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">提交审核</button>
        </div>
      </div>
    </div>
  )
}
