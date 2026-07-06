import { useState } from 'react'
import { X, Database, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'
import type { VirtualDataMapping, FieldMapping } from './ObjectDataTab'
import type { DataProperty } from './ObjectDetailPanel'

interface ConfigureVirtualMappingModalProps {
  open: boolean
  onClose: () => void
  objectName: string
  properties: DataProperty[]
  existing?: VirtualDataMapping
  onSave: (mapping: VirtualDataMapping) => void
}

const hiveSources = [
  { id: 'hive-fz', name: 'hive-fz-ontology_db', label: 'Hive · hive-fz-ontology_db' },
  { id: 'hive-jf', name: 'hive-jf-ontology_db', label: 'Hive · hive-jf-ontology_db' },
]

const tablesBySource: Record<string, { schema: string; tables: { name: string; comment: string }[] }> = {
  'hive-fz': {
    schema: 'ontology_db',
    tables: [
      {
        name: 'dwd_ontology_vsop_evt_fraud_ab_card_disposal_report',
        comment: '号码关停处置上报明细表',
      },
      {
        name: 'dwd_ontology_call_event_detail',
        comment: '通话事件明细表',
      },
    ],
  },
  'hive-jf': {
    schema: 'ontology_db',
    tables: [
      { name: 'dwd_customer_profile', comment: '客户画像明细' },
    ],
  },
}

function slugField(name: string): string {
  const map: Record<string, string> = {
    二次实人未通过原因: 'auth_fail_reason',
    状态变更: 'change_reason',
    企业上报公司编码: 'company',
    是否投诉: 'complaint',
    投诉时间: 'complaint_time',
    数据类型: 'data_type',
    日期: 'dt',
    处置描述: 'disposal_desc',
    处置类型: 'disposal_type',
    处置结果: 'disposal_result',
    上报来源: 'report_source',
    风险等级: 'risk_level',
    关停原因: 'stop_reason',
    复开时间: 'resume_time',
    工单编号: 'order_id',
    操作人: 'operator',
    操作时间: 'operate_time',
    审批状态: 'approval_status',
    省份编码: 'province_code',
    城市编码: 'city_code',
    渠道类型: 'channel_type',
    备注: 'remark',
    创建时间: 'create_time',
    更新时间: 'update_time',
    数据来源: 'data_source',
  }
  return map[name] ?? name.toLowerCase().replace(/\s+/g, '_')
}

function buildFieldMappings(properties: DataProperty[]): FieldMapping[] {
  return properties.map((p, i) => ({
    id: `m${i + 1}`,
    sourceField: slugField(p.name),
    sourceType: p.type === 'int' || p.type === 'decimal' ? p.type : 'string',
    fieldComment: p.desc || p.name,
    targetProperty: p.name,
  }))
}

export function ConfigureVirtualMappingModal({
  open,
  onClose,
  objectName,
  properties,
  existing,
  onSave,
}: ConfigureVirtualMappingModalProps) {
  const [sourceId, setSourceId] = useState('hive-fz')
  const [tableName, setTableName] = useState(
    existing?.table ?? tablesBySource['hive-fz'].tables[0].name
  )

  const source = hiveSources.find((s) => s.id === sourceId) ?? hiveSources[0]
  const schemaInfo = tablesBySource[sourceId]
  const selectedTable = schemaInfo.tables.find((t) => t.name === tableName) ?? schemaInfo.tables[0]

  const handleSave = () => {
    onSave({
      dataSourceType: 'Hive',
      dataSourceName: source.name,
      schema: schemaInfo.schema,
      table: selectedTable.name,
      comment: selectedTable.comment,
      fieldMappings: buildFieldMappings(properties),
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">配置虚拟映射</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                为「{objectName}」关联 Hive 数据源，字段映射到数据属性
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">数据源</label>
            <div className="relative">
              <select
                value={sourceId}
                onChange={(e) => {
                  setSourceId(e.target.value)
                  setTableName(tablesBySource[e.target.value].tables[0].name)
                }}
                className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-3 pr-10 text-sm outline-none focus:border-violet-400"
              >
                {hiveSources.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">Schema</label>
            <input
              readOnly
              value={schemaInfo.schema}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">Table</label>
            <div className="relative">
              <select
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-3 pr-10 font-mono text-sm outline-none focus:border-violet-400"
              >
                {schemaInfo.tables.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="mt-1 text-xs text-slate-400">{selectedTable.comment}</p>
          </div>

          <div className="rounded-lg bg-violet-50 px-4 py-3 text-xs text-violet-700">
            将自动映射 {properties.length} 个数据属性到来源表字段（虚拟映射，数据保留在 Hive）
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">取消</button>
          <button
            onClick={handleSave}
            className={cn('rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700')}
          >
            确认关联
          </button>
        </div>
      </div>
    </div>
  )
}
