import { Navbar, NavbarBrand, NavbarContent, Input } from '@heroui/react'
import { AcmeLogo, SearchIcon } from '@/components/icons'
import { useState } from 'react'

export default function Navigation() {
  const [search, setSearch] = useState('')
  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">OUONNKI TV</p>
      </NavbarBrand>
      <NavbarContent as="div" className="items-center" justify="end">
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
          startContent={<SearchIcon size={18} />}
          type="search"
          radius="full"
          value={search}
          onValueChange={setSearch}
        />
      </NavbarContent>
    </Navbar>
  )
}
