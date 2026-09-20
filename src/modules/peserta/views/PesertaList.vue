<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto">
      <!-- Page Title & Create Button -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Manajemen Peserta Ujian</h1>
          <p class="text-slate-500 mt-1">Kelola semua peserta ujian dalam sistem</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="handleDownloadTemplate"
            :disabled="isDownloadingTemplate"
            class="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            <span class="material-symbols-outlined">download</span>
            {{ isDownloadingTemplate ? 'Mengunduh...' : 'Download Template' }}
          </button>
          <button
            @click="handleImport"
            class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <span class="material-symbols-outlined">upload</span>
            Import Peserta
          </button>
          <button
            @click="handleCreate"
            class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <span class="material-symbols-outlined">add</span>
            Buat Peserta Baru
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
        {{ success }}
      </div>

      <!-- Filter Section -->
      <div v-if="!isLoading" class="mb-6">
        <form @submit.prevent="handleFilter" class="flex flex-wrap items-center gap-3">
          <input
            v-model="filterSearch"
            type="text"
            placeholder="Cari nama atau username..."
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 flex-1 min-w-[240px] max-w-md">
          <button
            type="submit"
            class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            <span class="material-symbols-outlined text-lg">search</span>
            Cari
          </button>
          <select
            v-model="filterKelasId"
            @change="handleFilter"
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">Semua Kelas</option>
            <option v-for="kelas in kelasStore.kelass" :key="kelas.id" :value="kelas.id">
              {{ kelas.nama_kelas }}
            </option>
          </select>
          <button
            v-if="filterSearch || filterKelasId"
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
          <p class="mt-3 text-slate-600">Memuat data peserta...</p>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div v-if="!isLoading && pesertas.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-slate-300">inbox</span>
          <p class="text-slate-600 mt-4">Belum ada peserta yang dibuat</p>
          <button
            @click="handleCreate"
            class="mt-4 text-sky-600 hover:text-sky-700 font-semibold">
            Buat peserta pertama Anda
          </button>
        </div>

        <table v-else class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No.</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Kelas</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Username</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Password</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(peserta, index) in pesertas" :key="peserta.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-900">
                {{ (currentPage - 1) * pageSize + index + 1 }}
              </td>
              <td class="px-6 py-4 text-slate-900 font-medium">{{ peserta.nama }}</td>
              <td class="px-6 py-4 text-slate-900">{{ peserta.nama_kelas }}</td>
              <td class="px-6 py-4 text-slate-900">{{ peserta.username }}</td>
              <td class="px-6 py-4 text-slate-900">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm">{{ revealedIds.has(peserta.id) ? (peserta.password ?? '-') : '••••••••' }}</span>
                  <button
                    @click="togglePassword(peserta.id)"
                    class="text-slate-400 hover:text-slate-600 transition-colors"
                    :title="revealedIds.has(peserta.id) ? 'Sembunyikan password' : 'Lihat password'">
                    <span class="material-symbols-outlined text-[18px]">
                      {{ revealedIds.has(peserta.id) ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleView(peserta.id)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Lihat detail">
                    <span class="material-symbols-outlined text-lg">visibility</span>
                  </button>
                  <button
                    @click="handleEdit(peserta.id)"
                    class="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    title="Edit">
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    @click="handleDelete(peserta.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Hapus">
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && pesertas.length > 0" class="flex items-center justify-between mt-6">
        <p class="text-slate-600">
          Menampilkan {{ (currentPage - 1) * pageSize + 1 }} hingga
          {{ Math.min(currentPage * pageSize, totalPeserta) }} dari {{ totalPeserta }} peserta
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

      <!-- Danger Zone -->
      <div class="mt-10 border border-red-200 bg-red-50 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-red-800">Zona Berbahaya</h2>
        <p class="text-red-700 text-sm mt-1">
          Menghapus semua peserta bersifat permanen dan tidak bisa di-restore. Record nilai/jawaban yang
          terkait peserta tidak ikut terhapus, tapi jadi tidak lagi mereferensikan peserta manapun.
        </p>
        <button
          @click="handleDeleteAll"
          :disabled="isDeletingAll"
          class="mt-4 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          <span class="material-symbols-outlined">delete_forever</span>
          {{ isDeletingAll ? 'Menghapus...' : 'Hapus Semua Peserta' }}
        </button>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { usePesertaStore } from '@/stores/peserta'
import { useDialog } from '@/composables/useDialog'
import { useKelasStore } from '@/stores/kelas'
import { useRouter } from 'vue-router'
import { pesertaService } from '@/services/pesertaService'
import { downloadBlob, extractBlobErrorMessage } from '@/utils/download'

const pesertaStore = usePesertaStore()
const kelasStore = useKelasStore()
const router = useRouter()
const { $confirm, $alert, $prompt } = useDialog()
const currentPage = ref(1)
const filterKelasId = ref('')
const filterSearch = ref('')
const revealedIds = ref(new Set())
const isDownloadingTemplate = ref(false)
const isDeletingAll = ref(false)
const DELETE_ALL_CONFIRM_PHRASE = 'HAPUS SEMUA PESERTA'

onMounted(async () => {
  try {
    await kelasStore.fetchKelasList(1, 100)
  } catch (err) {
    console.error('Error loading kelas:', err)
  }
  await pesertaStore.fetchPesertaList(1)
})

const pesertas = computed(() => pesertaStore.pesertas)
const isLoading = computed(() => pesertaStore.isLoading)
const error = computed(() => pesertaStore.error)
const success = computed(() => pesertaStore.success)
const pageSize = computed(() => pesertaStore.pageSize)
const totalPeserta = computed(() => pesertaStore.totalPeserta)
const totalPages = computed(() => pesertaStore.totalPages)

watch(success, (newVal) => {
  if (newVal) {
    setTimeout(() => pesertaStore.clearSuccess(), 3000)
  }
})

watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => pesertaStore.clearError(), 3000)
  }
})

const togglePassword = (id) => {
  if (revealedIds.value.has(id)) {
    revealedIds.value.delete(id)
  } else {
    revealedIds.value.add(id)
  }
}

const handleCreate = () => {
  router.push({ name: 'peserta.create' })
}

const handleImport = () => {
  router.push({ name: 'peserta.import' })
}

const handleDownloadTemplate = async () => {
  if (isDownloadingTemplate.value) return
  isDownloadingTemplate.value = true
  try {
    const response = await pesertaService.downloadTemplate()
    downloadBlob(
      response,
      'template_import_peserta.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  } catch (err) {
    const message = await extractBlobErrorMessage(err, 'Gagal mengunduh template')
    await $alert(message, { title: 'Gagal', type: 'error' })
  } finally {
    isDownloadingTemplate.value = false
  }
}

const handleView = (id) => {
  router.push({ name: 'peserta.detail', params: { id } })
}

const handleEdit = (id) => {
  router.push({ name: 'peserta.edit', params: { id } })
}

const handleDelete = async (id) => {
  if (await $confirm('Yakin ingin menghapus peserta ini?', { title: 'Konfirmasi Hapus' })) {
    try {
      await pesertaStore.deletePeserta(id)
      await pesertaStore.fetchPesertaList(currentPage.value, pageSize.value, { id_kelas: filterKelasId.value, search: filterSearch.value })
    } catch (err) {
      console.error('Error deleting peserta:', err)
    }
  }
}

const handlePageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await pesertaStore.fetchPesertaList(page, pageSize.value, { id_kelas: filterKelasId.value, search: filterSearch.value })
  }
}

const handleFilter = async () => {
  currentPage.value = 1
  await pesertaStore.fetchPesertaList(1, pageSize.value, { id_kelas: filterKelasId.value, search: filterSearch.value })
}

const handleResetFilter = async () => {
  filterSearch.value = ''
  filterKelasId.value = ''
  currentPage.value = 1
  await pesertaStore.fetchPesertaList(1, pageSize.value)
}

const handleDeleteAll = async () => {
  const confirmed = await $confirm(
    `Anda akan menghapus PERMANEN seluruh ${totalPeserta.value} peserta di seluruh sistem. ` +
    'Tindakan ini tidak bisa dibatalkan dan tidak bisa di-restore. Lanjutkan?',
    { title: 'Hapus Semua Peserta' }
  )
  if (!confirmed) return

  const typed = await $prompt(
    `Ketik "${DELETE_ALL_CONFIRM_PHRASE}" untuk mengonfirmasi penghapusan permanen ini.`,
    { title: 'Konfirmasi Terakhir', inputLabel: 'Teks konfirmasi', inputPlaceholder: DELETE_ALL_CONFIRM_PHRASE }
  )
  if (typed !== DELETE_ALL_CONFIRM_PHRASE) {
    if (typed !== null) {
      await $alert('Teks konfirmasi tidak sesuai. Penghapusan dibatalkan.', { title: 'Dibatalkan' })
    }
    return
  }

  isDeletingAll.value = true
  try {
    await pesertaStore.deleteAllPeserta()
    currentPage.value = 1
    filterKelasId.value = ''
    filterSearch.value = ''
    await pesertaStore.fetchPesertaList(1, pageSize.value)
  } catch (err) {
    console.error('Error deleting all peserta:', err)
  } finally {
    isDeletingAll.value = false
  }
}
</script>
