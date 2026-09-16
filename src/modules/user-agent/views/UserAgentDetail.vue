<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-3xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">
          <span v-if="!isLoading">Detail User Agent</span>
          <span v-else>Memuat detail...</span>
        </h1>
        <p class="text-slate-500 mt-1">Informasi detail user agent</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat detail user agent...</p>
        </div>
      </div>

      <!-- Detail Section -->
      <div v-else-if="selectedUserAgent" class="space-y-6">
        <!-- User Agent Card -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h3 class="text-sm font-semibold text-slate-600 uppercase mb-2">User Agent String</h3>
          <p class="text-slate-900 font-mono text-sm break-all">{{ selectedUserAgent.user_agent }}</p>
        </div>

        <!-- Keterangan Card -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h3 class="text-sm font-semibold text-slate-600 uppercase mb-3">Keterangan</h3>
          <p v-if="selectedUserAgent.keterangan" class="text-slate-700 leading-relaxed">
            {{ selectedUserAgent.keterangan }}
          </p>
          <p v-else class="text-slate-500 italic">Tidak ada keterangan</p>
        </div>

        <!-- Metadata Card -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h3 class="text-sm font-semibold text-slate-600 uppercase mb-4">Informasi Sistem</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-500 uppercase">Dibuat pada</p>
              <p class="text-slate-900 font-medium">{{ formatDate(selectedUserAgent.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 uppercase">Diperbarui pada</p>
              <p class="text-slate-900 font-medium">{{ formatDate(selectedUserAgent.updated_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="handleEdit"
            class="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">edit</span>
            Edit User Agent
          </button>
          <button
            @click="handleDelete"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">delete</span>
            Hapus User Agent
          </button>
          <button
            @click="handleBack"
            class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
            Kembali
          </button>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-slate-300">search_off</span>
        <p class="text-slate-600 mt-4">User agent tidak ditemukan</p>
        <button
          @click="handleBack"
          class="mt-4 text-sky-600 hover:text-sky-700 font-semibold">
          Kembali ke daftar
        </button>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserAgentStore } from '@/stores/userAgent'
import { useDialog } from '@/composables/useDialog'

const route = useRoute()
const router = useRouter()
const userAgentStore = useUserAgentStore()
const { $confirm } = useDialog()
const userAgentId = route.params.id

const isLoading = computed(() => userAgentStore.isLoading)
const error = ref(null)
const selectedUserAgent = computed(() => userAgentStore.selectedUserAgent)

onMounted(async () => {
  try {
    await userAgentStore.fetchUserAgentById(userAgentId)
  } catch (err) {
    error.value = 'Gagal memuat detail user agent'
  }
})

const handleEdit = () => {
  router.push({ name: 'user-agent.edit', params: { id: userAgentId } })
}

const handleDelete = async () => {
  if (await $confirm('Yakin ingin menghapus user agent ini? Tindakan ini tidak dapat dibatalkan.', { title: 'Konfirmasi Hapus' })) {
    try {
      await userAgentStore.deleteUserAgent(userAgentId)
      router.push({ name: 'user-agent.list' })
    } catch (err) {
      error.value = userAgentStore.error || 'Gagal menghapus user agent'
    }
  }
}

const handleBack = () => {
  router.push({ name: 'user-agent.list' })
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
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
