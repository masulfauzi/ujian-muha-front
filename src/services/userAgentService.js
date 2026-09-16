import api from './api'

export const userAgentService = {
  getUserAgentList: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/user-agent', {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getUserAgentById: async (id) => {
    try {
      const response = await api.get(`/user-agent/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createUserAgent: async (payload) => {
    try {
      const response = await api.post('/user-agent', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateUserAgent: async (id, payload) => {
    try {
      const response = await api.put(`/user-agent/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteUserAgent: async (id) => {
    try {
      const response = await api.delete(`/user-agent/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restoreUserAgent: async (id) => {
    try {
      const response = await api.patch(`/user-agent/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
