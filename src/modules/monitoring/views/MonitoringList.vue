<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Monitoring Peserta Ujian</h1>
          <p class="text-slate-500 mt-1">Pantau progres peserta secara live saat ujian berlangsung</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMsg" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ errorMsg }}
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Pilih Jadwal</label>
              <select
                v-model="selectedJadwalId"
                @change="loadMonitoring()"
                :disabled="isLoadingJadwal"
                class="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- Pilih Jadwal --</option>
                <option v-for="jadwal in jadwalList" :key="jadwal.id" :value="jadwal.id">
                  {{ jadwal.nama_ujian }}
                </option>
              </select>
            </div>
            <div v-if="selectedJadwalId">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Filter Kelas</label>
              <select
                v-model="selectedKelasId"
                class="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Semua Kelas</option>
                <option v-for="kelas in kelasOptions" :key="kelas.id" :value="kelas.id">
                  {{ kelas.nama }}
                </option>
              </select>
            </div>
            <div v-if="selectedJadwalId" class="flex items-end">
              <div class="flex items-center gap-2 text-sm text-slate-500 pb-2">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :class="isPolling ? 'bg-green-500 animate-pulse' : 'bg-slate-300'"></span>
                {{ isPolling ? 'Live — otomatis diperbarui tiap 12 detik' : 'Tidak memantau' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State (hanya fetch pertama) -->
        <div v-if="isLoadingMonitoring" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Memuat data monitoring...</p>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="selectedJadwalId && monitoringData">
          <!-- Summary Tiles -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow border border-slate-200 p-4">
              <p class="text-sm text-slate-500">Total Peserta</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">{{ displaySummary.total }}</p>
            </div>
            <div class="bg-white rounded-lg shadow border border-slate-200 p-4">
              <p class="text-sm text-slate-500">Belum Mulai</p>
              <p class="text-2xl font-bold text-slate-600 mt-1">{{ displaySummary.belum_mulai }}</p>
            </div>
            <div class="bg-white rounded-lg shadow border border-slate-200 p-4">
              <p class="text-sm text-slate-500">Sedang Mengerjakan</p>
              <p class="text-2xl font-bold text-blue-600 mt-1">{{ displaySummary.sedang_mengerjakan }}</p>
            </div>
            <div class="bg-white rounded-lg shadow border border-slate-200 p-4">
              <p class="text-sm text-slate-500">Selesai</p>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ displaySummary.selesai }}</p>
            </div>
          </div>

          <!-- Bulk Action -->
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-slate-500">
              Daftar Peserta
              <span v-if="selectedKelasId">(difilter ke satu kelas — tombol di samping tetap memproses semua kelas)</span>
            </p>
            <button
              v-if="monitoringData"
              @click="handleForceFinishAll"
              :disabled="isBulkFinishing || (monitoringData.summary?.sedang_mengerjakan || 0) === 0"
              class="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              <span class="material-symbols-outlined text-lg">done_all</span>
              {{ isBulkFinishing ? 'Memproses...' : `Selesaikan Semua (${monitoringData.summary?.sedang_mengerjakan || 0})` }}
            </button>
          </div>

          <!-- Table Section -->
          <div class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div v-if="filteredRows.length === 0" class="text-center py-12">
              <span class="material-symbols-outlined text-6xl text-slate-300">inbox</span>
              <p class="text-slate-600 mt-4">
                {{ selectedKelasId ? 'Tidak ada peserta pada kelas ini' : 'Belum ada peserta terdaftar pada jadwal ini' }}
              </p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No.</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama Peserta</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Username</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Kelas</th>
                    <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nilai</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Waktu Mulai</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Waktu Selesai</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Aktivitas Terakhir</th>
                    <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr v-for="(row, index) in filteredRows" :key="row.id_peserta" class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-slate-900 font-medium">{{ index + 1 }}</td>
                    <td class="px-6 py-4 text-slate-900">{{ row.nama_peserta }}</td>
                    <td class="px-6 py-4 text-slate-600">{{ row.username }}</td>
                    <td class="px-6 py-4 text-slate-600">{{ row.nama_kelas }}</td>
                    <td class="px-6 py-4 text-center">
                      <span
                        :class="statusBadge(row.status).class"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                        <span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">
                          {{ statusBadge(row.status).icon }}
                        </span>
                        {{ statusBadge(row.status).label }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-slate-900 font-medium">{{ row.status === 'belum_mulai' ? '-' : (row.nilai ?? '-') }}</td>
                    <td class="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{{ formatDateTime(row.wkt_mulai) }}</td>
                    <td class="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{{ formatDateTime(row.wkt_selesai) }}</td>
                    <td class="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{{ formatDateTime(row.aktivitas_terakhir) }}</td>
                    <td class="px-6 py-4 text-center">
                      <button
                        v-if="row.status === 'sedang_mengerjakan' && row.id_nilai"
                        @click="handleForceFinish(row)"
                        :disabled="forcingId === row.id_nilai"
                        class="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                        {{ forcingId === row.id_nilai ? 'Memproses...' : 'Selesaikan Paksa' }}
                      </button>
                      <span v-else class="text-slate-300 text-sm">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <span class="material-symbols-outlined text-7xl text-slate-300">monitor_heart</span>
          <p class="text-slate-600 mt-4 text-lg">Pilih jadwal untuk melihat data monitoring</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { jadwalService } from '@/services/jadwalService'
import { nilaiService } from '@/services/nilaiService'
import { useDialog } from '@/composables/useDialog'

const { $confirm, $alert } = useDialog()

const POLL_INTERVAL_MS = 12000

const jadwalList = ref([])
const selectedJadwalId = ref('')
const selectedKelasId = ref('')
const monitoringData = ref(null)
const isLoadingJadwal = ref(false)
const isLoadingMonitoring = ref(false)
const errorMsg = ref('')
const forcingId = ref(null)
const isBulkFinishing = ref(false)
const pollTimer = ref(null)
const isPolling = computed(() => pollTimer.value !== null)

onMounted(async () => {
  isLoadingJadwal.value = true
  try {
    const res = await jadwalService.getJadwalList(1, 100)
    jadwalList.value = res.data?.data || []
  } catch (err) {
    errorMsg.value = 'Gagal memuat daftar jadwal'
    console.error('Error loading jadwal:', err)
  } finally {
    isLoadingJadwal.value = false
  }
})

onBeforeUnmount(() => {
  stopPolling()
})

// Opsi filter kelas diturunkan dari data monitoring yang sudah di-fetch,
// bukan dari request /kelas terpisah — menghindari network call tambahan
// dan menjamin opsi filter selalu relevan dengan jadwal yang dipilih.
const kelasOptions = computed(() => {
  const rows = monitoringData.value?.data || []
  const seen = new Map()
  rows.forEach(r => {
    if (r.id_kelas && !seen.has(r.id_kelas)) {
      seen.set(r.id_kelas, { id: r.id_kelas, nama: r.nama_kelas })
    }
  })
  return Array.from(seen.values())
})

const filteredRows = computed(() => {
  const rows = monitoringData.value?.data || []
  if (!selectedKelasId.value) return rows
  return rows.filter(r => r.id_kelas === selectedKelasId.value)
})

const displaySummary = computed(() => {
  if (!selectedKelasId.value) {
    return monitoringData.value?.summary || { belum_mulai: 0, sedang_mengerjakan: 0, selesai: 0, total: 0 }
  }
  const rows = filteredRows.value
  return {
    total: rows.length,
    belum_mulai: rows.filter(r => r.status === 'belum_mulai').length,
    sedang_mengerjakan: rows.filter(r => r.status === 'sedang_mengerjakan').length,
    selesai: rows.filter(r => r.status === 'selesai').length,
  }
})

const fetchMonitoring = async ({ silent = false } = {}) => {
  if (!selectedJadwalId.value) return
  if (!silent) isLoadingMonitoring.value = true
  if (!silent) errorMsg.value = ''
  try {
    const res = await nilaiService.getMonitoring(selectedJadwalId.value)
    monitoringData.value = res.data
  } catch (err) {
    if (!silent) {
      errorMsg.value = err.response?.data?.message || 'Gagal memuat data monitoring'
      monitoringData.value = null
    }
    console.error('Error loading monitoring:', err)
  } finally {
    if (!silent) isLoadingMonitoring.value = false
  }
}

const startPolling = () => {
  if (pollTimer.value) clearInterval(pollTimer.value)
  pollTimer.value = setInterval(() => {
    fetchMonitoring({ silent: true })
  }, POLL_INTERVAL_MS)
}

const stopPolling = () => {
  if (pollTimer.value) {
    clearInterval(pollTimer.value)
    pollTimer.value = null
  }
}

const loadMonitoring = async () => {
  stopPolling()
  monitoringData.value = null
  selectedKelasId.value = ''
  if (!selectedJadwalId.value) return
  await fetchMonitoring()
  startPolling()
}

const statusBadge = (status) => {
  if (status === 'sedang_mengerjakan') {
    return { class: 'bg-blue-100 text-blue-700', icon: 'edit', label: 'Sedang Mengerjakan' }
  }
  if (status === 'selesai') {
    return { class: 'bg-green-100 text-green-700', icon: 'check_circle', label: 'Selesai' }
  }
  return { class: 'bg-slate-100 text-slate-600', icon: 'schedule', label: 'Belum Mulai' }
}

const handleForceFinish = async (row) => {
  const ok = await $confirm(
    `Yakin ingin menyelesaikan paksa ujian untuk "${row.nama_peserta}"? Nilai akan dihitung otomatis dari jawaban yang sudah tersimpan.`,
    { title: 'Selesaikan Paksa Ujian' }
  )
  if (!ok) return

  forcingId.value = row.id_nilai
  try {
    await nilaiService.forceFinish(row.id_nilai)
    await fetchMonitoring({ silent: true })
  } catch (err) {
    const message = err.response?.data?.message || 'Gagal menyelesaikan paksa ujian peserta ini'
    await $alert(message, { title: 'Gagal', type: 'error' })
    // State asli mungkin sudah berubah (mis. admin lain lebih dulu menyelesaikan
    // atau peserta submit sendiri barusan) — refresh supaya baris ini akurat.
    await fetchMonitoring({ silent: true })
  } finally {
    forcingId.value = null
  }
}

const handleForceFinishAll = async () => {
  const count = monitoringData.value?.summary?.sedang_mengerjakan || 0
  if (count === 0) return

  const ok = await $confirm(
    `Anda akan menyelesaikan paksa SEMUA ${count} peserta yang sedang mengerjakan pada jadwal ini, ` +
    `di SEMUA kelas (bukan hanya kelas yang sedang difilter). Nilai dihitung otomatis dari jawaban ` +
    `yang sudah tersimpan, dan tindakan ini tidak bisa dibatalkan.`,
    { title: 'Selesaikan Semua Peserta', checkboxLabel: 'Saya paham dan yakin ingin melanjutkan' }
  )
  if (!ok) return

  isBulkFinishing.value = true
  try {
    const res = await nilaiService.forceFinishAll(selectedJadwalId.value)
    const { total_diproses, total_berhasil, total_gagal, errors } = res.data
    if (total_gagal > 0) {
      console.error('Gagal selesaikan sebagian peserta:', errors)
    }
    await $alert(
      `Selesai memproses ${total_diproses} peserta: ${total_berhasil} berhasil` +
      (total_gagal > 0 ? `, ${total_gagal} gagal (lihat console untuk detail).` : '.'),
      { title: 'Selesaikan Semua Selesai', type: total_gagal > 0 ? 'warning' : 'success' }
    )
  } catch (err) {
    const message = err.response?.data?.message || 'Gagal menyelesaikan semua peserta'
    await $alert(message, { title: 'Gagal', type: 'error' })
  } finally {
    await fetchMonitoring({ silent: true })
    isBulkFinishing.value = false
  }
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
</script>
