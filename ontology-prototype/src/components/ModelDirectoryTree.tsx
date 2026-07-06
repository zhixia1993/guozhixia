import { useState } from 'react'
import {
  ChevronRight, ChevronDown, Box, Tag, Link2, BookOpen, GitBranch, Cpu, Pencil,
} from 'lucide-react'
import { cn } from '../lib/utils'
import type { DirectoryNode } from '../lib/ontologyModel'

const iconMap: Partial<Record<DirectoryNode['type'], typeof Box>> = {
  objects: Box, object: Box,
  properties: Tag, property: Tag,
  relations: Link2, relation: Link2,
  dictionaries: BookOpen, dictionary: BookOpen,
  rules: GitBranch, rule: GitBranch,
  logic: Cpu, 'logic-item': Cpu,
}

interface ModelDirectoryTreeProps {
  tree: DirectoryNode[]
  selectedId: string | null
  onSelect: (node: DirectoryNode) => void
  editable?: boolean
}

export function ModelDirectoryTree({ tree, selectedId, onSelect, editable = true }: ModelDirectoryTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(tree.map((n) => n.id))
  )

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-1">
      {tree.map((category) => {
        const CatIcon = iconMap[category.type] ?? Box
        const isOpen = expanded.has(category.id)
        return (
          <div key={category.id}>
            <button
              onClick={() => toggle(category.id)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {isOpen ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
              <CatIcon className="h-4 w-4 text-indigo-500" />
              {category.label}
            </button>
            {isOpen && category.children && (
              <div className="ml-4 space-y-0.5 border-l border-slate-100 pl-2">
                {category.children.map((child) => {
                  const ChildIcon = iconMap[child.type] ?? Box
                  const isSelected = selectedId === child.id
                  return (
                    <button
                      key={child.id}
                      onClick={() => onSelect(child)}
                      className={cn(
                        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors',
                        isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <ChildIcon className={cn('h-3.5 w-3.5 shrink-0', isSelected ? 'text-indigo-500' : 'text-slate-400')} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{child.label}</p>
                        {child.subtitle && (
                          <p className="truncate text-[11px] text-slate-400">{child.subtitle}</p>
                        )}
                      </div>
                      {editable && (
                        <Pencil className="h-3 w-3 shrink-0 text-slate-300 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
