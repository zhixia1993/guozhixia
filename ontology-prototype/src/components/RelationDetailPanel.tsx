import { useState } from 'react'
import {
  ArrowLeft, Link2, FileText, Bot,
} from 'lucide-react'
import type { ObjectRelation, OntologyObject } from './ObjectDetailPanel'

interface RelationDetailPanelProps {
  relation: ObjectRelation
  domainObject: OntologyObject
  rangeName: string
  onBack: () => void
  onUpdate: (relation: ObjectRelation) => void
}

export function RelationDetailPanel({
  relation, domainObject, rangeName, onBack, onUpdate,
}: RelationDetailPanelProps) {
  const [comment, setComment] = useState(relation.comment ?? relation.desc ?? '')
  const [llmDesc, setLlmDesc] = useState(relation.llmDesc ?? '')
  const [descTab, setDescTab] = useState<'comment' | 'llmDesc'>('comment')

  const handleSave = () => {
    onUpdate({ ...relation, comment, llmDesc, desc: comment })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> 返回关系列表
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{relation.name}</h2>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                #{relation.key ?? relation.id}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              ObjectProperty · 定义域 <span className="font-medium text-slate-700">{domainObject.name}</span>
            </p>
          </div>
        </div>

        {/* Domain → Relation → Range */}
        <div className="mt-5 flex items-center justify-center gap-3 rounded-xl bg-slate-50 py-4">
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-center">
            <p className="text-[10px] font-medium uppercase text-orange-500">Domain</p>
            <p className="text-sm font-semibold text-orange-800">{domainObject.name}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-px w-8 border-t-2 border-dashed border-slate-300" />
            <span className="my-1 rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] text-blue-700">
              {relation.key ?? relation.id}
            </span>
            <div className="h-px w-8 border-t-2 border-dashed border-slate-300" />
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-center">
            <p className="text-[10px] font-medium uppercase text-emerald-500">Range</p>
            <p className="text-sm font-semibold text-emerald-800">{rangeName}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/2 flex-col border-r border-slate-200">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-semibold text-slate-900">关系与约束配置</h3>
            <p className="text-xs text-slate-400">Constraints</p>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Cardinality</p>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                Functional（函数式）
              </label>
              <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                Inverse Functional（逆函数式）
              </label>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Inverse Of</p>
              <input
                placeholder="逆关系标识（可选）"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="flex w-1/2 flex-col">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-semibold text-slate-900">语义描述</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-3 flex gap-4 border-b border-slate-200">
              <button
                onClick={() => setDescTab('comment')}
                className={`pb-2 text-sm font-medium ${descTab === 'comment' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}
              >
                <FileText className="mr-1 inline h-3.5 w-3.5" /> Comment
              </button>
              <button
                onClick={() => setDescTab('llmDesc')}
                className={`pb-2 text-sm font-medium ${descTab === 'llmDesc' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}
              >
                <Bot className="mr-1 inline h-3.5 w-3.5" /> LLM-Desc
              </button>
            </div>
            {descTab === 'comment' ? (
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={8}
                placeholder="简要描述该关系的业务含义..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            ) : (
              <textarea
                value={llmDesc}
                onChange={(e) => setLlmDesc(e.target.value)}
                rows={8}
                placeholder="面向 LLM 的语义描述..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            )}
          </div>
          <div className="border-t border-slate-100 p-4">
            <button
              onClick={handleSave}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              保存关系
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
