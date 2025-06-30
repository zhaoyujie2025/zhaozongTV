import { BrowserRouter, Routes, Route, useLocation } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import Layout from '@/components/layouts/Layout'
import SearchResult from '@/pages/SearchResult'
import Detail from '@/pages/Detail'
import Video from '@/pages/Video'

function AnimatedRoutes({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={children} />
        <Route element={<Layout />}>
          <Route path="search/:query" element={<SearchResult />} />
          <Route path="video" element={<Video />} />
          <Route path="detail/:sourceCode/:vodId" element={<Detail />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function MyRouter({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AnimatedRoutes>{children}</AnimatedRoutes>
    </BrowserRouter>
  )
}
