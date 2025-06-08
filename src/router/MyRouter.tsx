import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from '@/components/layouts/Layout'
import Search from '@/pages/Search'
import Videos from '@/pages/Videos'

export default function MyRouter({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={children} />
          <Route path="search" element={<Search />} />
          <Route path="videos" element={<Videos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
