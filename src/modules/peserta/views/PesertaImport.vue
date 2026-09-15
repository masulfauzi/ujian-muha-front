<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-2xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Import Peserta</h1>
        <p class="text-slate-500 mt-1">Tambahkan banyak peserta sekaligus (lintas kelas) dari satu file Excel</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="isSubmitting" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Mengimport peserta...</p>
        </div>
      </div>

      <!-- Form Section -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- Template Download -->
        <div class="p-4 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-slate-900">Belum punya file template?</p>
            <p class="text-sm text-slate-600">Unduh template Excel (nama, username, password, kelas) sebagai contoh format.</p>
          </div>
          <button
            type="button"
            @click="handleDownloadTemplate"
            :disabled="isDownloadingTemplate"
            class="shrink-0 flex items-center gap-2 bg-white border border-sky-300 text-sky-700 hover:bg-sky-100 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            <span class="material-symbols-outlined text-lg">download</span>
            {{ isDownloadingTemplate ? 'Mengunduh...' : 'Download Template' }}
          </button>
        </div>

        <!-- File Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            File Excel <span class="text-red-600">*</span>
          </label>
          <input
            ref="fileInput"
            type="file"
            accept=".xls,.xlsx"
            @change="handleFileChange"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.file }">
          <p v-if="errors.file" class="text-red-600 text-sm mt-1">{{ errors.file }}</p>
          <p class="text-slate-500 text-sm mt-1">Format .xls/.xlsx, maksimal 10MB. Kolom: nama, username, password, kelas.</p>
          <p class="text-amber-600 text-sm mt-1">Nama kelas pada file harus sudah terdaftar di data master Kelas. Jika ada satu saja nama kelas yang tidak ditemukan, seluruh import akan dibatalkan.</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            :disabled="isSubmitting">
            <span class="material-symbols-outlined">upload</span>
            Import Peserta
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
            Batal
          </button>
        </div>
      </form>

      <!-- Import Result -->
      <div v-if="result" class="mt-6 bg-white rounded-lg shadow border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Hasil Import</h2>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <p class="text-2xl font-bold text-slate-900">{{ result.total_processed ?? 0 }}</p>
            <p class="text-sm text-slate-500">Diproses</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-2xl font-bold text-green-700">{{ result.total_success ?? 0 }}</p>
            <p class="text-sm text-slate-500">Berhasil</p>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <p class="text-2xl font-bold text-red-700">{{ result.total_failed ?? 0 }}</p>
            <p class="text-sm text-slate-500">Gagal</p>
          </div>
        </div>

        <div v-if="result.errors && result.errors.length > 0">
          <p class="text-sm font-semibold text-slate-900 mb-2">Detail Baris Gagal</p>
          <div class="border border-slate-200 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Baris</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Keterangan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr v-for="(err, idx) in result.errors" :key="idx">
                  <td class="px-4 py-2 text-slate-900">{{ err.row }}</td>
                  <td class="px-4 py-2 text-red-700">{{ err.error }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex gap-3 pt-6">
          <button
            @click="handleBackToList"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Kembali ke Daftar Peserta
          </button>
          <button
            @click="handleImportAgain"
            class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
            Import Lagi
          </button>
        </div>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { usePesertaStore } from '@/stores/peserta'
import { pesertaService } from '@/services/pesertaService'
import { downloadBlob, extractBlobErrorMessage } from '@/utils/download'
import { useRouter } from 'vue-router'
import { useDialog } from '@/composables/useDialog'

const pesertaStore = usePesertaStore()
const router = useRouter()
const { $alert } = useDialog()

const isSubmitting = ref(false)
const isDownloadingTemplate = ref(false)
const error = ref(null)
const result = ref(null)
const fileInput = ref(null)
const selectedFile = ref(null)

const errors = reactive({
  file: '',
})

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0] || null
  validateFile()
}

const validateFile = () => {
  errors.file = ''
  if (!selectedFile.value) {
    errors.file = 'File Excel wajib dipilih'
  } else if (selectedFile.value.size > 10 * 1024 * 1024) {
    errors.file = 'Ukuran file maksimal 10MB'
  }
}

const validateForm = () => {
  validateFile()
  return !errors.file
}

const handleSubmit = async () => {
  error.value = null
  result.value = null

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const data = await pesertaStore.importPeserta(selectedFile.value)
    result.value = data
  } catch (err) {
    error.value = pesertaStore.error || 'Gagal mengimport peserta'
  } finally {
    isSubmitting.value = false
  }
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

const handleImportAgain = () => {
  result.value = null
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleBackToList = () => {
  router.push({ name: 'peserta.list' })
}

const handleCancel = () => {
  router.back()
}
</script>
