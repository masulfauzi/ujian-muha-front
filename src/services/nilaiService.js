import api from './api'

export const nilaiService = {
  // Token wajib diisi hanya jika jadwal.wajib_token aktif.
  // Endpoint ini mengharuskan header User-Agent ATAU X-Requested-With
  // terdaftar di whitelist /user-agent. Header User-Agent selalu dikirim
  // browser secara native. Header X-Requested-With sengaja TIDAK di-set
  // di sini — di aplikasi exam-browser Android (WebView), header ini
  // otomatis disisipkan oleh sistem berisi package name aplikasi
  // (mis. com.exam.browser); menimpanya secara manual di JS justru akan
  // merusak nilai asli tersebut. Di browser biasa (Chrome/Firefox/Safari)
  // header ini tidak terkirim sama sekali, sehingga whitelist untuk kasus
  // itu mengandalkan User-Agent saja.
  mulaiUjian: async (idJadwal, token = null) => {
    try {
      const payload = token ? { token } : {}
      const response = await api.post(`/nilai/mulai-ujian/${idJadwal}`, payload)
      return response
    } catch (error) {
      throw error
    }
  },

  selesaiUjian: async (idNilai, payload) => {
    try {
      const response = await api.put(`/nilai/${idNilai}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getNilaiByJadwal: async (idJadwal, page = 1, pageSize = 10) => {
    try {
      const params = { page, page_size: pageSize }
      const response = await api.get(`/nilai/jadwal/${idJadwal}`, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  exportNilai: async (idJadwal) => {
    try {
      const response = await api.get(`/nilai/export/${idJadwal}`, {
        responseType: 'blob',
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Export analisis jawaban per soal ke Excel (per kelas, dalam ZIP)
  getAnalisisJawaban: async (idJadwal) => {
    try {
      const response = await api.get(`/nilai/analisis/${idJadwal}`, {
        responseType: 'blob',
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Maju ke section berikutnya (hanya berhasil jika durasi_menit_minimal section aktif sudah terlampaui)
  nextSection: async (idNilai) => {
    try {
      const response = await api.post(`/nilai/${idNilai}/next-section`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Cek status section aktif (read-only, untuk polling countdown)
  getSectionStatus: async (idNilai) => {
    try {
      const response = await api.get(`/nilai/${idNilai}/section-status`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
