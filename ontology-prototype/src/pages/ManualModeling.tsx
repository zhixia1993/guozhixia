import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Plus, ChevronRight, Save, Send, Share2,
  ZoomIn, ZoomOut, Maximize2, Network, List,
} from 'lucide-react'
import { GraphCanvas } from '../components/GraphCanvas'
import { StatusBadge } from '../components/StatusBadge'
import { Modal } from '../components/Modal'
import { CreateObjectModal } from '../components/CreateObjectModal'
import { CreateRelationModal } from '../components/CreateRelationModal'
import {
  ObjectDetailPanel,
  ObjectSidebar,
  type OntologyObject,
} from '../components/ObjectDetailPanel'
import { cardDisposalDataMapping } from '../components/ObjectDataTab'
import { cn } from '../lib/utils'

const cardDisposalProps = [
  { id: 'p1', name: '二次实人未通过原因', desc: '二次实人认证未通过的具体原因', type: 'string' },
  { id: 'p2', name: '状态变更', desc: '号码处置状态变更记录', type: 'string' },
  { id: 'p3', name: '企业上报公司编码', desc: '上报企业的公司编码', type: 'string' },
  { id: 'p4', name: '是否投诉', desc: '用户是否发起投诉', type: 'string' },
  { id: 'p5', name: '投诉时间', desc: '投诉发生时间', type: 'string' },
  { id: 'p6', name: '数据类型', desc: '数据来源类型标识', type: 'string' },
  { id: 'p7', name: '日期', desc: '处置日期', type: 'string' },
  { id: 'p8', name: '处置描述', desc: '号码处置的详细描述', type: 'string' },
  { id: 'p9', name: '处置类型', desc: '关停/复开等处置类型', type: 'string' },
  { id: 'p10', name: '处置结果', desc: '处置执行结果', type: 'string' },
  { id: 'p11', name: '上报来源', desc: '数据上报来源渠道', type: 'string' },
  { id: 'p12', name: '风险等级', desc: '风险评估等级', type: 'string' },
  { id: 'p13', name: '关停原因', desc: '号码关停原因分类', type: 'string' },
  { id: 'p14', name: '复开时间', desc: '号码复开时间', type: 'string' },
  { id: 'p15', name: '工单编号', desc: '关联工单编号', type: 'string' },
  { id: 'p16', name: '操作人', desc: '处置操作人', type: 'string' },
  { id: 'p17', name: '操作时间', desc: '处置操作时间', type: 'string' },
  { id: 'p18', name: '审批状态', desc: '审批流程状态', type: 'string' },
  { id: 'p19', name: '省份编码', desc: '归属省份编码', type: 'string' },
  { id: 'p20', name: '城市编码', desc: '归属城市编码', type: 'string' },
  { id: 'p21', name: '渠道类型', desc: '业务渠道类型', type: 'string' },
  { id: 'p22', name: '备注', desc: '补充备注信息', type: 'string' },
  { id: 'p23', name: '创建时间', desc: '记录创建时间', type: 'string' },
  { id: 'p24', name: '更新时间', desc: '记录最后更新时间', type: 'string' },
  { id: 'p25', name: '数据来源', desc: '原始数据来源系统', type: 'string' },
]

const initialObjects: OntologyObject[] = [
  {
    name: '号码关停',
    key: 'card_disposal',
    parent: 'Thing (Root)',
    source: 'anti_fraud_0428.ttl',
    comment: '',
    llmComment: '',
    dataProperties: cardDisposalProps,
    relations: [],
    actions: [],
    dataMapping: cardDisposalDataMapping,
  },
  {
    name: '基站',
    key: 'base_station',
    parent: 'Thing (Root)',
    dataProperties: [{ id: 'bs1', name: '基站编号', desc: '基站唯一标识', type: 'string' }],
    relations: [],
    actions: [],
  },
  {
    name: '通话事件',
    key: 'call_event',
    parent: 'Thing (Root)',
    dataProperties: [
      { id: 'ce1', name: '通话时长', desc: '通话持续秒数', type: 'int' },
      { id: 'ce2', name: '主叫号码', desc: '主叫方号码', type: 'string' },
    ],
    relations: [{ id: 'r1', name: '关联基站', target: '基站' }],
    actions: [],
  },
  {
    name: '通信事件',
    key: 'comm_event',
    parent: 'Thing (Root)',
    dataProperties: [],
    relations: [],
    actions: [],
  },
  {
    name: '用户/客户',
    key: 'customer',
    parent: 'Thing (Root)',
    dataProperties: [
      { id: 'cu1', name: '客户编号', desc: '', type: 'string' },
      { id: 'cu2', name: '客户名称', desc: '', type: 'string' },
      { id: 'cu3', name: '证件号码', desc: '', type: 'string' },
      { id: 'cu4', name: '联系电话', desc: '', type: 'string' },
    ],
    relations: [],
    actions: [],
  },
  {
    name: '手机号码',
    key: 'mobile_number',
    parent: 'Thing (Root)',
    dataProperties: [
      { id: 'mn1', name: '号码', desc: '手机号码', type: 'string' },
      { id: 'mn2', name: '归属地', desc: '', type: 'string' },
      { id: 'mn3', name: '运营商', desc: '', type: 'string' },
      { id: 'mn4', name: '状态', desc: '正常/停机/销户', type: 'string' },
    ],
    relations: [{ id: 'r2', name: '归属客户', target: '用户/客户' }],
    actions: [],
  },
  {
    name: '用户',
    key: 'user',
    parent: 'Thing (Root)',
    dataProperties: [
      { id: 'u1', name: '用户ID', desc: '', type: 'string' },
      { id: 'u2', name: '姓名', desc: '', type: 'string' },
      { id: 'u3', name: '状态', desc: '', type: 'enum' },
      { id: 'u4', name: '欠费天数', desc: '', type: 'int' },
    ],
    relations: [],
    actions: [],
  },
  {
    name: '账户',
    key: 'account',
    parent: '用户',
    dataProperties: [
      { id: 'a1', name: '账户ID', desc: '', type: 'string' },
      { id: 'a2', name: '余额', desc: '', type: 'decimal' },
    ],
    relations: [],
    actions: [],
  },
]

const graphNodes = [
  { id: 'user', label: '用户', x: 200, y: 150, type: 'entity' as const },
  { id: 'account', label: '账户', x: 420, y: 100, type: 'entity' as const },
  { id: 'mobile', label: '手机号码', x: 420, y: 220, type: 'entity' as const },
  { id: 'disposal', label: '号码关停', x: 640, y: 160, type: 'entity' as const },
]

const graphEdges = [
  { from: 'user', to: 'account', label: '包含' },
  { from: 'user', to: 'mobile', label: '拥有' },
  { from: 'mobile', to: 'disposal', label: '触发' },
]

export function ManualModeling() {
  const { id } = useParams<{ id: string }>()
  const [objects, setObjects] = useState<OntologyObject[]>(initialObjects)
  const [selectedObjectKey, setSelectedObjectKey] = useState('card_disposal')
  const [objectSearch, setObjectSearch] = useState('')
  const [viewMode, setViewMode] = useState<'detail' | 'graph'>('detail')
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showCreateObject, setShowCreateObject] = useState(false)
  const [showCreateRelation, setShowCreateRelation] = useState(false)

  const selectedObject = useMemo(
    () => objects.find((o) => o.key === selectedObjectKey) ?? objects[0],
    [objects, selectedObjectKey]
  )

  const objectNames = objects.map((o) => o.name)

  const handleCreateObject = (data: { name: string; key: string; parent: string }) => {
    const newObj: OntologyObject = {
      name: data.name,
      key: data.key.toLowerCase().replace(/^ontology_/, ''),
      parent: data.parent === 'Thing' ? 'Thing (Root)' : data.parent,
      dataProperties: [],
      relations: [],
    actions: [],
    }
    setObjects((prev) => [...prev, newObj])
    setSelectedObjectKey(newObj.key)
    setViewMode('detail')
  }

  const handleUpdateObject = (updated: OntologyObject) => {
    setObjects((prev) => prev.map((o) => (o.key === updated.key ? updated : o)))
  }

  const handleCreateRelation = (data: { name: string; domain: string; range: string }) => {
    const domainObj = objects.find((o) => o.name === data.domain)
    if (!domainObj) return
    const newRel = {
      id: `rel-${Date.now()}`,
      name: data.name,
      target: data.range,
    }
    setObjects((prev) =>
      prev.map((o) =>
        o.key === domainObj.key
          ? { ...o, relations: [...o.relations, newRel] }
          : o
      )
    )
    setSelectedObjectKey(domainObj.key)
    setViewMode('detail')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <Link to="/modeling/manual/create" className="text-sm text-slate-400 hover:text-slate-600">创建空白本体</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-sm font-medium text-slate-900">专家自主建模</span>
          {id && <span className="rounded bg-violet-50 px-2 py-0.5 font-mono text-xs text-violet-600">ontology_{id}</span>}
          <StatusBadge status="draft" />
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-2 flex rounded-lg border border-slate-200 p-0.5">
            <button
              onClick={() => setViewMode('detail')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
                viewMode === 'detail' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <List className="h-4 w-4" /> 对象编辑
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
                viewMode === 'graph' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <Network className="h-4 w-4" /> 图视图
            </button>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Save className="h-4 w-4" /> 保存
          </button>
          <button onClick={() => setShowAuditModal(true)} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Send className="h-4 w-4" /> 提交审核
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Share2 className="h-4 w-4" /> 共享
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Object sidebar */}
        <ObjectSidebar
          objects={objects}
          selectedKey={selectedObjectKey}
          onSelect={(key) => {
            setSelectedObjectKey(key)
            setViewMode('detail')
          }}
          search={objectSearch}
          onSearchChange={setObjectSearch}
          onAddObject={() => setShowCreateObject(true)}
        />

        {/* Main content */}
        {viewMode === 'detail' ? (
          <div className="flex-1 overflow-hidden">
            {selectedObject && (
              <ObjectDetailPanel object={selectedObject} onUpdate={handleUpdateObject} />
            )}
          </div>
        ) : (
          <div className="relative flex-1 p-4">
            <div className="absolute right-6 top-6 z-10 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><ZoomIn className="h-4 w-4" /></button>
              <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><ZoomOut className="h-4 w-4" /></button>
              <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><Maximize2 className="h-4 w-4" /></button>
            </div>
            <GraphCanvas
              nodes={graphNodes}
              edges={graphEdges}
              selectedId={selectedObjectKey}
              onNodeClick={(nodeId) => {
                const keyMap: Record<string, string> = {
                  user: 'user',
                  account: 'account',
                  mobile: 'mobile_number',
                  disposal: 'card_disposal',
                }
                const key = keyMap[nodeId]
                if (key) {
                  setSelectedObjectKey(key)
                  setViewMode('detail')
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Secondary actions bar for relations */}
      <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-5 py-2">
        <button
          onClick={() => setShowCreateRelation(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Plus className="h-3.5 w-3.5" /> 添加关系
        </button>
        <span className="text-xs text-slate-400">点击左侧对象查看/编辑数据属性与关系</span>
      </div>

      <Modal
        open={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        title="提交审核"
        footer={
          <>
            <button onClick={() => setShowAuditModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">取消</button>
            <button onClick={() => setShowAuditModal(false)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">确认提交</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">指派审核人</label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
              <option>李审核（领域专家）</option>
              <option>王审核（架构师）</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">变更说明</label>
            <textarea rows={3} placeholder="说明本次建模的内容和变更..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="rounded border-slate-300 text-indigo-600" />
            审核通过后同时共享到本体资源广场
          </label>
        </div>
      </Modal>

      <CreateObjectModal
        open={showCreateObject}
        onClose={() => setShowCreateObject(false)}
        onCreate={handleCreateObject}
        parentOptions={[
          { value: 'Thing', label: 'Thing (Root)' },
          ...objectNames.map((name) => ({ value: name, label: name })),
        ]}
      />
      <CreateRelationModal
        open={showCreateRelation}
        onClose={() => setShowCreateRelation(false)}
        onCreate={handleCreateRelation}
        objectOptions={objectNames}
      />
    </div>
  )
}
