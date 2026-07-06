import type { ReactNode } from 'react'
import { Box, Tag, Link2, BookOpen, GitBranch, Cpu } from 'lucide-react'
import type { OntologyModel } from '../lib/ontologyModel'
import type { DirectoryNode } from '../lib/ontologyModel'

interface ModelCatalogPanelProps {
  node: DirectoryNode | null
  model: OntologyModel
  editable?: boolean
  onEdit?: () => void
}

export function ModelCatalogPanel({ node, model, editable, onEdit }: ModelCatalogPanelProps) {
  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center text-slate-400">
        <Box className="mb-3 h-10 w-10 text-slate-200" />
        <p className="text-sm font-medium text-slate-600">选择目录项查看详情</p>
        <p className="mt-1 text-xs">对象、属性、关系、字典、规则、逻辑均可浏览与编辑</p>
      </div>
    )
  }

  const meta = node.meta ?? {}

  if (node.type === 'object' && meta.key) {
    const obj = model.objects.find((o) => o.key === meta.key)
    if (!obj) return null
    return (
      <DetailShell icon={Box} title={obj.name} badge={`#${obj.key}`} editable={editable} onEdit={onEdit}>
        <Row label="继承自" value={obj.parent} />
        {obj.source && <Row label="来源" value={obj.source} />}
        <Row label="数据属性" value={`${obj.dataProperties.length} 项`} />
        <Row label="关系" value={`${obj.relations.length} 项`} />
        {obj.comment && <Row label="Comment" value={obj.comment} />}
      </DetailShell>
    )
  }

  if (node.type === 'property' && meta.objectKey && meta.propertyId) {
    const obj = model.objects.find((o) => o.key === meta.objectKey)
    const prop = obj?.dataProperties.find((p) => p.id === meta.propertyId)
    if (!prop || !obj) return null
    return (
      <DetailShell icon={Tag} title={prop.name} badge={prop.type} editable={editable} onEdit={onEdit}>
        <Row label="所属对象" value={obj.name} />
        <Row label="标识" value={`#${prop.key ?? prop.id}`} mono />
        <Row label="数据类型" value={prop.type} />
        {prop.desc && <Row label="说明" value={prop.desc} />}
        {prop.dictionary && <Row label="关联字典" value={prop.dictionary.dictName} />}
      </DetailShell>
    )
  }

  if (node.type === 'relation' && meta.domainKey && meta.relationId) {
    const obj = model.objects.find((o) => o.key === meta.domainKey)
    const rel = obj?.relations.find((r) => r.id === meta.relationId)
    if (!rel || !obj) return null
    return (
      <DetailShell icon={Link2} title={rel.name} badge="ObjectProperty" editable={editable} onEdit={onEdit}>
        <DomainRange domain={obj.name} range={rel.target} relKey={rel.key ?? rel.id} />
        {rel.comment && <Row label="Comment" value={rel.comment} />}
        {rel.llmDesc && <Row label="LLM-Desc" value={rel.llmDesc} />}
      </DetailShell>
    )
  }

  if (node.type === 'dictionary' && meta.dictId) {
    const dict = model.dictionaries.find((d) => d.id === meta.dictId)
    if (!dict) return null
    return (
      <DetailShell icon={BookOpen} title={dict.name} badge={dict.code} editable={editable} onEdit={onEdit}>
        {dict.desc && <Row label="说明" value={dict.desc} />}
        <Row label="码值数量" value={`${dict.entryCount} 条`} />
        <div className="mt-3 space-y-1">
          {dict.entries.slice(0, 5).map((e) => (
            <div key={e.code} className="flex justify-between rounded bg-slate-50 px-3 py-1.5 text-sm">
              <span className="font-mono text-slate-700">{e.code}</span>
              <span className="text-slate-500">{e.displayName}</span>
            </div>
          ))}
        </div>
      </DetailShell>
    )
  }

  if (node.type === 'rule' && meta.ruleId) {
    const rule = model.rules.find((r) => r.id === meta.ruleId)
    if (!rule) return null
    return (
      <DetailShell icon={GitBranch} title={rule.name} badge={rule.domain} editable={editable} onEdit={onEdit}>
        <Row label="说明" value={rule.desc} />
      </DetailShell>
    )
  }

  if (node.type === 'logic-item' && meta.logicId) {
    const logic = model.logic.find((l) => l.id === meta.logicId)
    if (!logic) return null
    return (
      <DetailShell icon={Cpu} title={logic.name} badge={`${logic.toolCount} 工具`} editable={editable} onEdit={onEdit}>
        <Row label="说明" value={logic.desc} />
      </DetailShell>
    )
  }

  return null
}

function DetailShell({
  icon: Icon, title, badge, children, editable, onEdit,
}: {
  icon: typeof Box; title: string; badge: string; children: ReactNode
  editable?: boolean; onEdit?: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <Icon className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{badge}</span>
          </div>
        </div>
        {editable && onEdit && (
          <button onClick={onEdit} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            编辑
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className={`mt-0.5 text-sm text-slate-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}

function DomainRange({ domain, range, relKey }: { domain: string; range: string; relKey: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-4">
      <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-center">
        <p className="text-[10px] text-orange-500">Domain</p>
        <p className="text-sm font-semibold text-orange-800">{domain}</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-px w-6 border-t border-dashed border-slate-300" />
        <span className="my-0.5 font-mono text-[10px] text-blue-600">{relKey}</span>
        <div className="h-px w-6 border-t border-dashed border-slate-300" />
      </div>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-center">
        <p className="text-[10px] text-emerald-500">Range</p>
        <p className="text-sm font-semibold text-emerald-800">{range}</p>
      </div>
    </div>
  )
}
