import { useParams } from 'react-router'
import { useSearch } from '@/hooks'
import { useEffect } from 'react'

export default function SearchResult() {
  const { query } = useParams()
  const { search, setSearch, searchMovie } = useSearch()
  useEffect(() => {
    if (query && query !== search) {
      setSearch(query)
      searchMovie(query)
    }
  }, [query])
  return <div>SearchResult: {query}</div>
}
