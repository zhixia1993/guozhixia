import { cn, type ModelStatus, statusConfig } from '../lib/utils'

export function StatusBadge({ status, className }: { status: ModelStatus; className?: string }) {
  const config = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config.bg, config.color, className)}>
      <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', status === 'published' ? 'bg-emerald-500' : status === 'reviewing' ? 'bg-amber-500' : status === 'rejected' ? 'bg-red-500' : status === 'changing' ? 'bg-blue-500' : 'bg-slate-400')} />
      {config.label}
    </span>
  )
}
