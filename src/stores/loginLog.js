import { defineStore } from 'pinia'
import { loginLogService } from '@/services/loginLogService'

export const useLoginLogStore = defineStore('loginLog', {
  state: () => ({
    loginLogs: [],
    totalLoginLogs: 0,
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
    error: null,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.totalLoginLogs / state.pageSize),
  },

  actions: {
    async fetchLoginLogList(page = 1, pageSize = 10, filters = {}) {
      this.isLoading = true
      this.error = null

      try {
        const response = await loginLogService.getLoginLogList(page, pageSize, filters)
        this.loginLogs = response.data.data || []
        this.totalLoginLogs = response.data.total || 0
        this.currentPage = page
        this.pageSize = pageSize
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch login log list'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})
