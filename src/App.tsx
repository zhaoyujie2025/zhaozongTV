import { OkiLogo, SearchIcon } from '@/components/icons'
import { Button, Input, Chip } from '@heroui/react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchHistory, useSearch } from '@/hooks'
import { useVersionStore } from '@/store/versionStore'
import UpdateModal from '@/components/UpdateModal'

function App() {
  const { searchHistory, removeSearchHistoryItem } = useSearchHistory()
  const { search, setSearch, searchMovie } = useSearch()
  const { hasNewVersion, setShowUpdateModal } = useVersionStore()
  const [buttonTransitionStatus, setButtonTransitionStatus] = useState({
    opacity: 0,
    filter: 'blur(5px)',
  })
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [hoveredChipId, setHoveredChipId] = useState<string | null>(null)

  useEffect(() => {
    if (search.length > 0) {
      setButtonTransitionStatus({
        opacity: 1,
        filter: 'blur(0px)',
      })
      setButtonIsDisabled(false)
    } else {
      setButtonIsDisabled(true)
      setButtonTransitionStatus({
        opacity: 0,
        filter: 'blur(5px)',
      })
    }
  }, [search])

  // 检查版本更新
  useEffect(() => {
    if (hasNewVersion()) {
      setShowUpdateModal(true)
    }
  }, [])

  const handleSearch = () => {
    searchMovie(search)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <UpdateModal />
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-start md:min-h-0 md:justify-center">
        <motion.div
          layoutId="app-logo"
          animate={{
            filter: isInputFocused ? 'blur(6px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.4 }}
          className="mt-[7rem] flex translate-x-[-1rem] items-end gap-2 text-[1.5rem] md:mt-[10rem] md:text-[2rem]"
        >
          <motion.div layoutId="logo-icon">
            <div className="block md:hidden">
              <OkiLogo size={48} />
            </div>
            <div className="hidden md:block">
              <OkiLogo size={64} />
            </div>
          </motion.div>
          <motion.p layoutId="logo-text" className="font-bold text-inherit">
            OUONNKI TV
          </motion.p>
        </motion.div>
        <motion.div
          layoutId="search-container"
          initial={{ width: 'min(30rem, 90vw)' }}
          whileHover={{
            scale: isInputFocused ? 1.2 : 1.02,
            width: 'min(50rem, 90vw)',
          }}
          animate={{
            scale: isInputFocused ? 1.2 : 1,
            width: isInputFocused ? 'min(50rem, 90vw)' : 'min(30rem, 90vw)',
            translateY: isInputFocused ? '-0.5rem' : '0rem',
          }}
          className="mt-[1rem] h-fit px-4 md:px-0"
        >
          <Input
            classNames={{
              base: 'max-w-full h-13',
              mainWrapper: 'h-full',
              input: 'text-md',
              inputWrapper: 'h-full font-normal text-default-500 pr-2 shadow-lg',
            }}
            placeholder="输入内容搜索..."
            size="lg"
            variant="bordered"
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
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            endContent={
              <motion.div
                initial={{ opacity: 0, filter: 'blur(5px)' }}
                animate={{
                  opacity: buttonTransitionStatus.opacity,
                  filter: buttonTransitionStatus.filter,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  className="bg-gradient-to-br from-gray-500 to-gray-950 font-bold text-white shadow-lg"
                  size="md"
                  radius="full"
                  onPress={handleSearch}
                  isDisabled={buttonIsDisabled}
                >
                  搜索
                </Button>
              </motion.div>
            }
          />
        </motion.div>
        <motion.div
          initial={{ filter: 'opacity(20%)' }}
          animate={{
            filter: isInputFocused ? 'blur(6px) opacity(20%)' : 'blur(0px) opacity(20%)',
          }}
          whileHover={{
            filter: isInputFocused ? 'blur(6px) opacity(100%)' : 'blur(0px) opacity(100%)',
          }}
          transition={{ duration: 0.4 }}
          className="mt-[3rem] flex w-full flex-col items-start gap-2 px-4 md:w-[42rem] md:flex-row md:px-0"
        >
          <p className="text-lg font-bold">搜索历史：</p>
          <div className="flex w-full flex-wrap gap-3 md:w-[34rem]">
            <AnimatePresence mode="popLayout">
              {searchHistory.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  exit={{ opacity: 0, filter: 'blur(5px)' }}
                  onMouseEnter={() => setHoveredChipId(item.id)}
                  onMouseLeave={() => setHoveredChipId(null)}
                >
                  <Chip
                    classNames={{
                      base: 'cursor-pointer border-2 border-gray-400 hover:border-black hover:scale-101 transition-all duration-300',
                      content: `transition-all duration-200 ${hoveredChipId === item.id ? 'translate-x-0' : 'translate-x-2'}`,
                      closeButton: `transition-opacity duration-200 ${hoveredChipId === item.id ? 'opacity-100' : 'opacity-0'}`,
                    }}
                    variant="bordered"
                    size="lg"
                    onClick={() => searchMovie(item.content)}
                    onClose={() => {
                      if (hoveredChipId === item.id) {
                        removeSearchHistoryItem(item.id)
                      }
                    }}
                  >
                    {item.content}
                  </Chip>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default App
