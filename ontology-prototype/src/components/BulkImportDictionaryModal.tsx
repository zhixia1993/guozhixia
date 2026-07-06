import { useState, useRef } from 'react'
import { X, CloudUpload, FileText, Download } from 'lucide-react'
import { cn } from '../lib/utils'
import type { CreateDictionaryData } from '../types/dictionary'

interface BulkImportDictionaryModalProps {
  open: boolean
  onClose: () => void
  onImport?: (dictionaries: CreateDictionaryData[]) => void
}

const TEMPLATE_FIELDS = 'dictType, dictTypeLabel, codeValue, displayName, label, comment'

const CSV_TEMPLATE = `dictType,dictTypeLabel,codeValue,displayName,label,comment
STATUS,用户状态,0,正常,正常,用户状态枚举码表
STATUS,用户状态,1,欠费,欠费,用户状态枚举码表
STATUS,用户状态,2,停机,停机,用户状态枚举码表
ACCT_ITEM_TYPE,帐目类型,01,语音通话费,语音通话费,电信经分帐目类型码表
ACCT_ITEM_TYPE,帐目类型,02,短信费,短信费,电信经分帐目类型码表
DISPOSAL_TYPE,处置类型,STOP,关停,关停,号码处置类型码表
DISPOSAL_TYPE,处置类型,RESUME,复开,复开,号码处置类型码表`

const MAX_FILES = 3
const MAX_FILE_SIZE = 10 * 1024 * 1024

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  result.push(current.trim())
  return result
}

export function parseDictionaryCsv(text: string): CreateDictionaryData[] {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase())
  const idx = {
    dictType: header.indexOf('dicttype'),
    dictTypeLabel: header.indexOf('dicttypelabel'),
    codeValue: header.indexOf('codevalue'),
    displayName: header.indexOf('displayname'),
    label: header.indexOf('label'),
    comment: header.indexOf('comment'),
  }

  if (idx.dictType < 0 || idx.codeValue < 0) return []

  const map = new Map<string, CreateDictionaryData>()

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const dictType = cols[idx.dictType]?.trim()
    const codeValue = cols[idx.codeValue]?.trim()
    if (!dictType || !codeValue) continue

    const dictTypeLabel = idx.dictTypeLabel >= 0 ? cols[idx.dictTypeLabel]?.trim() : ''
    const displayName = idx.displayName >= 0 ? cols[idx.displayName]?.trim() : ''
    const label = idx.label >= 0 ? cols[idx.label]?.trim() : ''
    const comment = idx.comment >= 0 ? cols[idx.comment]?.trim() : ''

    if (!map.has(dictType)) {
      map.set(dictType, {
        name: dictTypeLabel || dictType,
        code: dictType,
        desc: comment,
        entries: [],
      })
    }

    const existing = map.get(dictType)!
    if (!existing.desc && comment) existing.desc = comment
    if (dictTypeLabel && existing.name === dictType) existing.name = dictTypeLabel

    const entries = existing.entries ?? []
    entries.push({
      code: codeValue,
      displayName: displayName || label || codeValue,
    })
    existing.entries = entries
  }

  return Array.from(map.values())
}

export function BulkImportDictionaryModal({ open, onClose, onImport }: BulkImportDictionaryModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setFiles([])
    setError('')
    setImporting(false)
    onClose()
  }

  const addFiles = (incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter(
      (f) => (f.name.endsWith('.csv') || f.type === 'text/csv') && f.size <= MAX_FILE_SIZE
    )
    if (valid.length === 0) {
      setError('请选择有效的 .csv 文件（单个文件 < 10MB）')
      return
    }
    setError('')
    setFiles((prev) => {
      const merged = [...prev]
      for (const f of valid) {
        if (merged.length >= MAX_FILES) break
        if (!merged.some((m) => m.name === f.name && m.size === f.size)) {
          merged.push(f)
        }
      }
      return merged.slice(0, MAX_FILES)
    })
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setError('')
  }

  const statusText = () => {
    if (importing) return '导入中...'
    if (error) return error
    if (files.length === 0) return '准备就绪'
    return `已选择 ${files.length} 个文件，共 ${(files.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB`
  }

  const handleImport = async () => {
    if (files.length === 0 || importing) return
    setImporting(true)
    setError('')

    try {
      const merged = new Map<string, CreateDictionaryData>()
      for (const file of files) {
        const text = await file.text()
        const parsed = parseDictionaryCsv(text)
        for (const dict of parsed) {
          const existing = merged.get(dict.code)
          if (!existing) {
            merged.set(dict.code, { ...dict, entries: [...(dict.entries ?? [])] })
          } else {
            const entries = [...(existing.entries ?? [])]
            for (const entry of dict.entries ?? []) {
              if (!entries.some((e) => e.code === entry.code)) {
                entries.push(entry)
              }
            }
            existing.entries = entries
            if (!existing.desc && dict.desc) existing.desc = dict.desc
            if (dict.name && existing.name === existing.code) existing.name = dict.name
          }
        }
      }

      const dictionaries = Array.from(merged.values())
      if (dictionaries.length === 0) {
        setError('未能解析出有效字典，请检查 CSV 格式是否与模板一致')
        return
      }
      onImport?.(dictionaries)
      handleClose()
    } catch {
      setError('文件解析失败，请检查 CSV 内容')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob(['\uFEFF' + CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' })
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
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <CloudUpload className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">批量导入字典</h2>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                下载模板按格式填写后上传 CSV，系统将自动创建字典类型及其码值。
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Template row */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="flex min-w-0 items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p className="text-xs leading-relaxed text-slate-600">
                <span className="font-medium text-slate-700">模板字段：</span>
                {TEMPLATE_FIELDS}
              </p>
            </div>
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
            >
              <Download className="h-3.5 w-3.5" /> 下载模板
            </button>
          </div>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors',
              dragOver ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50'
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <CloudUpload className="mb-3 h-10 w-10 text-emerald-500" />
            <p className="text-sm font-medium text-slate-800">点击或拖拽 CSV 文件到此处</p>
            <p className="mt-1.5 text-xs text-slate-400">仅支持 .csv，建议单个文件 &lt; 10MB，最多 3 个</p>
          </div>

          {/* Selected files */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="truncate text-sm text-slate-700">{f.name}</span>
                    <span className="shrink-0 text-xs text-slate-400">{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className={cn('text-sm', error ? 'text-red-500' : 'text-slate-500')}>{statusText()}</p>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              取消
            </button>
            {files.length > 0 && (
              <button
                onClick={handleImport}
                disabled={importing}
                className={cn(
                  'rounded-lg px-5 py-2 text-sm font-medium',
                  importing
                    ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                )}
              >
                {importing ? '导入中...' : '开始导入'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
