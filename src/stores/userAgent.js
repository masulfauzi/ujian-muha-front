import { defineStore } from 'pinia'
import { userAgentService } from '@/services/userAgentService'

export const useUserAgentStore = defineStore('userAgent', {
  state: () => ({
    userAgents: [],
    totalUserAgents: 0,
    currentPage: 1,
    pageSize: 10,
    selectedUserAgent: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    hasUserAgents: (state) => state.userAgents.length > 0,
    userAgentCount: (state) => state.userAgents.length,
    totalPages: (state) => Math.ceil(state.totalUserAgents / state.pageSize),
    userAgentById: (state) => (id) => state.userAgents.find(u => u.id === id),
  },

  actions: {
    async fetchUserAgentList(page = 1, pageSize = 10) {
      this.isLoading = true
      this.error = null

      try {
        const response = await userAgentService.getUserAgentList(page, pageSize)
        this.userAgents = response.data.data || []
        this.totalUserAgents = response.data.total || 0
        this.currentPage = page
        this.pageSize = pageSize
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch user agent list'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchUserAgentById(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await userAgentService.getUserAgentById(id)
        this.selectedUserAgent = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch user agent detail'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createUserAgent(payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await userAgentService.createUserAgent(payload)
        this.success = 'User agent berhasil dibuat'
        this.userAgents.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create user agent'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateUserAgent(id, payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await userAgentService.updateUserAgent(id, payload)
        this.success = 'User agent berhasil diupdate'

        const index = this.userAgents.findIndex(u => u.id === id)
        if (index !== -1) {
          this.userAgents[index] = response.data
        }
        this.selectedUserAgent = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update user agent'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteUserAgent(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await userAgentService.deleteUserAgent(id)
        this.success = 'User agent berhasil dihapus'
        this.userAgents = this.userAgents.filter(u => u.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete user agent'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async restoreUserAgent(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await userAgentService.restoreUserAgent(id)
        this.success = 'User agent berhasil di-restore'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to restore user agent'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearSuccess() {
      this.success = null
    },
  },
})
