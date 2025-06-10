import { Navbar, NavbarBrand, NavbarContent, Input } from '@heroui/react'
import { AcmeLogo, SearchIcon } from '@/components/icons'
import { NavLink } from 'react-router'
import { useSearch } from '@/hooks'
import { motion } from 'framer-motion'

export default function Navigation() {
  const { search, setSearch, searchMovie, clearSearch } = useSearch()
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      searchMovie(search)
    }
  }
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'tween',
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      <Navbar>
        <NavbarBrand>
          <NavLink to="/" className="flex items-center gap-2">
            <motion.div layoutId="app-logo" className="flex items-center gap-2">
              <motion.div layoutId="logo-icon">
                <AcmeLogo />
              </motion.div>
              <motion.p layoutId="logo-text" className="font-bold text-inherit">
                OUONNKI TV
              </motion.p>
            </motion.div>
          </NavLink>
        </NavbarBrand>
        <NavbarContent as="div" className="items-center" justify="end">
          <motion.div layoutId="search-container" className="flex w-full justify-end">
            <Input
              classNames={{
                base: 'max-w-full sm:max-w-[15rem] h-10 hover:max-w-[24rem] transition-all duration-600',
                mainWrapper: 'h-full',
                input: 'text-small',
                inputWrapper:
                  'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
              }}
              placeholder="输入内容搜索..."
              size="sm"
              variant="flat"
              startContent={
                <motion.div layoutId="search-icon">
                  <SearchIcon size={18} />
                </motion.div>
              }
              type="search"
              radius="full"
              value={search}
              onValueChange={setSearch}
              onKeyDown={handleKeyDown}
              onClear={clearSearch}
            />
          </motion.div>
        </NavbarContent>
      </Navbar>
    </motion.div>
  )
}
