import { useLocation, Link, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  FolderKanban,
  ClipboardCheck,
  Store,
  Bell,
  ChevronDown,
  Search,
  Hexagon,
} from 'lucide-react'
import { cn } from '../lib/utils'

const mainNav = [
  { path: '/', label: '工作台', icon: LayoutDashboard },
  { path: '/modeling', label: '本体建模', icon: Boxes },
  { path: '/models/ontology', label: '模型管理', icon: FolderKanban },
  { path: '/audit', label: '审核中心', icon: ClipboardCheck },
  { path: '/plaza', label: '资源广场', icon: Store },
]

const modelSubNav = [
  { path: '/models/ontology', label: '本体模型库' },
  { path: '/models/rule', label: '规则模型库' },
  { path: '/models/logic', label: '逻辑模型库' },
]

export function Layout() {
  const location = useLocation()
  const isModelSection = location.pathname.startsWith('/models')

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="z-40 flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-5 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-200">
              <Hexagon className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">本体模型智能建模平台</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {mainNav.map((item) => {
              const active = item.path === '/models/ontology'
                ? location.pathname.startsWith('/models')
                : location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="全局搜索..." className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400" />
          </div>
          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-medium text-white">张</div>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">张三</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {isModelSection && (
          <aside className="hidden w-52 shrink-0 border-r border-slate-200 bg-white lg:block">
            <div className="p-4">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">模型管理</p>
              <nav className="space-y-0.5">
                {modelSubNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      location.pathname === item.path ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        )}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
