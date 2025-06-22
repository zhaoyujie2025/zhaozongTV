// 视频搜索结果项
export interface VideoItem {
  vod_id: string
  vod_name: string
  vod_pic?: string
  vod_remarks?: string
  type_name?: string
  vod_year?: string
  vod_area?: string
  vod_director?: string
  vod_actor?: string
  vod_content?: string
  vod_play_url?: string
  // 添加的源信息
  source_name?: string
  source_code?: string
  api_url?: string
}

// 视频详情
export interface VideoDetail {
  title: string
  cover?: string
  desc?: string
  type?: string
  year?: string
  area?: string
  director?: string
  actor?: string
  remarks?: string
  source_name?: string
  source_code?: string
}

// 搜索响应
export interface SearchResponse {
  code: number
  list: VideoItem[]
  msg?: string
}

// 详情响应
export interface DetailResponse {
  code: number
  episodes: string[]
  detailUrl?: string
  videoInfo?: VideoDetail
  msg?: string
}

// 观看历史项
export interface ViewingHistoryItem {
  title: string
  url: string
  episodeIndex?: number
  sourceName?: string
  timestamp: number
  playbackPosition?: number
  duration?: number
}

// 自定义 API
export interface CustomApi {
  name: string
  url: string
  isAdult?: boolean
}
