import { Database, ArrowRight, RefreshCw, Eye, Unlink } from 'lucide-react'

export interface FieldMapping {
  id: string
  sourceField: string
  sourceType: string
  fieldComment: string
  targetProperty: string
}

export interface VirtualDataMapping {
  dataSourceType: string
  dataSourceName: string
  schema: string
  table: string
  comment?: string
  fieldMappings: FieldMapping[]
}

interface ObjectDataTabProps {
  mapping?: VirtualDataMapping
  onChangeMapping?: () => void
  onUnbind?: () => void
}

export function ObjectDataTab({ mapping, onChangeMapping, onUnbind }: ObjectDataTabProps) {
  if (!mapping) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Database className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">尚未关联数据</h3>
        <p className="mb-6 max-w-sm text-center text-sm text-slate-500">
          通过虚拟映射将数据接入源中的表字段关联到当前对象的数据属性
        </p>
        <button
          onClick={onChangeMapping}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          配置虚拟映射
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mapping type badge - 仅虚拟映射 */}
      <div className="border-b border-slate-100 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">映射类型</span>
          <span className="rounded-lg bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            虚拟映射
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: 数据集配置 */}
        <div className="flex w-[42%] flex-col border-r border-slate-200 bg-slate-50/30">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-semibold text-slate-900">数据集配置</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* DATA SOURCE */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Data Source</p>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                        {mapping.dataSourceType}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate font-mono text-sm font-medium text-slate-800">
                      {mapping.dataSourceName}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={onUnbind}
                      className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-red-600"
                    >
                      <Unlink className="mr-0.5 inline h-3 w-3" />
                      解绑
                    </button>
                    <button
                      onClick={onChangeMapping}
                      className="rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      更改
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SCHEMA */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Schema</p>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-mono text-sm text-slate-800">
                {mapping.schema}
              </div>
            </div>

            {/* TABLE */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Table</p>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-mono text-xs leading-relaxed text-slate-800 break-all">
                {mapping.table}
              </div>
            </div>

            {/* COMMENT */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Comment</p>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500">
                {mapping.comment || '暂无'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: 字段映射 */}
        <div className="flex w-[58%] flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-semibold text-slate-900">字段映射</h3>
            <div className="flex gap-2">
              <button
                onClick={onChangeMapping}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                更改字段映射
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                <Eye className="h-3.5 w-3.5" />
                数据校验与预览
              </button>
            </div>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_24px_1fr_1fr] gap-2 border-b border-slate-100 bg-slate-50/80 px-5 py-2.5 text-xs font-medium text-slate-500">
            <span>来源字段</span>
            <span />
            <span>字段注释</span>
            <span>目标属性</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mapping.fieldMappings.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_24px_1fr_1fr] gap-2 border-b border-slate-50 px-5 py-3 hover:bg-slate-50/50 items-center"
              >
                <div>
                  <p className="font-mono text-sm text-slate-800">{row.sourceField}</p>
                  <p className="text-[10px] text-slate-400">{row.sourceType}</p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                </div>
                <p className="text-sm text-slate-600">{row.fieldComment}</p>
                <span className="inline-flex w-fit rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                  {row.targetProperty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** 号码关停默认虚拟映射数据 */
export const cardDisposalDataMapping: VirtualDataMapping = {
  dataSourceType: 'HIVE_KYUUBI',
  dataSourceName: 'hive-fz-ontology_db',
  schema: 'ontology_db',
  table: 'dwd_ontology_vsop_evt_fraud_ab_card_disposal_rep',
  comment: '',
  fieldMappings: [
    { id: 'm1', sourceField: 'auth_fail_reason', sourceType: 'string', fieldComment: '二次实人未通过原因', targetProperty: '二次实人未通过原因' },
    { id: 'm2', sourceField: 'change_reason', sourceType: 'string', fieldComment: '状态变更', targetProperty: '状态变更' },
    { id: 'm3', sourceField: 'company', sourceType: 'string', fieldComment: '企业上报公司编码', targetProperty: '企业上报公司编码' },
    { id: 'm4', sourceField: 'complaint', sourceType: 'string', fieldComment: '是否投诉', targetProperty: '是否投诉' },
    { id: 'm5', sourceField: 'complaint_time', sourceType: 'string', fieldComment: '投诉时间', targetProperty: '投诉时间' },
    { id: 'm6', sourceField: 'data_type', sourceType: 'string', fieldComment: '数据类型', targetProperty: '数据类型' },
    { id: 'm7', sourceField: 'dt', sourceType: 'string', fieldComment: '日期', targetProperty: '日期' },
    { id: 'm8', sourceField: 'disposal_desc', sourceType: 'string', fieldComment: '处置描述', targetProperty: '处置描述' },
    { id: 'm9', sourceField: 'disposal_type', sourceType: 'string', fieldComment: '处置类型', targetProperty: '处置类型' },
    { id: 'm10', sourceField: 'disposal_result', sourceType: 'string', fieldComment: '处置结果', targetProperty: '处置结果' },
  ],
}
