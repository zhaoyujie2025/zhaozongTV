import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Player from 'xgplayer'
import HlsPlugin from 'xgplayer-hls'
import 'xgplayer/dist/index.min.css'
import { Card, CardHeader, CardBody, Button, Chip } from '@heroui/react'
import type { DetailResponse, VideoItem } from '@/types'

export default function Video() {
  const location = useLocation()
  const navigate = useNavigate()
  const playerRef = useRef<Player | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 从路由状态获取数据
  const detail = location.state?.detail as DetailResponse | undefined
  const videoItem = location.state?.videoItem as VideoItem | undefined
  const currentEpisodeIndex = location.state?.episodeIndex as number | undefined

  const [selectedEpisode, setSelectedEpisode] = useState(currentEpisodeIndex || 0)

  // 获取显示信息
  const getTitle = () => videoItem?.vod_name || detail?.videoInfo?.title || '未知视频'
  const sourceName = videoItem?.source_name || detail?.videoInfo?.source_name || '未知来源'

  useEffect(() => {
    if (!detail?.episodes || !detail.episodes[selectedEpisode]) return

    // 销毁旧的播放器实例
    if (playerRef.current) {
      playerRef.current.destroy()
    }

    // 创建新的播放器实例
    playerRef.current = new Player({
      id: 'player',
      url: detail.episodes[selectedEpisode],
      fluid: true,
      playbackRate: [0.5, 0.75, 1, 1.25, 1.5, 2],
      pip: true,
      download: true,
      lang: 'zh-cn',
      plugins: [HlsPlugin],
      // 隐藏下载按钮
      ignores: ['download'],
    })

    // 清理函数
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [selectedEpisode, detail])

  // 处理集数切换
  const handleEpisodeChange = (index: number) => {
    setSelectedEpisode(index)
  }

  // 如果没有数据，显示错误信息
  if (!detail || !detail.episodes || detail.episodes.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardBody className="text-center">
            <p className="mb-4 text-gray-500">无法获取播放信息</p>
            <Button className="w-full" onPress={() => navigate(-1)} variant="flat">
              返回
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl p-2 sm:p-4">
      {/* 视频信息 - 移动端在播放器上方，桌面端浮层 */}
      <div className="mb-4 flex flex-col gap-2 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600">{sourceName}</p>
            <h4 className="text-lg font-bold">{getTitle()}</h4>
          </div>
          <Button size="sm" variant="flat" onPress={() => navigate(-1)}>
            返回
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Chip size="sm" color="primary" variant="flat">
            第 {selectedEpisode + 1} 集
          </Chip>
          <p className="text-sm text-gray-600">共 {detail.episodes.length} 集</p>
        </div>
      </div>

      {/* 播放器卡片 */}
      <Card className="mb-4 border-none sm:mb-6" radius="lg">
        <CardHeader className="absolute top-1 z-10 hidden w-full p-3 md:block">
          <div className="flex w-full items-start justify-between">
            <div className="rounded-large bg-black/20 px-3 py-2 backdrop-blur">
              <p className="text-tiny font-bold text-white/80 uppercase">{sourceName}</p>
              <h4 className="text-lg font-medium text-white">{getTitle()}</h4>
            </div>
            <div className="rounded-large flex items-center gap-2 bg-black/20 px-3 py-2 backdrop-blur">
              <Chip size="sm" variant="flat" className="bg-white/20 backdrop-blur">
                第 {selectedEpisode + 1} 集
              </Chip>
              <p className="text-tiny text-white/80">共 {detail.episodes.length} 集</p>
              <Button
                size="sm"
                className="text-tiny ml-2 bg-black/20 text-white"
                radius="lg"
                variant="flat"
                onPress={() => navigate(-1)}
              >
                返回
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div id="player" ref={containerRef} className="aspect-video w-full rounded-lg bg-black" />
        </CardBody>
      </Card>

      {/* 选集列表 */}
      <Card isBlurred className="bg-background/60 dark:bg-default-100/50 border-none" radius="lg">
        <CardHeader>
          <h3 className="text-lg font-bold md:text-xl">选集</h3>
        </CardHeader>
        <CardBody>
          <div className="xs:grid-cols-4 grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {detail.episodes.map((_, index) => (
              <Button
                key={index}
                size="sm"
                className={
                  selectedEpisode === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-default-100 hover:bg-default-200'
                }
                variant={selectedEpisode === index ? 'solid' : 'flat'}
                onPress={() => handleEpisodeChange(index)}
              >
                <span className="text-xs sm:text-sm">{index + 1}</span>
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
