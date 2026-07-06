import type { OntologyObject, DataProperty, ObjectRelation } from '../components/ObjectDetailPanel'
import type { DictionaryInfo } from '../types/dictionary'
import { cardDisposalDataMapping } from '../components/ObjectDataTab'

export interface RuleItem {
  id: string
  name: string
  desc: string
  domain: string
}

export interface LogicItem {
  id: string
  name: string
  desc: string
  toolCount: number
}

export interface OntologyModel {
  id: string
  name: string
  version: string
  objects: OntologyObject[]
  dictionaries: DictionaryInfo[]
  rules: RuleItem[]
  logic: LogicItem[]
}

export interface FlatProperty {
  property: DataProperty
  objectKey: string
  objectName: string
}

export interface FlatRelation {
  relation: ObjectRelation
  domainKey: string
  domainName: string
}

export type DirectoryNodeType =
  | 'objects' | 'object'
  | 'properties' | 'property'
  | 'relations' | 'relation'
  | 'dictionaries' | 'dictionary'
  | 'rules' | 'rule'
  | 'logic' | 'logic-item'

export interface DirectoryNode {
  id: string
  type: DirectoryNodeType
  label: string
  subtitle?: string
  children?: DirectoryNode[]
  meta?: Record<string, string>
}

const cardDisposalProps: DataProperty[] = [
  { id: 'p1', name: '二次实人未通过原因', desc: '二次实人认证未通过的具体原因', type: 'string' },
  { id: 'p2', name: '状态变更', desc: '号码处置状态变更记录', type: 'string' },
  { id: 'p9', name: '处置类型', desc: '关停/复开等处置类型', type: 'string' },
  { id: 'p13', name: '关停原因', desc: '号码关停原因分类', type: 'string' },
]

export const defaultOntologyObjects: OntologyObject[] = [
  {
    name: '号码关停', key: 'card_disposal', parent: 'Thing (Root)',
    source: 'anti_fraud_0428.ttl', comment: '', llmComment: '',
    dataProperties: cardDisposalProps, relations: [], actions: [],
    dataMapping: cardDisposalDataMapping,
  },
  {
    name: '基站', key: 'base_station', parent: 'Thing (Root)',
    dataProperties: [{ id: 'bs1', name: '基站编号', key: 'station_id', desc: '基站唯一标识', type: 'string' }],
    relations: [], actions: [],
  },
  {
    name: '通话事件', key: 'call_event', parent: 'Thing (Root)',
    dataProperties: [
      { id: 'acct_item_type_a', name: '费用1帐目类型', key: 'acct_item_type_a', parent: 'topDataProperty', desc: '费用1帐目类型', type: 'int', constraints: { mandatory: false } },
      { id: 'ce1', name: '通话时长', key: 'duration', desc: '通话持续秒数', type: 'int' },
      { id: 'ce2', name: '主叫号码', key: 'caller', desc: '主叫方号码', type: 'string' },
    ],
    relations: [{ id: 'r1', name: '关联基站', key: 'relates_to_station', target: '基站', comment: '通话发生的基站' }],
    actions: [],
  },
  {
    name: '用户/客户', key: 'customer', parent: 'Thing (Root)',
    dataProperties: [
      { id: 'cu1', name: '客户编号', key: 'customer_id', desc: '', type: 'string' },
      { id: 'cu2', name: '客户名称', key: 'customer_name', desc: '', type: 'string' },
    ],
    relations: [], actions: [],
  },
  {
    name: '手机号码', key: 'mobile_number', parent: 'Thing (Root)',
    dataProperties: [
      { id: 'mn1', name: '号码', key: 'number', desc: '手机号码', type: 'string' },
      { id: 'mn4', name: '状态', key: 'status', desc: '正常/停机/销户', type: 'enum' },
    ],
    relations: [{ id: 'r2', name: '归属客户', key: 'belongs_to_customer', target: '用户/客户', comment: '号码归属客户' }],
    actions: [],
  },
  {
    name: '用户', key: 'user', parent: 'Thing (Root)',
    dataProperties: [
      { id: 'u1', name: '用户ID', key: 'user_id', desc: '', type: 'string' },
      { id: 'u2', name: '姓名', key: 'name', desc: '', type: 'string' },
      { id: 'u3', name: '状态', key: 'status', desc: '', type: 'enum' },
      { id: 'u4', name: '欠费天数', key: 'overdue_days', desc: '', type: 'int' },
    ],
    relations: [
      { id: 'r3', name: '包含', key: 'contains', target: '账户', comment: '用户包含账户' },
      { id: 'r4', name: '拥有', key: 'owns', target: '手机号码', comment: '用户拥有手机号码' },
    ],
    actions: [],
  },
  {
    name: '账户', key: 'account', parent: '用户',
    dataProperties: [
      { id: 'a1', name: '账户ID', key: 'account_id', desc: '', type: 'string' },
      { id: 'a2', name: '余额', key: 'balance', desc: '', type: 'decimal' },
    ],
    relations: [], actions: [],
  },
]

export const defaultDictionaries: DictionaryInfo[] = [
  {
    id: 'dict-contract', name: '合同状态', code: 'contract_status', desc: '合同状态枚举',
    entryCount: 2,
    entries: [
      { code: 'INVALID', displayName: '失效', label: '失效', comment: '合同已失效' },
      { code: 'TERMINATED', displayName: '终止', label: '终止', comment: '合同已终止' },
    ],
  },
]

export const defaultRules: RuleItem[] = [
  { id: 'rule1', name: '欠费停机规则', desc: '欠费超过30天自动停机', domain: '电信经分' },
  { id: 'rule2', name: '复机校验规则', desc: '复机前校验实名与欠费状态', domain: '电信经分' },
  { id: 'rule3', name: '反诈预警规则', desc: '高风险号码预警处置', domain: '反诈溯源' },
]

export const defaultLogic: LogicItem[] = [
  { id: 'logic1', name: '经分问答技能', desc: '基于本体的经分数据问答', toolCount: 5 },
  { id: 'logic2', name: '反诈溯源技能', desc: '号码关停溯源分析', toolCount: 3 },
]

export function getDefaultOntologyModel(id = '1'): OntologyModel {
  return {
    id,
    name: '电信经分本体',
    version: 'v1.2',
    objects: defaultOntologyObjects,
    dictionaries: defaultDictionaries,
    rules: defaultRules,
    logic: defaultLogic,
  }
}

export function flattenProperties(objects: OntologyObject[]): FlatProperty[] {
  return objects.flatMap((obj) =>
    obj.dataProperties.map((property) => ({
      property,
      objectKey: obj.key,
      objectName: obj.name,
    }))
  )
}

export function flattenRelations(objects: OntologyObject[]): FlatRelation[] {
  return objects.flatMap((obj) =>
    obj.relations.map((relation) => ({
      relation: { ...relation, domain: relation.domain ?? obj.name },
      domainKey: obj.key,
      domainName: obj.name,
    }))
  )
}

export function buildGraphFromObjects(objects: OntologyObject[]) {
  const cols = Math.ceil(Math.sqrt(objects.length))
  const nodes = objects.map((obj, i) => ({
    id: obj.key,
    label: obj.name,
    x: 120 + (i % cols) * 200,
    y: 100 + Math.floor(i / cols) * 140,
    type: 'entity' as const,
  }))

  const nameToKey = Object.fromEntries(objects.map((o) => [o.name, o.key]))
  const edges: { from: string; to: string; label: string }[] = []

  for (const obj of objects) {
    for (const rel of obj.relations) {
      const toKey = nameToKey[rel.target]
      if (toKey) edges.push({ from: obj.key, to: toKey, label: rel.name })
    }
  }

  return { nodes, edges }
}

export function buildDirectoryTree(model: OntologyModel): DirectoryNode[] {
  const props = flattenProperties(model.objects)
  const rels = flattenRelations(model.objects)

  return [
    {
      id: 'cat-objects', type: 'objects', label: `对象 (${model.objects.length})`,
      children: model.objects.map((o) => ({
        id: `obj-${o.key}`, type: 'object' as const, label: o.name,
        subtitle: `#${o.key}`, meta: { key: o.key },
      })),
    },
    {
      id: 'cat-properties', type: 'properties', label: `属性 (${props.length})`,
      children: props.map(({ property, objectKey, objectName }) => ({
        id: `prop-${objectKey}-${property.id}`, type: 'property' as const,
        label: property.name, subtitle: `${objectName} · ${property.type}`,
        meta: { objectKey, propertyId: property.id },
      })),
    },
    {
      id: 'cat-relations', type: 'relations', label: `关系 (${rels.length})`,
      children: rels.map(({ relation, domainKey, domainName }) => ({
        id: `rel-${domainKey}-${relation.id}`, type: 'relation' as const,
        label: relation.name, subtitle: `${domainName} → ${relation.target}`,
        meta: { domainKey, relationId: relation.id },
      })),
    },
    {
      id: 'cat-dictionaries', type: 'dictionaries', label: `字典 (${model.dictionaries.length})`,
      children: model.dictionaries.map((d) => ({
        id: `dict-${d.id}`, type: 'dictionary' as const, label: d.name,
        subtitle: d.code, meta: { dictId: d.id },
      })),
    },
    {
      id: 'cat-rules', type: 'rules', label: `规则 (${model.rules.length})`,
      children: model.rules.map((r) => ({
        id: `rule-${r.id}`, type: 'rule' as const, label: r.name,
        subtitle: r.domain, meta: { ruleId: r.id },
      })),
    },
    {
      id: 'cat-logic', type: 'logic', label: `逻辑 (${model.logic.length})`,
      children: model.logic.map((l) => ({
        id: `logic-${l.id}`, type: 'logic-item' as const, label: l.name,
        subtitle: `${l.toolCount} MCP 工具`, meta: { logicId: l.id },
      })),
    },
  ]
}
