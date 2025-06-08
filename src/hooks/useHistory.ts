import { useState, useEffect, useMemo } from 'react'
import type { SearchHistory } from '@/types'
import { saveToStorage, loadFromStorage, STORAGE_KEY_SEARCH_HISTORY } from '@/utils/storage'

export const useSearchHistory = () => {
  const [originalSearchHistory, setOriginalSearchHistory] = useState<SearchHistory>([])
  useEffect(() => {
    _loadSearchHistory()
  }, [])

  const searchHistory = useMemo(() => {
    return originalSearchHistory.sort((a, b) => b.updatedAt - a.updatedAt)
  }, [originalSearchHistory])

  const _saveSearchHistory = (items: SearchHistory) => {
    saveToStorage(STORAGE_KEY_SEARCH_HISTORY, items)
  }

  const _loadSearchHistory = () => {
    const items = loadFromStorage(STORAGE_KEY_SEARCH_HISTORY)
    setOriginalSearchHistory(items ? (items as SearchHistory) : [])
  }

  const addSearchHistoryItem = (content: string) => {
    const newSearchHistory = [...originalSearchHistory]
    let item = newSearchHistory.find(item => item.content === content)
    if (item) {
      item.updatedAt = Date.now()
    } else {
      item = {
        id: crypto.randomUUID(),
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      newSearchHistory.unshift(item)
    }
    setOriginalSearchHistory(newSearchHistory)
    _saveSearchHistory(newSearchHistory)
  }

  const removeSearchHistoryItem = (id: string) => {
    const newSearchHistory = originalSearchHistory.filter(item => item.id !== id)
    setOriginalSearchHistory(newSearchHistory)
    _saveSearchHistory(newSearchHistory)
  }

  return { searchHistory, addSearchHistoryItem, removeSearchHistoryItem }
}
