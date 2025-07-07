import { API_SITES, API_CONFIG, PROXY_URL, M3U8_PATTERN } from '@/config/api.config'
import type { SearchResponse, DetailResponse, VideoItem, CustomApi } from '@/types'

class ApiService {
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 10000,
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  // 搜索视频
  async searchVideos(query: string, source: string, customApi?: string): Promise<SearchResponse> {
    try {
      if (!query) {
        throw new Error('缺少搜索参数')
      }

      // 验证 API 源
      if (source === 'custom' && !customApi) {
        throw new Error('使用自定义API时必须提供API地址')
      }

      if (!API_SITES[source] && source !== 'custom') {
        throw new Error('无效的API来源')
      }

      const apiUrl = customApi
        ? `${customApi}${API_CONFIG.search.path}${encodeURIComponent(query)}`
        : `${API_SITES[source].api}${API_CONFIG.search.path}${encodeURIComponent(query)}`

      const response = await this.fetchWithTimeout(PROXY_URL + encodeURIComponent(apiUrl), {
        headers: API_CONFIG.search.headers,
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()

      if (!data || !Array.isArray(data.list)) {
        throw new Error('API返回的数据格式无效')
      }

      // 添加源信息到每个结果
      data.list.forEach((item: VideoItem) => {
        item.source_name = source === 'custom' ? '自定义源' : API_SITES[source].name
        item.source_code = source
        if (source === 'custom') {
          item.api_url = customApi
        }
      })

      return {
        code: 200,
        list: data.list || [],
      }
    } catch (error) {
      console.error('搜索错误:', error)
      return {
        code: 400,
        msg: error instanceof Error ? error.message : '请求处理失败',
        list: [],
      }
    }
  }

  // 获取视频详情
  async getVideoDetail(
    id: string,
    sourceCode: string,
    customApi?: string,
  ): Promise<DetailResponse> {
    try {
      if (!id) {
        throw new Error('缺少视频ID参数')
      }

      // 验证ID格式
      if (!/^[\w-]+$/.test(id)) {
        throw new Error('无效的视频ID格式')
      }

      // 验证API源
      if (sourceCode === 'custom' && !customApi) {
        throw new Error('使用自定义API时必须提供API地址')
      }

      if (!API_SITES[sourceCode] && sourceCode !== 'custom') {
        throw new Error('无效的API来源')
      }

      // 特殊源处理
      if (sourceCode === 'huangcang' && API_SITES[sourceCode].detail) {
        return await this.handleSpecialSourceDetail(id, sourceCode)
      }

      const detailUrl = customApi
        ? `${customApi}${API_CONFIG.detail.path}${id}`
        : `${API_SITES[sourceCode].api}${API_CONFIG.detail.path}${id}`

      const response = await this.fetchWithTimeout(PROXY_URL + encodeURIComponent(detailUrl), {
        headers: API_CONFIG.detail.headers,
      })

      if (!response.ok) {
        throw new Error(`详情请求失败: ${response.status}`)
      }

      const data = await response.json()

      if (!data || !data.list || !Array.isArray(data.list) || data.list.length === 0) {
        throw new Error('获取到的详情内容无效')
      }

      const videoDetail = data.list[0]
      let episodes: string[] = []

      // 提取播放地址
      if (videoDetail.vod_play_url) {
        const playSources = videoDetail.vod_play_url.split('$$$')
        if (playSources.length > 0) {
          const mainSource = playSources[playSources.length - 1]
          const episodeList = mainSource.split('#')

          episodes = episodeList
            .map((ep: string) => {
              const parts = ep.split('$')
              return parts.length > 1 ? parts[1] : ''
            })
            .filter(
              (url: string) => url && (url.startsWith('http://') || url.startsWith('https://')),
            )
        }
      }

      // 如果没有找到播放地址，尝试使用正则表达式
      if (episodes.length === 0 && videoDetail.vod_content) {
        const matches = videoDetail.vod_content.match(M3U8_PATTERN) || []
        episodes = matches.map((link: string) => link.replace(/^\$/, ''))
      }

      return {
        code: 200,
        episodes,
        detailUrl,
        videoInfo: {
          title: videoDetail.vod_name,
          cover: videoDetail.vod_pic,
          desc: videoDetail.vod_content,
          type: videoDetail.type_name,
          year: videoDetail.vod_year,
          area: videoDetail.vod_area,
          director: videoDetail.vod_director,
          actor: videoDetail.vod_actor,
          remarks: videoDetail.vod_remarks,
          source_name: sourceCode === 'custom' ? '自定义源' : API_SITES[sourceCode].name,
          source_code: sourceCode,
        },
      }
    } catch (error) {
      console.error('详情获取错误:', error)
      return {
        code: 400,
        msg: error instanceof Error ? error.message : '请求处理失败',
        episodes: [],
      }
    }
  }

  // 处理特殊源详情
  private async handleSpecialSourceDetail(id: string, sourceCode: string): Promise<DetailResponse> {
    try {
      const detailUrl = `${API_SITES[sourceCode].detail}/index.php/vod/detail/id/${id}.html`

      const response = await this.fetchWithTimeout(PROXY_URL + encodeURIComponent(detailUrl), {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      })

      if (!response.ok) {
        throw new Error(`详情页请求失败: ${response.status}`)
      }

      const html = await response.text()
      let matches: string[] = []

      if (sourceCode === 'ffzy') {
        const ffzyPattern = /\$(https?:\/\/[^"'\s]+?\/\d{8}\/\d+_[a-f0-9]+\/index\.m3u8)/g
        matches = html.match(ffzyPattern) || []
      }

      if (matches.length === 0) {
        const generalPattern = /\$(https?:\/\/[^"'\s]+?\.m3u8)/g
        matches = html.match(generalPattern) || []
      }

      // 去重
      matches = [...new Set(matches)]

      // 处理链接
      matches = matches.map(link => {
        link = link.substring(1)
        const parenIndex = link.indexOf('(')
        return parenIndex > 0 ? link.substring(0, parenIndex) : link
      })

      // 提取标题和简介
      const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/)
      const titleText = titleMatch ? titleMatch[1].trim() : ''

      const descMatch = html.match(/<div[^>]*class=["']sketch["'][^>]*>([\s\S]*?)<\/div>/)
      const descText = descMatch ? descMatch[1].replace(/<[^>]+>/g, ' ').trim() : ''

      return {
        code: 200,
        episodes: matches,
        detailUrl,
        videoInfo: {
          title: titleText,
          desc: descText,
          source_name: API_SITES[sourceCode].name,
          source_code: sourceCode,
        },
      }
    } catch (error) {
      console.error(`${API_SITES[sourceCode].name}详情获取失败:`, error)
      throw error
    }
  }

  // 聚合搜索
  aggregatedSearch(
    query: string,
    selectedAPIs: string[],
    customAPIs: CustomApi[],
    onNewResults: (results: VideoItem[]) => void,
  ): Promise<void[]> {
    // 检查是否有选中的 API
    if (selectedAPIs.length === 0) {
      console.warn('没有选中任何 API 源')
      return Promise.resolve([])
    }

    const seen = new Set<string>()

    // 直接对所有选中的 API 进行搜索
    const searchPromises = selectedAPIs.map(apiId => {
      let promise: Promise<VideoItem[]> | undefined

      if (apiId.startsWith('custom_')) {
        // 处理自定义 API
        const customIndex = parseInt(apiId.replace('custom_', ''))
        const customApi = customAPIs[customIndex]
        if (customApi) {
          promise = this.searchSingleSource(query, 'custom', customApi.url, customApi.name)
        }
      } else if (API_SITES[apiId]) {
        // 内置 API
        promise = this.searchSingleSource(query, apiId)
      }

      if (promise) {
        return promise
          .then(results => {
            if (Array.isArray(results) && results.length > 0) {
              const newUniqueResults: VideoItem[] = []
              results.forEach(item => {
                const key = `${item.source_code}_${item.vod_id}`
                if (!seen.has(key)) {
                  seen.add(key)
                  newUniqueResults.push(item)
                }
              })
              if (newUniqueResults.length > 0) {
                onNewResults(newUniqueResults)
              }
            }
          })
          .catch(error => {
            console.warn(`${apiId} 源搜索失败:`, error)
          })
      }
    })
    return Promise.all(searchPromises.filter(Boolean) as Promise<void>[])
  }

  // 搜索单个源
  private async searchSingleSource(
    query: string,
    source: string,
    customApi?: string,
    customName?: string,
  ): Promise<VideoItem[]> {
    try {
      const result = await this.searchVideos(query, source, customApi)
      if (result.code === 200 && result.list) {
        // 如果是自定义源，更新源名称
        if (source === 'custom' && customName) {
          result.list.forEach(item => {
            item.source_name = customName
          })
        }
        return result.list
      }
      return []
    } catch (error) {
      console.warn(`${source}源搜索失败:`, error)
      return []
    }
  }
}

export const apiService = new ApiService()
