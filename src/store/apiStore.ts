import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { CustomApi } from '@/types'
import { API_SITES } from '@/config/api.config'

interface ApiState {
  // 选中的 API 源 ID 列表
  selectedAPIs: string[]
  // 自定义 API 列表
  customAPIs: CustomApi[]
  // 黄色内容过滤开关
  yellowFilterEnabled: boolean
  // 广告过滤开关
  adFilteringEnabled: boolean
}

interface ApiActions {
  // 切换 API 选中状态
  toggleAPI: (apiId: string) => void
  // 设置选中的 API 列表
  setSelectedAPIs: (apis: string[]) => void
  // 添加自定义 API
  addCustomAPI: (api: CustomApi) => void
  // 更新自定义 API
  updateCustomAPI: (index: number, api: CustomApi) => void
  // 删除自定义 API
  removeCustomAPI: (index: number) => void
  // 设置黄色内容过滤
  setYellowFilterEnabled: (enabled: boolean) => void
  // 设置广告过滤
  setAdFilteringEnabled: (enabled: boolean) => void
  // 全选 API
  selectAllAPIs: (excludeAdult?: boolean) => void
  // 取消全选
  deselectAllAPIs: () => void
  // 检查是否有成人 API 被选中
  hasAdultAPISelected: () => boolean
}

type ApiStore = ApiState & ApiActions

export const useApiStore = create<ApiStore>()(
  devtools(
    persist(
      immer<ApiStore>((set, get) => ({
        // 初始状态
        selectedAPIs: ['heimuer'], // 默认选中黑木耳
        customAPIs: [],
        yellowFilterEnabled: true,
        adFilteringEnabled: true,

        // Actions
        toggleAPI: (apiId: string) => {
          set(state => {
            const index = state.selectedAPIs.indexOf(apiId)
            if (index > -1) {
              state.selectedAPIs.splice(index, 1)
            } else {
              state.selectedAPIs.push(apiId)
            }
          })
        },

        setSelectedAPIs: (apis: string[]) => {
          set(state => {
            state.selectedAPIs = apis
          })
        },

        addCustomAPI: (api: CustomApi) => {
          set(state => {
            state.customAPIs.push(api)
            // 默认选中新添加的 API
            const newApiId = `custom_${state.customAPIs.length - 1}`
            state.selectedAPIs.push(newApiId)
          })
        },

        updateCustomAPI: (index: number, api: CustomApi) => {
          set(state => {
            if (index >= 0 && index < state.customAPIs.length) {
              state.customAPIs[index] = api
            }
          })
        },

        removeCustomAPI: (index: number) => {
          set(state => {
            if (index >= 0 && index < state.customAPIs.length) {
              // 移除自定义 API
              state.customAPIs.splice(index, 1)

              // 从选中列表中移除
              const customApiId = `custom_${index}`
              state.selectedAPIs = state.selectedAPIs.filter(id => id !== customApiId)

              // 更新大于此索引的自定义 API ID
              state.selectedAPIs = state.selectedAPIs.map(id => {
                if (id.startsWith('custom_')) {
                  const currentIndex = parseInt(id.replace('custom_', ''))
                  if (currentIndex > index) {
                    return `custom_${currentIndex - 1}`
                  }
                }
                return id
              })
            }
          })
        },

        setYellowFilterEnabled: (enabled: boolean) => {
          set(state => {
            state.yellowFilterEnabled = enabled
          })
        },

        setAdFilteringEnabled: (enabled: boolean) => {
          set(state => {
            state.adFilteringEnabled = enabled
          })
        },

        selectAllAPIs: (excludeAdult: boolean = false) => {
          set(state => {
            const builtInAPIs = Object.keys(API_SITES).filter(key => {
              if (excludeAdult && API_SITES[key].adult) {
                return false
              }
              return true
            })

            const customAPIIds = state.customAPIs
              .map((_, index) => `custom_${index}`)
              .filter((_, index) => {
                if (excludeAdult && state.customAPIs[index].isAdult) {
                  return false
                }
                return true
              })

            state.selectedAPIs = [...builtInAPIs, ...customAPIIds]
          })
        },

        deselectAllAPIs: () => {
          set(state => {
            state.selectedAPIs = []
          })
        },

        hasAdultAPISelected: (): boolean => {
          const state = get()

          // 检查内置成人 API
          const hasBuiltInAdult = state.selectedAPIs.some((apiId: string) => {
            return !apiId.startsWith('custom_') && API_SITES[apiId]?.adult
          })

          if (hasBuiltInAdult) return true

          // 检查自定义成人 API
          const hasCustomAdult = state.selectedAPIs.some((apiId: string) => {
            if (apiId.startsWith('custom_')) {
              const index = parseInt(apiId.replace('custom_', ''))
              return state.customAPIs[index]?.isAdult
            }
            return false
          })

          return hasCustomAdult
        },
      })),
      {
        name: 'ouonnki-tv-api-store', // 持久化存储的键名
      },
    ),
    {
      name: 'ApiStore', // DevTools 中显示的名称
    },
  ),
)
