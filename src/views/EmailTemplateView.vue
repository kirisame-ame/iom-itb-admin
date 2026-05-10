<template>
  <div class="min-h-screen">
    <Breadcrumb :breadcrumb="title" />

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>

        <div class="relative">
          <h1 class="text-2xl font-bold tracking-tight md:text-4xl">
            Template Email
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
            Kelola template pesan email otomatis untuk donasi dan merchandise.
          </p>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div class="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900">Daftar Template</h2>
            <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {{ templates.length }} template
            </span>
          </div>

          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-14 animate-pulse rounded-xl bg-slate-100"></div>
          </div>

          <div v-else-if="!templates.length" class="rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <p class="text-sm italic text-slate-400">Belum ada template email.</p>
          </div>

          <div v-else class="space-y-3">
            <button
              v-for="template in templates"
              :key="template.key"
              type="button"
              @click="selectTemplate(template)"
              class="w-full rounded-xl border px-4 py-3 text-left transition-all hover:bg-blue-50"
              :class="
                selectedTemplate?.key === template.key
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700'
              "
            >
              <p class="font-semibold">{{ template.title }}</p>
            </button>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div
            v-if="selectedTemplate"
            class="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm"
          >
            <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 class="text-xl font-bold text-blue-900">
                  {{ selectedTemplate.title }}
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  Ubah subject dan isi pesan email sesuai kebutuhan.
                </p>
              </div>

              <span
                class="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold"
                :class="selectedTemplate.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ selectedTemplate.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <div class="space-y-5">
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">
                  Subject Email
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Masukkan subject email"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">
                  Isi Pesan
                </label>
                <textarea
                  v-model="form.body"
                  rows="14"
                  class="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Masukkan isi pesan email"
                ></textarea>
              </div>

              <div>
                <p class="mb-2 text-sm font-semibold text-slate-700">
                  Variable yang dapat digunakan
                </p>

                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="variable in parsedVariables"
                    :key="variable"
                    type="button"
                    class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                    @click="insertVariable(variable)"
                  >
                    {{ variableLabel(variable) }}
                  </button>
                </div>
              </div>

              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="mb-2 text-sm font-semibold text-slate-700">
                  Preview Subject
                </p>
                <p class="text-sm text-slate-600">
                  {{ form.subject || '-' }}
                </p>
              </div>

              <div class="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  class="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
                  @click="resetForm"
                >
                  Reset
                </button>

                <button
                  type="button"
                  class="rounded-lg bg-blue-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isSaving"
                  @click="saveTemplate"
                >
                  {{ isSaving ? 'Menyimpan...' : 'Simpan Template' }}
                </button>
              </div>
            </div>
          </div>

          <div
            v-else
            class="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center shadow-sm"
          >
            <p class="text-sm italic text-slate-400">
              Pilih template email terlebih dahulu.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Breadcrumb from '../components/AppBreadcrumb.vue';

type EmailTemplate = {
  id?: number;
  key: string;
  title: string;
  subject: string;
  body: string;
  variables?: string[] | string;
  isActive?: boolean;
};

const title = ref('Template Email');
const templates = ref<EmailTemplate[]>([]);
const selectedTemplate = ref<EmailTemplate | null>(null);

const isLoading = ref(false);
const isSaving = ref(false);

const form = ref({
  subject: '',
  body: '',
});

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

const parsedVariables = computed(() => {
  const raw = selectedTemplate.value?.variables;

  if (Array.isArray(raw)) return raw;

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
});

const variableLabel = (variable: string) => `{{${variable}}}`;

const showSuccess = async (text: string) => {
  await Swal.fire({
    title: 'Berhasil',
    text,
    icon: 'success',
    confirmButtonColor: '#1e40af',
    confirmButtonText: 'OK',
  });
};

const showError = async (text: string) => {
  await Swal.fire({
    title: 'Gagal',
    text,
    icon: 'error',
    confirmButtonColor: '#1e40af',
    confirmButtonText: 'OK',
  });
};

const fetchTemplates = async () => {
  isLoading.value = true;

  try {
    const response = await axios.get(`${API_URL}/email-templates`);
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];

    templates.value = data;

    if (data.length > 0) {
      selectTemplate(data[0]);
    }
  } catch (error) {
    console.error(error);
    await showError('Gagal mengambil template email.');
  } finally {
    isLoading.value = false;
  }
};

const selectTemplate = (template: EmailTemplate) => {
  selectedTemplate.value = template;

  form.value = {
    subject: template.subject || '',
    body: template.body || '',
  };
};

const resetForm = () => {
  if (!selectedTemplate.value) return;
  selectTemplate(selectedTemplate.value);
};

const insertVariable = (variable: string) => {
  form.value.body += `${form.value.body ? ' ' : ''}${variableLabel(variable)}`;
};

const saveTemplate = async () => {
  if (!selectedTemplate.value) return;

  if (!form.value.subject.trim()) {
    await showError('Subject email wajib diisi.');
    return;
  }

  if (!form.value.body.trim()) {
    await showError('Isi pesan email wajib diisi.');
    return;
  }

  isSaving.value = true;

  try {
    await axios.put(`${API_URL}/email-templates/${selectedTemplate.value.key}`, {
      subject: form.value.subject,
      body: form.value.body,
    });

    await showSuccess('Template email berhasil disimpan.');
    await fetchTemplates();

    const updatedTemplate = templates.value.find(
      (item) => item.key === selectedTemplate.value?.key
    );

    if (updatedTemplate) {
      selectTemplate(updatedTemplate);
    }
  } catch (error) {
    console.error(error);
    await showError('Gagal menyimpan template email.');
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchTemplates);
</script>