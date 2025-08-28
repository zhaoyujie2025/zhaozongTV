// API 源配置
export interface ApiSite {
  api: string
  name: string
  detail?: string
  adult?: boolean
}

// 内置源已移除，只保留自定义源功能
export const API_SITES: Record<string, ApiSite> = {}

// API 配置
export const API_CONFIG = {
  search: {
    path: '/api.php/provide/vod/?ac=videolist&wd=',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'application/json',
    },
  },
  detail: {
    path: '/api.php/provide/vod/?ac=videolist&ids=',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'application/json',
    },
  },
}

// 其他配置
// 优先使用环境变量中的代理URL，如果没有则使用默认值
export const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'https://cors.zme.ink/'
export const SEARCH_HISTORY_KEY = 'videoSearchHistory'
export const MAX_HISTORY_ITEMS = 5
export const M3U8_PATTERN = /\$https?:\/\/[^"'\s]+?\.m3u8/g

export const PLAYER_CONFIG = {
  autoplay: true,
  allowFullscreen: true,
  width: '100%',
  height: '600',
  timeout: 15000,
  filterAds: true,
  autoPlayNext: true,
  adFilteringEnabled: true,
  adFilteringStorage: 'adFilteringEnabled',
}

export const AGGREGATED_SEARCH_CONFIG = {
  enabled: true,
  timeout: 8000,
  maxResults: 10000,
  parallelRequests: true,
  showSourceBadges: true,
}

export const CUSTOM_API_CONFIG = {
  separator: ',',
  maxSources: 5,
  testTimeout: 5000,
  namePrefix: 'Custom-',
  validateUrl: true,
  cacheResults: true,
  cacheExpiry: 5184000000,
  adultPropName: 'isAdult',
}

export const HIDE_BUILTIN_ADULT_APIS = false

// 内置源移除标志
export const BUILTIN_SOURCES_REMOVED = true
