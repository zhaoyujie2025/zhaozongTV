import { NavLink, Outlet } from 'react-router'

export default function Layout() {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-center gap-4 bg-blue-200">
        <NavLink to="/" className="text-white hover:text-blue-500">
          Home
        </NavLink>
        <NavLink to="/search" className="text-white hover:text-blue-500">
          Search
        </NavLink>
        <NavLink to="/videos" className="text-white hover:text-blue-500">
          Videos
        </NavLink>
      </div>
      <div className="h-dvh w-full bg-red-200 pt-16">
        <Outlet />
      </div>
    </>
  )
}
