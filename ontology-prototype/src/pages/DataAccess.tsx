import { Link } from 'react-router-dom'
import { ChevronRight, Globe, Cable } from 'lucide-react'

const accessTypes = [
  {
    key: 'api',
    title: 'API 接口',
    desc: '支持 RESTful / HTTP 实时数据接入、探测与 responseSchema 保存。',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    path: '/modeling/data-access/api',
    protocolLabel: '支持协议',
    protocols: [
      { name: 'RESTful', color: 'bg-violet-100 text-violet-600', icon: 'R' },
      { name: 'HTTP', color: 'bg-blue-100 text-blue-600', icon: <Globe className="h-5 w-5" /> },
    ],
    Icon: () => (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
        <path d="M8 32C8 32 14 20 24 20C34 20 40 32 40 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-emerald-500" />
        <path d="M12 28H36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-400" />
        <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600" />
        <path d="M20 38L24 42L28 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" />
      </svg>
    ),
  },
  {
    key: 'database',
    title: '数据库',
    desc: '统一接入事务型、分析型与图数据库，支持资源选择与后续绑定。',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    path: '/modeling/data-access/database',
    protocolLabel: '支持类型',
    protocols: [
      { name: 'MySQL', color: 'bg-sky-50', icon: <MySQLIcon /> },
      { name: 'Hive', color: 'bg-amber-50', icon: <HiveIcon /> },
      { name: 'Neo4j', color: 'bg-violet-50', icon: <Neo4jIcon /> },
    ],
    Icon: () => (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
        <ellipse cx="24" cy="14" rx="16" ry="6" fill="#3B82F6" opacity="0.2" stroke="#3B82F6" strokeWidth="2" />
        <path d="M8 14V34C8 37.3 15.2 40 24 40C32.8 40 40 37.3 40 34V14" stroke="#3B82F6" strokeWidth="2.5" />
        <ellipse cx="24" cy="24" rx="16" ry="6" stroke="#3B82F6" strokeWidth="2" fill="#3B82F6" fillOpacity="0.1" />
        <ellipse cx="24" cy="34" rx="16" ry="6" stroke="#3B82F6" strokeWidth="2" fill="#3B82F6" fillOpacity="0.05" />
      </svg>
    ),
  },
]

function MySQLIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7">
      <path d="M26 8C24 6 20 5 16 5C10 5 6 7 5 10C4 12 5 14 7 15V17C5 18 4 20 5 22C6 25 10 27 16 27C22 27 26 25 27 22C28 20 27 18 25 17V15C27 14 28 12 27 10C27 9 26.5 8.5 26 8Z" fill="#00758F" />
      <path d="M16 8C12 8 9 9 8 11C7.5 12 8 13 9 13.5V18.5C8 19 7.5 20 8 21C9 23 12 24 16 24C20 24 23 23 24 21C24.5 20 24 19 23 18.5V13.5C24 13 24.5 12 24 11C23 9 20 8 16 8Z" fill="#F29111" />
    </svg>
  )
}

function HiveIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7">
      <rect x="4" y="10" width="24" height="14" rx="3" fill="#FDE047" />
      <circle cx="10" cy="17" r="2" fill="#CA8A04" />
      <circle cx="16" cy="17" r="2" fill="#CA8A04" />
      <circle cx="22" cy="17" r="2" fill="#CA8A04" />
      <path d="M8 10L10 6H22L24 10" stroke="#CA8A04" strokeWidth="1.5" fill="#FEF08A" />
      <path d="M6 14L4 12M26 14L28 12" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Neo4jIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7">
      <circle cx="16" cy="16" r="12" fill="#018BFF" fillOpacity="0.15" />
      <circle cx="16" cy="10" r="4" fill="#018BFF" />
      <circle cx="10" cy="20" r="4" fill="#018BFF" />
      <circle cx="22" cy="20" r="4" fill="#018BFF" />
      <line x1="16" y1="14" x2="12" y2="17" stroke="#018BFF" strokeWidth="2" />
      <line x1="16" y1="14" x2="20" y2="17" stroke="#018BFF" strokeWidth="2" />
      <line x1="14" y1="20" x2="18" y2="20" stroke="#018BFF" strokeWidth="2" />
    </svg>
  )
}

export function DataAccess() {
  return (
    <div className="min-h-full bg-slate-50/80 p-6 lg:p-10">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <Link to="/modeling" className="hover:text-slate-600">本体建模</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-700">数据接入</span>
      </div>

      <div className="mx-auto max-w-4xl pt-8">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">选择接入类型</h1>
          <p className="mt-2 text-sm text-slate-500">请选择您要接入的数据源类型，开始配置您的数据资产</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {accessTypes.map((type) => (
            <Link
              key={type.key}
              to={type.path}
              className="card-hover group flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${type.iconBg}`}>
                <type.Icon />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{type.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{type.desc}</p>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="mb-3 text-xs font-medium text-slate-400">{type.protocolLabel}</p>
                <div className="flex items-center gap-3">
                  {type.protocols.map((p) => (
                    <div key={p.name} className={`flex h-10 w-10 items-center justify-center rounded-xl ${p.color}`} title={p.name}>
                      {typeof p.icon === 'string' ? (
                        <span className="text-sm font-bold">{p.icon}</span>
                      ) : (
                        p.icon
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
              <Cable className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">已接入数据源</p>
              <p className="mt-1 text-xs text-slate-500">接入完成后可在本体建模中绑定对象属性，或在智能辅助建模时作为元数据来源引用</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['用户中心 API', '经分 MySQL', '图谱 Neo4j'].map((name) => (
                  <span key={name} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
