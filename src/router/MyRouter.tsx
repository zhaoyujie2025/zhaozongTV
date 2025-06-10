import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from '@/components/layouts/Layout'
import SearchResult from '@/pages/SearchResult'
import Videos from '@/pages/Videos'

export default function MyRouter({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={children} />
        <Route element={<Layout />}>
          <Route path="search/:query" element={<SearchResult />} />
          <Route path="videos" element={<Videos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
