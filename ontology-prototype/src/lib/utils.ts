import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ModelStatus = 'draft' | 'reviewing' | 'published' | 'rejected' | 'changing'

export const statusConfig: Record<ModelStatus, { label: string; color: string; bg: string }> = {
  draft: { label: '草稿', color: 'text-slate-600', bg: 'bg-slate-100' },
  reviewing: { label: '审核中', color: 'text-amber-700', bg: 'bg-amber-50' },
  published: { label: '已发布', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  rejected: { label: '已驳回', color: 'text-red-700', bg: 'bg-red-50' },
  changing: { label: '变更审批中', color: 'text-blue-700', bg: 'bg-blue-50' },
}
