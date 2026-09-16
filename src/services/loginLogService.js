import api from './api'

export const loginLogService = {
  getLoginLogList: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = { page, page_size: pageSize }
      if (filters.username) params.username = filters.username
      const response = await api.get('/login-log', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },
}
