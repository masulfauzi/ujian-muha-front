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
        <h1 class="text-3xl font-bold text-slate-900">Tambah User Agent</h1>
        <p class="text-slate-500 mt-1">Daftarkan user agent (browser/perangkat) baru yang boleh mengerjakan ujian</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="isSubmitting" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Menyimpan user agent...</p>
        </div>
      </div>

      <!-- Form Section -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- User Agent Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            User Agent String <span class="text-red-600">*</span>
          </label>
          <textarea
            v-model="formData.user_agent"
            @blur="validateUserAgent"
            placeholder="Contoh: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ..."
            rows="4"
            maxlength="500"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-mono text-sm resize-none"
            :class="{ 'border-red-500 focus:ring-red-500': errors.user_agent }">
          </textarea>
          <p v-if="errors.user_agent" class="text-red-600 text-sm mt-1">{{ errors.user_agent }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ formData.user_agent.length }} / 500 karakter</p>
        </div>

        <!-- Keterangan Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Keterangan (Opsional)</label>
          <input
            v-model="formData.keterangan"
            type="text"
            placeholder="Contoh: Laptop Lab Komputer 1"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all">
          <p class="text-slate-500 text-sm mt-1">Keterangan membantu identifikasi perangkat/browser ini</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            :disabled="isSubmitting">
            <span class="material-symbols-outlined">check</span>
            Simpan User Agent
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
            Batal
          </button>
        </div>
      </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useUserAgentStore } from '@/stores/userAgent'
import { useRouter } from 'vue-router'

const userAgentStore = useUserAgentStore()
const router = useRouter()
const isSubmitting = ref(false)
const error = ref(null)

const formData = reactive({
  user_agent: '',
  keterangan: ''
})

const errors = reactive({
  user_agent: ''
})

const validateUserAgent = () => {
  errors.user_agent = ''
  if (!formData.user_agent || formData.user_agent.trim().length === 0) {
    errors.user_agent = 'User agent wajib diisi'
  } else if (formData.user_agent.length > 500) {
    errors.user_agent = 'User agent maksimal 500 karakter'
  }
}

const validateForm = () => {
  validateUserAgent()
  return !errors.user_agent
}

const handleSubmit = async () => {
  error.value = null

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await userAgentStore.createUserAgent({
      user_agent: formData.user_agent.trim(),
      keterangan: formData.keterangan.trim()
    })

    router.push({ name: 'user-agent.list' })
  } catch (err) {
    error.value = userAgentStore.error || 'Gagal membuat user agent'
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>
