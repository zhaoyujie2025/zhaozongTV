import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ViewingHistoryItem } from '@/types'

interface ViewingHistoryState {
  // 观看历史列表
  viewingHistory: ViewingHistoryItem[]
}

interface ViewingHistoryActions {
  // 添加观看历史
  addViewingHistory: (item: ViewingHistoryItem) => void
  // 删除观看历史项
  removeViewingHistory: (item: ViewingHistoryItem) => void
  // 清空观看历史
  clearViewingHistory: () => void
  // 更新播放进度
  updatePlaybackProgress: (item: ViewingHistoryItem) => void
}

type ViewingHistoryStore = ViewingHistoryState & ViewingHistoryActions

export const useViewingHistoryStore = create<ViewingHistoryStore>()(
  devtools(
    persist(
      immer<ViewingHistoryStore>(set => ({
        // 初始状态
        viewingHistory: [],

        // Actions
        addViewingHistory: (item: ViewingHistoryItem) => {
          set(state => {
            // 检查是否已经存在相同视频的记录
            const existingIndex = state.viewingHistory.findIndex(
              historyItem =>
                historyItem.sourceCode === item.sourceCode && historyItem.vodId === item.vodId,
            )

            if (existingIndex !== -1) {
              // 更新现有记录
              const existingItem = state.viewingHistory[existingIndex]
              existingItem.episodeIndex = item.episodeIndex
              existingItem.timestamp = Date.now()
              existingItem.playbackPosition = item.playbackPosition
              existingItem.duration = item.duration
              // 移到最前面
              state.viewingHistory.splice(existingIndex, 1)
              state.viewingHistory.unshift(existingItem)
            } else {
              // 添加新记录
              state.viewingHistory.unshift({
                ...item,
                timestamp: Date.now(),
              })
            }

            // 限制历史记录数量
            if (state.viewingHistory.length > 50) {
              state.viewingHistory.splice(50)
            }
          })
        },

        removeViewingHistory: (item: ViewingHistoryItem) => {
          set(state => {
            state.viewingHistory = state.viewingHistory.filter(
              historyItem =>
                historyItem.sourceCode !== item.sourceCode || historyItem.vodId !== item.vodId,
            )
          })
        },

        clearViewingHistory: () => {
          set(state => {
            state.viewingHistory = []
          })
        },

        updatePlaybackProgress: (item: ViewingHistoryItem) => {
          set(state => {
            const historyItem = state.viewingHistory.find(
              historyItem =>
                historyItem.sourceCode === item.sourceCode && historyItem.vodId === item.vodId,
            )
            if (historyItem) {
              historyItem.playbackPosition = item.playbackPosition
              historyItem.duration = item.duration
              historyItem.timestamp = Date.now()
            }
          })
        },
      })),
      {
        name: 'ouonnki-tv-viewing-history', // 持久化存储的键名
      },
    ),
    {
      name: 'ViewingHistoryStore', // DevTools 中显示的名称
    },
  ),
)
