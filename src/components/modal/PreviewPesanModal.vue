<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')" />

      <!-- Panel -->
      <div class="relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        <!-- Header -->
        <div class="flex flex-shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-slate-900">Preview & Test Kirim</h2>
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="template.channel === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'"
            >
              <svg v-if="template.channel === 'whatsapp'" class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <svg v-else class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
              </svg>
              {{ template.channel === 'whatsapp' ? 'WhatsApp' : 'Email' }}
            </span>
            <span class="text-sm text-slate-500">{{ template.title }}</span>
          </div>
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body: two columns -->
        <div class="flex min-h-0 flex-1">

          <!-- Left: variable fields + test send -->
          <div class="flex w-72 flex-shrink-0 flex-col gap-5 overflow-y-auto border-r border-slate-200 p-5">

            <!-- Variable inputs -->
            <div>
              <p class="mb-3 text-sm font-bold text-slate-800">Isi Variabel Preview</p>
              <div v-if="parsedVariables.length" class="space-y-3">
                <div v-for="v in parsedVariables" :key="v">
                  <label class="mb-1 block font-mono text-xs font-semibold text-slate-600">{{ variableTag(v) }}</label>
                  <input
                    v-model="inputVars[v]"
                    type="text"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <p v-else class="text-xs italic text-slate-400">Tidak ada variabel untuk template ini.</p>
            </div>

            <!-- Test Send [TEST ONLY - REMOVE BEFORE PRODUCTION] -->
            <div class="rounded-xl border border-amber-300 bg-amber-50 p-4">
              <div class="mb-1 flex items-center gap-1.5">
                <svg class="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p class="text-xs font-bold text-amber-800">Test Kirim</p>
              </div>
              <p class="mb-3 text-[11px] text-amber-700">Pesan uji coba. Email akan ditandai [TEST] dan tidak memengaruhi data produksi.</p>

              <label class="mb-1 block text-xs font-semibold text-slate-700">
                {{ template.channel === 'whatsapp' ? 'Nomor WhatsApp' : 'Alamat Email' }}
              </label>
              <input
                v-model="testRecipient"
                type="text"
                :placeholder="template.channel === 'whatsapp' ? '628123456789' : 'test@example.com'"
                class="mb-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2"
                :class="recipientError && testRecipient.trim()
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-blue-400 focus:ring-blue-500/20'"
              />
              <p v-if="recipientError && testRecipient.trim()" class="mb-2 text-[11px] text-red-600">{{ recipientError }}</p>
              <div v-else class="mb-2" />

              <button
                type="button"
                @click="sendTest"
                :disabled="isSending || !testRecipient.trim() || !!recipientError"
                class="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ isSending ? 'Mengirim...' : (template.channel === 'whatsapp' ? 'Kirim ke WhatsApp' : 'Kirim ke Email') }}
              </button>

              <p v-if="testResult" class="mt-2 text-xs font-medium" :class="testResult.ok ? 'text-green-700' : 'text-red-600'">
                {{ testResult.message }}
              </p>
            </div>
          </div>

          <!-- Right: preview -->
          <div class="flex-1 overflow-y-auto bg-slate-100 p-5">

            <!-- WA preview -->
            <template v-if="template.channel === 'whatsapp'">
              <p class="mb-3 text-center text-xs text-slate-500">Tampilan perkiraan pesan di WhatsApp</p>
              <div class="rounded-2xl bg-[#e5ddd5] p-5">
                <div class="flex justify-end">
                  <div class="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#dcf8c6] px-4 py-2.5 shadow-sm">
                    <div
                      class="break-words text-[14.5px] leading-relaxed text-[#111b21]"
                      v-html="waPreviewHtml || '(pesan kosong)'"
                    />
                    <div class="mt-1.5 flex items-center justify-end gap-1">
                      <span class="text-[11px] text-[#667781]">{{ previewTime }}</span>
                      <svg class="h-[13px] w-[18px] flex-shrink-0" viewBox="0 0 20 13" fill="none" stroke="#53bdeb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 7L5.5 11.5L13.5 2"/>
                        <path d="M7 7L11.5 11.5L19.5 2"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Email preview -->
            <template v-else>
              <p class="mb-3 text-center text-xs text-slate-500">Tampilan perkiraan email yang diterima pemohon</p>
              <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <!-- Email client mock header -->
                <div class="space-y-1 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <p class="text-xs text-slate-500">
                    <span class="font-semibold text-slate-700">Dari:</span>
                    IOM ITB &lt;noreply@iom-itb.ac.id&gt;
                  </p>
                  <p class="text-xs text-slate-500">
                    <span class="font-semibold text-slate-700">Kepada:</span>
                    {{ testRecipient || 'pemohon@example.com' }}
                  </p>
                  <p class="mt-1 text-sm font-semibold text-slate-800">{{ renderedSubject || '(tanpa subject)' }}</p>
                </div>
                <!-- Full email body rendered in iframe -->
                <iframe
                  :srcdoc="fullEmailIframeHtml"
                  class="w-full border-0"
                  style="height: 650px;"
                  sandbox="allow-same-origin"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import ApiService from '@/store/api.service'
import logoUrl from '@/assets/image/IOM-ITB-PrimaryLogo-blue.png'
import logoWhiteUrl from '@/assets/image/IOM-ITB-PrimaryLogo-white.png'

type MessageTemplate = {
  key: string
  title: string
  subject?: string | null
  body: string
  variables?: string[] | string
  channel: 'email' | 'whatsapp'
}

const props = defineProps<{
  template: MessageTemplate
  body: string
  subject: string
  sampleValues: Record<string, string>
}>()

defineEmits<{ (e: 'close'): void }>()

const testRecipient = ref('')
const isSending     = ref(false)
const testResult    = ref<{ ok: boolean; message: string } | null>(null)

const parsedVariables = computed<string[]>(() => {
  const raw = props.template.variables
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return [] }
  }
  return []
})

// inputVars: bound directly to inputs (immediate)
// localVars: debounced copy used for preview rendering
const inputVars = reactive<Record<string, string>>({})
const localVars = reactive<Record<string, string>>({})

watch(
  () => props.template.key,
  () => {
    parsedVariables.value.forEach(v => {
      inputVars[v] = props.sampleValues[v] ?? ''
      localVars[v] = props.sampleValues[v] ?? ''
    })
  },
  { immediate: true }
)

// Sync inputVars → localVars with 300ms debounce so preview only rerenders after typing pauses
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(inputVars, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { Object.assign(localVars, newVal) }, 300)
}, { deep: true })

const variableTag = (name: string) => `{{${name}}}`

const escHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const substituteVars = (text: string) => {
  let result = text
  for (const [k, v] of Object.entries(localVars)) {
    result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v)
  }
  return result.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, '($1)')
}

const linkify = (escaped: string) =>
  escaped.replace(/(https?:\/\/[^\s<>&"]+)/g, url =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;word-break:break-all;">${url}</a>`
  )

const textToHtmlParagraphs = (text: string) =>
  text
    .split('\n')
    .map(line => line.trim()
      ? `<p style="margin:0 0 12px;">${linkify(escHtml(line))}</p>`
      : '<br />'
    )
    .join('')

const waPreviewHtml = computed(() => {
  const text = substituteVars(props.body)
  if (!text) return '(pesan kosong)'
  return linkify(escHtml(text)).replace(/\n/g, '<br />')
})

const renderedSubject = computed(() => substituteVars(props.subject))
const previewTime    = computed(() =>
  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const recipientError = computed(() => {
  const r = testRecipient.value.trim()
  if (!r) return ''
  if (props.template.channel === 'email') {
    return EMAIL_RE.test(r) ? '' : 'Format email tidak valid'
  }
  // WhatsApp: accept local (08xx), country-prefixed (628xx), or E.164 (+628xx)
  const cleaned = r.replace(/[\s\-().]/g, '')
  return /^[+]?[0-9]{8,15}$/.test(cleaned) ? '' : 'Format nomor tidak valid (contoh: 628123456789 atau 08xxx)'
})

const previewFooterHtml = `
  <div style="margin-top:24px;height:1px;background:#e5e7eb;"></div>
  <div style="padding-top:20px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="width:30%;vertical-align:middle;text-align:left;">
          <img src="${logoUrl}" alt="IOM ITB" style="max-width:110px;height:auto;display:block;" />
        </td>
        <td style="width:40%;vertical-align:middle;text-align:center;">
          <p style="margin:0;font-size:14px;color:#6b7280;font-weight:500;">Ikatan Orangtua Mahasiswa ITB</p>
        </td>
        <td style="width:30%;vertical-align:middle;text-align:right;white-space:nowrap;">
          <a href="https://www.iom-itb.id/" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-left:10px;">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlechrome.svg" alt="Website" width="20" height="20" style="vertical-align:middle;" />
          </a>
          <a href="https://www.instagram.com/iom_itb/" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-left:10px;">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg" alt="Instagram" width="20" height="20" style="vertical-align:middle;" />
          </a>
          <a href="https://www.youtube.com/@IOM-ITB" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-left:10px;">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg" alt="YouTube" width="20" height="20" style="vertical-align:middle;" />
          </a>
        </td>
      </tr>
    </table>
  </div>`

const fullEmailIframeHtml = computed(() => {
  const bodyHtml = textToHtmlParagraphs(substituteVars(props.body))
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>body { margin: 20px; background: #f9fafb; }</style>
</head>
<body>
  <div style="font-family: Arial, sans-serif; font-size: 14px; max-width: 600px; margin: 0 auto; color: #222;">
    <div style="background: #2563eb; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0; text-align: center;">
      <img src="${logoWhiteUrl}" alt="IOM ITB" style="max-width: 180px; height: auto; margin-bottom: 16px;" />
      <h1 style="margin: 0; font-size: 20px;">${escHtml(props.template.title)}</h1>
      <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">IOM ITB</p>
    </div>
    <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; background: #fff;">
      ${bodyHtml}
      <p style="margin: 24px 0 8px; font-size: 12px; color: #9ca3af; text-align: center;">
        Email ini dikirim otomatis, mohon tidak membalas email ini.
      </p>
      ${previewFooterHtml}
    </div>
  </div>
</body>
</html>`
})

const sendTest = async () => {
  if (!testRecipient.value.trim()) return
  isSending.value = true
  testResult.value = null
  try {
    await ApiService.post<any>(`email-templates/${props.template.key}/test-send`, {
      recipient: testRecipient.value.trim(),
      variables: { ...localVars },
    })
    testResult.value = { ok: true, message: 'Berhasil dikirim!' }
  } catch (err: any) {
    testResult.value = { ok: false, message: err?.response?.data?.message || 'Gagal mengirim.' }
  } finally {
    isSending.value = false
  }
}
</script>
