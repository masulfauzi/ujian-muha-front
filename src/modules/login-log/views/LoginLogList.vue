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
        <h1 class="text-3xl font-bold text-slate-900">Login Log</h1>
        <p class="text-slate-500 mt-1">Riwayat percobaan login (berhasil maupun gagal) — dicatat otomatis oleh sistem</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Filter Section -->
      <div class="mb-6">
        <form @submit.prevent="handleFilter" class="flex items-center gap-3">
          <input
            v-model="filterUsername"
            type="text"
            placeholder="Cari berdasarkan username..."
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full max-w-xs">
          <button
            type="submit"
            class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            <span class="material-symbols-outlined text-lg">search</span>
            Cari
          </button>
          <button
            v-if="filterUsername"
            type="button"
            @click="handleResetFilter"
            class="text-slate-500 hover:text-slate-700 font-semibold">
            Reset
          </button>
        </form>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat login log...</p>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div v-if="!isLoading && loginLogs.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-slate-300">inbox</span>
          <p class="text-slate-600 mt-4">Belum ada riwayat login</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Waktu</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Username</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">IP Address</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">User Agent</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">X-Requested-With</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Keterangan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="log in loginLogs" :key="log.id" class="hover:bg-slate-50">
                <td class="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{{ formatDateTime(log.created_at) }}</td>
                <td class="px-6 py-4 text-slate-900 font-medium">{{ log.username }}</td>
                <td class="px-6 py-4 text-slate-600">{{ log.role || '-' }}</td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="log.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                    <span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">
                      {{ log.success ? 'check_circle' : 'cancel' }}
                    </span>
                    {{ log.success ? 'Berhasil' : 'Gagal' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-600 font-mono text-sm whitespace-nowrap">{{ log.ip_address || '-' }}</td>
                <td class="px-6 py-4 text-slate-600 font-mono text-xs max-w-xs">
                  <span class="line-clamp-2 break-all" :title="log.user_agent">{{ log.user_agent || '-' }}</span>
                </td>
                <td class="px-6 py-4 text-slate-600 font-mono text-xs max-w-[160px]">
                  <span class="line-clamp-2 break-all" :title="log.x_requested_with">{{ log.x_requested_with || '-' }}</span>
                </td>
                <td class="px-6 py-4 text-slate-600 text-sm max-w-xs">
                  <span class="line-clamp-2">{{ log.keterangan || '-' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && loginLogs.length > 0" class="flex items-center justify-between mt-6">
        <p class="text-slate-600">
          Menampilkan {{ (currentPage - 1) * pageSize + 1 }} hingga
          {{ Math.min(currentPage * pageSize, totalLoginLogs) }} dari {{ totalLoginLogs }} log
        </p>
        <div class="flex gap-2">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Sebelumnya
          </button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'px-3 py-2 rounded-lg font-medium transition-colors',
                page === currentPage
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              ]">
              {{ page }}
            </button>
          </div>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Berikutnya
          </button>
        </div>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useLoginLogStore } from '@/stores/loginLog'

const loginLogStore = useLoginLogStore()
const currentPage = ref(1)
const filterUsername = ref('')

onMounted(async () => {
  await loginLogStore.fetchLoginLogList(1)
})

const loginLogs = computed(() => loginLogStore.loginLogs)
const isLoading = computed(() => loginLogStore.isLoading)
const error = computed(() => loginLogStore.error)
const pageSize = computed(() => loginLogStore.pageSize)
const totalLoginLogs = computed(() => loginLogStore.totalLoginLogs)
const totalPages = computed(() => loginLogStore.totalPages)

watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => loginLogStore.clearError(), 3000)
  }
})

const handleFilter = async () => {
  currentPage.value = 1
  await loginLogStore.fetchLoginLogList(1, pageSize.value, { username: filterUsername.value })
}

const handleResetFilter = async () => {
  filterUsername.value = ''
  currentPage.value = 1
  await loginLogStore.fetchLoginLogList(1, pageSize.value)
}

const handlePageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await loginLogStore.fetchLoginLogList(page, pageSize.value, { username: filterUsername.value })
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return dateString
  }
}
</script>
