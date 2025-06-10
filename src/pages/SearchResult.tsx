import { useParams } from 'react-router'
import { useSearch } from '@/hooks'
import { useEffect } from 'react'

export default function SearchResult() {
  const { query } = useParams()
  const { search, setSearch } = useSearch()
  useEffect(() => {
    if (query && query !== search) {
      setSearch(query)
    }
  }, [query, setSearch, search])
  return <div>SearchResult: {search}</div>
}
