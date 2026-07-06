import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface Step {
  label: string
  description?: string
}

interface StepWizardProps {
  steps: Step[]
  current: number
}

export function StepWizard({ steps, current }: StepWizardProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all',
                i < current ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' :
                i === current ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-200' :
                'bg-slate-100 text-slate-400'
              )}
            >
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn('mt-2 text-xs font-medium', i <= current ? 'text-indigo-700' : 'text-slate-400')}>{step.label}</span>
            {step.description && <span className="mt-0.5 text-[10px] text-slate-400">{step.description}</span>}
          </div>
          {i < steps.length - 1 && (
            <div className={cn('mx-4 h-0.5 w-16 sm:w-24', i < current ? 'bg-indigo-400' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  )
}
