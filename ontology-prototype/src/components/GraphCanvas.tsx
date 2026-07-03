import { cn } from '../lib/utils'

interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  type: 'entity' | 'relation'
  selected?: boolean
}

interface GraphEdge {
  from: string
  to: string
  label: string
}

interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (id: string) => void
  selectedId?: string
  readOnly?: boolean
}

export function GraphCanvas({ nodes, edges, onNodeClick, selectedId, readOnly }: GraphCanvasProps) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>
        {edges.map((edge, i) => {
          const from = nodeMap[edge.from]
          const to = nodeMap[edge.to]
          if (!from || !to) return null
          const mx = (from.x + to.x) / 2
          const my = (from.y + to.y) / 2
          return (
            <g key={i}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x={mx - 28} y={my - 10} width="56" height="20" rx="10" fill="white" stroke="#e2e8f0" />
              <text x={mx} y={my + 4} textAnchor="middle" className="fill-slate-500 text-[11px] font-medium">{edge.label}</text>
            </g>
          )
        })}
      </svg>
      {nodes.map((node) => (
        <button
          key={node.id}
          onClick={() => !readOnly && onNodeClick?.(node.id)}
          className={cn(
            'graph-node absolute flex flex-col items-center',
            readOnly ? 'cursor-default' : 'cursor-pointer'
          )}
          style={{ left: node.x - 48, top: node.y - 28 }}
        >
          <div
            className={cn(
              'flex h-14 w-24 flex-col items-center justify-center rounded-xl border-2 bg-white shadow-sm',
              (selectedId === node.id || node.selected)
                ? 'border-indigo-500 shadow-indigo-100 ring-2 ring-indigo-100'
                : 'border-slate-200 hover:border-indigo-300'
            )}
          >
            <div className={cn('mb-1 h-2 w-2 rounded-full', node.type === 'entity' ? 'bg-indigo-500' : 'bg-violet-500')} />
            <span className="text-xs font-semibold text-slate-800">{node.label}</span>
          </div>
        </button>
      ))}
      <div className="absolute bottom-3 left-3 flex gap-2">
        <button className="rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur hover:bg-white">力导向</button>
        <button className="rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur hover:bg-white">层次</button>
        <button className="rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur hover:bg-white">环形</button>
      </div>
    </div>
  )
}
