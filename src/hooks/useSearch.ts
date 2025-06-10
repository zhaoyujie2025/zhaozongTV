import { useNavigate } from 'react-router'
import { useSearchStore } from '@/store/searchStore'

export const useSearch = () => {
  const navigate = useNavigate()

  // 从 zustand store 获取状态和操作
  const {
    query: search,
    isSearching,
    setQuery: setSearch,
    addSearchHistoryItem,
    clearQuery,
    setIsSearching,
  } = useSearchStore()

  const searchMovie = (query: string) => {
    if (query.trim().length > 0) {
      // 设置当前搜索查询
      setSearch(query)
      // 添加到搜索历史
      addSearchHistoryItem(query)
      // 导航到搜索页面
      navigate(`/search/${query}`)
    }
  }

  const clearSearch = () => {
    clearQuery()
  }

  return {
    search,
    setSearch,
    searchMovie,
    clearSearch,
    isSearching,
    setIsSearching,
  }
}
