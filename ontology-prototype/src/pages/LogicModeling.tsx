import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus, Search, Save, Play, Send, ChevronDown, Plug } from 'lucide-react'

const mcpCategories = [
  {
    name: '数据查询类',
    tools: [
      { name: 'getUserInfo', desc: '获取用户基本信息' },
      { name: 'queryCallLog', desc: '查询通话记录' },
      { name: 'queryBillHistory', desc: '查询账单历史' },
    ],
  },
  {
    name: '业务操作类',
    tools: [
      { name: 'submitTicket', desc: '提交工单' },
      { name: 'traceSource', desc: '溯源分析' },
      { name: 'updateUserStatus', desc: '更新用户状态' },
    ],
  },
  {
    name: '通知类',
    tools: [
      { name: 'sendAlert', desc: '发送告警通知' },
      { name: 'sendSMS', desc: '发送短信' },
    ],
  },
]

const defaultMd = `---
name: 反诈关停溯源
version: 1.0.0
ontology: 反诈溯源本体
mcp_tools: [getUserInfo, queryCallLog, traceSource]
---

# 反诈关停溯源技能

## 技能说明
当收到关停工单时，自动溯源分析用户通话行为，
判断关停是否合理并生成溯源报告。

## 触发条件
- 收到类型为「反诈关停」的工单
- 工单状态为「待处理」

## 输入参数
| 参数 | 类型 | 说明 |
|------|------|------|
| ticketId | string | 工单编号 |
| userId | string | 用户ID |

## 执行逻辑
1. 调用 \`{{getUserInfo}}\` 获取用户基本信息
2. 调用 \`{{queryCallLog}}\` 查询近30天通话记录
3. 分析异常通话模式（高频呼叫、陌生号码等）
4. 调用 \`{{traceSource}}\` 执行溯源分析
5. 生成溯源报告并更新工单状态

## 输出
- 溯源结论：合理关停 / 误关停 / 需人工复核
- 溯源报告文档链接`

export function LogicModeling() {
  const [content, setContent] = useState(defaultMd)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '数据查询类': true, '业务操作类': true, '通知类': false })
  const [search, setSearch] = useState('')

  const insertMcp = (name: string) => {
    setContent((prev) => prev + `\n调用 {{${name}}}`)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/modeling" className="text-slate-400 hover:text-slate-600">本体建模</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="font-medium text-slate-900">逻辑建模</span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Plus className="h-4 w-4" /> 新建技能
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Play className="h-4 w-4" /> 预览运行
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Save className="h-4 w-4" /> 保存
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
            <Send className="h-4 w-4" /> 提交审核
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col border-r border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-100 text-[10px] font-bold text-indigo-700">MD</div>
            <span className="text-sm font-medium text-slate-700">反诈关停溯源.md</span>
            <span className="ml-auto text-xs text-slate-400">自动保存于 刚刚</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none bg-[#1e1e2e] p-5 font-mono text-sm leading-relaxed text-slate-300 outline-none"
            spellCheck={false}
          />
        </div>

        <aside className="w-80 shrink-0 bg-white overflow-y-auto">
          <div className="border-b border-slate-100 p-4">
            <div className="mb-1 flex items-center gap-2">
              <Plug className="h-4 w-4 text-indigo-600" />
              <h3 className="font-semibold text-slate-900">MCP 接口面板</h3>
            </div>
            <p className="text-xs text-slate-500">点击插入到编辑器光标位置</p>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索 MCP..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div className="p-3">
            {mcpCategories.map((cat) => (
              <div key={cat.name} className="mb-2">
                <button
                  onClick={() => setExpanded({ ...expanded, [cat.name]: !expanded[cat.name] })}
                  className="flex w-full items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${expanded[cat.name] ? '' : '-rotate-90'}`} />
                  {cat.name}
                  <span className="ml-auto text-xs text-slate-400">{cat.tools.length}</span>
                </button>
                {expanded[cat.name] && cat.tools
                  .filter((t) => !search || t.name.includes(search) || t.desc.includes(search))
                  .map((tool) => (
                    <div key={tool.name} className="ml-3 mb-1 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{tool.name}</p>
                        <p className="truncate text-xs text-slate-400">{tool.desc}</p>
                      </div>
                      <button
                        onClick={() => insertMcp(tool.name)}
                        className="shrink-0 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
                      >
                        + 插入
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
