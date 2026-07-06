import { useState, useRef } from 'react'
import { X, Upload, FileSpreadsheet, Download } from 'lucide-react'
import { cn } from '../lib/utils'
import type { CreateDictionaryData } from '../types/dictionary'

interface BulkImportDictionaryModalProps {
  open: boolean
  onClose: () => void
  onImport?: (dictionaries: CreateDictionaryData[]) => void
}

const CSV_TEMPLATE = `dict_name,dict_code,dict_desc,entry_code,entry_name
帐目类型字典,ACCT_ITEM_TYPE,电信经分帐目类型,01,语音通话费
帐目类型字典,ACCT_ITEM_TYPE,电信经分帐目类型,02,短信费
用户状态字典,USER_STATUS,用户状态枚举,0,正常
用户状态字典,USER_STATUS,用户状态枚举,1,欠费`

function parseCsv(text: string): CreateDictionaryData[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  const map = new Map<string, CreateDictionaryData>()

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim())
    if (cols.length < 5) continue
    const [dictName, dictCode, dictDesc, entryCode, entryName] = cols
    const key = dictCode
    if (!map.has(key)) {
      map.set(key, { name: dictName, code: dictCode, desc: dictDesc, entries: [] })
    }
    map.get(key)!.entries.push({ code: entryCode, displayName: entryName })
  }

  return Array.from(map.values())
}

export function BulkImportDictionaryModal({ open, onClose, onImport }: BulkImportDictionaryModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setFile(null)
    onClose()
  }

  const handleFile = (f: File) => {
    if (f.name.endsWith('.csv') || f.type === 'text/csv') setFile(f)
  }

  const handleImport = async () => {
    if (!file) return
    const text = await file.text()
    const dictionaries = parseCsv(text)
    if (dictionaries.length > 0) {
      onImport?.(dictionaries)
      handleClose()
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dictionary_import_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-200">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">批量导入字典</h2>
              <p className="mt-0.5 text-sm text-slate-500">上传 CSV 批量导入字典与码值</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <Download className="h-4 w-4" /> 下载 CSV 模板
          </button>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const f = e.dataTransfer.files[0]
              if (f) handleFile(f)
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
              dragOver ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
            <Upload className="mb-3 h-10 w-10 text-slate-300" />
            {file ? (
              <>
                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                <p className="mt-1 text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-700">点击或拖拽 CSV 文件到此处</p>
                <p className="mt-1 text-xs text-slate-400">支持 .csv 格式</p>
              </>
            )}
          </div>

          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-600">CSV 列说明</p>
            <p className="mt-1">dict_name, dict_code, dict_desc, entry_code, entry_name</p>
            <p className="mt-1">同一字典编码的多行将合并为一条字典记录</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            取消
          </button>
          <button
            onClick={handleImport}
            disabled={!file}
            className={cn(
              'rounded-lg px-5 py-2 text-sm font-medium',
              file ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'cursor-not-allowed bg-slate-200 text-slate-400'
            )}
          >
            开始导入
          </button>
        </div>
      </div>
    </div>
  )
}
