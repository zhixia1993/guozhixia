export interface DictionaryEntry {
  code: string
  displayName: string
}

export interface DictionaryInfo {
  id: string
  name: string
  code: string
  desc: string
  entryCount: number
  entries: DictionaryEntry[]
}

export interface CreateDictionaryData {
  name: string
  code: string
  desc: string
  entries: DictionaryEntry[]
}
