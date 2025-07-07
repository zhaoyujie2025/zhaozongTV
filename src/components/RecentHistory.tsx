import { RecentIcon } from '@/components/icons'
import { Card, Chip, Image, Tooltip, Progress } from '@heroui/react'
import { ScrollShadow } from '@heroui/react'
import { useViewingHistoryStore } from '@/store/viewingHistoryStore'
import { API_SITES } from '@/config/api.config'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { NavLink } from 'react-router'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { isBrowser } from 'react-device-detect'
import clsx from 'clsx'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
dayjs.extend(duration)

const HistoryList = () => {
  const { viewingHistory } = useViewingHistoryStore()
  const filteredHistory = useMemo(() => {
    const historyMap = new Map()
    viewingHistory.forEach(item => {
      const key = `${item.sourceCode}-${item.vodId}`
      if (!historyMap.has(key)) {
        historyMap.set(key, item)
      }
    })
    return Array.from(historyMap.values())
  }, [viewingHistory])
  return (
    <>
      <ScrollShadow hideScrollBar className="h-full overflow-y-auto bg-transparent p-2">
        {filteredHistory.map((item, index) => (
          <Card
            className="@container mb-[.6rem] h-[30vw] w-full bg-white/30 shadow-md/5 transition-all duration-500 hover:scale-101 hover:shadow-lg md:h-[8rem] md:w-[25rem]"
            key={index}
            isPressable
            shadow="sm"
            onPress={() => console.log('item pressed')}
          >
            <NavLink
              className="w-full"
              to={`/video/${item.sourceCode}/${item.vodId}/${item.episodeIndex}`}
            >
              <div className="flex h-[30vw] w-full md:h-[8rem]">
                <div className="relative shrink-0">
                  <Image
                    alt={item.title}
                    radius="lg"
                    shadow="sm"
                    loading="lazy"
                    isZoomed
                    isBlurred
                    classNames={{
                      zoomedWrapper: 'h-full aspect-square',
                      wrapper: 'h-full aspect-square',
                      img: 'h-full w-full object-cover',
                    }}
                    src={item.imageUrl}
                  />
                  <Progress
                    aria-label="Progress"
                    value={(item.playbackPosition / item.duration) * 100}
                    color="primary"
                    className="absolute bottom-0 z-10 w-full"
                    classNames={{
                      base: 'h-[1.5cqw]',
                    }}
                  />
                </div>
                <div className="group flex h-full w-full flex-col items-start justify-between p-[4cqw] md:gap-3 md:p-4">
                  <div className="flex w-full items-center justify-between gap-[2cqw] md:gap-2">
                    <Chip
                      color="primary"
                      variant="solid"
                      classNames={{
                        base: 'h-[6cqw] px-[3%] md:h-6 md:px-2',
                        content: 'text-[3cqw] md:text-xs',
                      }}
                    >
                      {API_SITES[item.sourceCode]?.name}
                    </Chip>
                    <div className="text-[3.5cqw] text-gray-500 md:text-sm">
                      {dayjs(item.timestamp).fromNow()}
                    </div>
                  </div>
                  <div className="line-clamp-1 text-[4.5cqw] font-bold text-gray-700 transition-colors duration-200 group-hover:text-indigo-400 group-hover:underline md:text-lg">
                    {item.title}
                  </div>
                  <div className="flex w-full items-center justify-between gap-[2cqw] text-[3cqw] md:gap-2 md:text-xs">
                    <div className="text-gray-500">第{item.episodeIndex + 1}集</div>
                    <div className="text-gray-500">
                      已看 {((item.playbackPosition / item.duration) * 100).toFixed(0)}%{' '}
                    </div>
                  </div>
                  {/* <Progress
                    aria-label="Progress"
                    label={`${dayjs.duration(item.playbackPosition, 'seconds').format('HH:mm:ss')} / ${dayjs.duration(item.duration, 'seconds').format('HH:mm:ss')}`}
                    value={(item.playbackPosition / item.duration) * 100}
                    color="primary"
                    size="sm"
                  /> */}
                </div>
              </div>
            </NavLink>
          </Card>
        ))}
      </ScrollShadow>
    </>
  )
}

export default function RecentHistory() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Tooltip
        isOpen={isBrowser ? undefined : false}
        classNames={{
          base: 'bg-transparent h-[60vh]',
          content: 'h-full p-2 bg-white/50 shadow-xl/30 shadow-gray-500/30 backdrop-blur-lg',
        }}
        content={
          <>
            <div className="mt-2 mb-2 text-center text-lg font-bold text-gray-800">观看记录</div>
            <HistoryList />
          </>
        }
        shadow="lg"
        placement="bottom"
        offset={10}
      >
        <div
          onClick={isBrowser ? undefined : () => setIsOpen(!isOpen)}
          className="flex h-full w-full items-center justify-center"
        >
          <RecentIcon size={24} />
        </div>
      </Tooltip>
      {!isBrowser &&
        isOpen &&
        createPortal(
          <div
            className={clsx(
              'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/50 opacity-0 shadow-xl/30 shadow-gray-500/30 backdrop-blur-xl transition-opacity duration-2000',
              isOpen && 'opacity-100',
            )}
            onClick={() => setIsOpen(false)}
          >
            <div className="flex h-[90vh] w-[90vw] flex-col items-center justify-center">
              <div className="mt-[5vh] mb-2 h-fit text-center text-2xl font-bold text-gray-800">
                观看记录
              </div>
              <div className="w-full flex-1 overflow-hidden" onClick={e => e.stopPropagation()}>
                <HistoryList />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
