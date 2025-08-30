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
export const PROXY_URL =
  import.meta.env.VITE_PROXY_URL || 'https://api.codetabs.com/v1/proxy?quest='
export const M3U8_PATTERN = /\$https?:\/\/[^"'\s]+?\.m3u8/g
