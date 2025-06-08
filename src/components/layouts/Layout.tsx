import { Outlet } from 'react-router'
import Navigation from '@/components/Navigation'

export default function Layout() {
  return (
    <>
      <Navigation />
      <div className="h-full w-full">
        <Outlet />
      </div>
    </>
  )
}
