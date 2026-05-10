<template>
  <div>
    <!-- Modal Form Setting -->
    <FormBroadcastSetting
      v-if="modalOpen"
      :title="editingId ? 'Edit Broadcast Setting' : 'Tambah Broadcast Setting'"
      :data="editingData"
      :id="editingId"
      @close="handleModalClose"
    />

    <div class="mt-8">
      <h2 class="text-xl font-semibold leading-tight text-gray-700">Broadcast Iuran</h2>

      <!-- Tabs -->
      <div class="flex mt-4 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-2 text-sm font-medium',
            activeTab === tab.key
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >{{ tab.label }}</button>
      </div>

      <!-- Tab: Settings -->
      <div v-if="activeTab === 'settings'" class="mt-4">
        <div class="flex justify-end mb-3">
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
            @click="openAdd"
          >
            + Tambah Setting
          </button>
        </div>

        <div class="overflow-x-auto rounded-lg shadow">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="table-head">Nama</th>
                <th class="table-head">Jenis Iuran</th>
                <th class="table-head">Interval</th>
                <th class="table-head">Hari</th>
                <th class="table-head">Status</th>
                <th class="table-head">Terakhir Dikirim</th>
                <th class="table-head">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingSettings">
                <td colspan="7" class="px-5 py-5 text-sm bg-white">Loading...</td>
              </tr>
              <tr v-else-if="!settings.length">
                <td colspan="7" class="px-5 py-5 text-sm bg-white text-gray-400">Belum ada setting broadcast.</td>
              </tr>
              <tr v-else v-for="s in settings" :key="s.id">
                <td class="table-cell">{{ s.name }}</td>
                <td class="table-cell">{{ s.jenisIuran }}</td>
                <td class="table-cell capitalize">{{ s.scheduleInterval }}</td>
                <td class="table-cell">{{ scheduleDayLabel(s) }}</td>
                <td class="table-cell">
                  <span :class="s.isActive ? 'text-green-600 font-semibold' : 'text-gray-400'">
                    {{ s.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="table-cell">{{ s.lastRunAt ? formatDate(s.lastRunAt) : '-' }}</td>
                <td class="table-cell">
                  <div class="flex gap-2">
                    <button
                      class="px-2 py-1 text-xs text-white bg-yellow-500 rounded hover:bg-yellow-400"
                      @click="openEdit(s)"
                    >Edit</button>
                    <button
                      class="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-500"
                      :disabled="blasting === s.id"
                      @click="runNow(s.id)"
                    >{{ blasting === s.id ? '...' : 'Blast' }}</button>
                    <button
                      class="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-400"
                      @click="deleteSetting(s.id)"
                    >Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Penerima -->
      <div v-if="activeTab === 'recipients'" class="mt-4">
        <div class="overflow-x-auto rounded-lg shadow">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="table-head">Nama</th>
                <th class="table-head">NIM</th>
                <th class="table-head">No. WhatsApp</th>
                <th class="table-head">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingMembers">
                <td colspan="4" class="px-5 py-5 text-sm bg-white">Loading...</td>
              </tr>
              <tr v-else-if="!members.length">
                <td colspan="4" class="px-5 py-5 text-sm bg-white text-gray-400">Tidak ada data anggota.</td>
              </tr>
              <tr v-else v-for="m in members" :key="m.id">
                <td class="table-cell">{{ m.name }}</td>
                <td class="table-cell">{{ m.nim || '-' }}</td>
                <td class="table-cell">{{ m.noWhatsapp }}</td>
                <td class="table-cell">{{ m.email || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Log -->
      <div v-if="activeTab === 'logs'" class="mt-4">
        <div class="flex gap-3 mb-3 items-center">
          <select
            v-model="logFilterId"
            @change="loadLogs"
            class="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white"
          >
            <option value="">Semua Setting</option>
            <option v-for="s in settings" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>

        <div class="overflow-x-auto rounded-lg shadow">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="table-head">Broadcast</th>
                <th class="table-head">Penerima</th>
                <th class="table-head">WA</th>
                <th class="table-head">Email</th>
                <th class="table-head">Status WA</th>
                <th class="table-head">Status Email</th>
                <th class="table-head">Waktu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingLogs">
                <td colspan="7" class="px-5 py-5 text-sm bg-white">Loading...</td>
              </tr>
              <tr v-else-if="!logs.data?.length">
                <td colspan="7" class="px-5 py-5 text-sm bg-white text-gray-400">Belum ada log.</td>
              </tr>
              <tr v-else v-for="l in logs.data" :key="l.id">
                <td class="table-cell">{{ l.broadcastName }}</td>
                <td class="table-cell">{{ l.recipientName || '-' }}</td>
                <td class="table-cell">{{ l.waNumber || '-' }}</td>
                <td class="table-cell">{{ l.email || '-' }}</td>
                <td class="table-cell">
                  <span :class="statusClass(l.waStatus)">{{ l.waStatus }}</span>
                </td>
                <td class="table-cell">
                  <span :class="statusClass(l.emailStatus)">{{ l.emailStatus }}</span>
                </td>
                <td class="table-cell">{{ formatDate(l.sentAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="logs.pagination?.totalPages > 1" class="flex justify-end mt-3 gap-2">
          <button
            class="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            :disabled="logPage <= 1"
            @click="() => { logPage--; loadLogs(); }"
          >Prev</button>
          <span class="text-sm text-gray-600 py-1">{{ logPage }} / {{ logs.pagination?.totalPages }}</span>
          <button
            class="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            :disabled="logPage >= logs.pagination?.totalPages"
            @click="() => { logPage++; loadLogs(); }"
          >Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import {
  GET_BROADCAST_SETTINGS,
  DELETE_BROADCAST_SETTING,
  RUN_BROADCAST,
  GET_BROADCAST_LOGS,
  GET_BROADCAST_MEMBERS,
} from '@/store/broadcast.module';
import FormBroadcastSetting from '@/components/modal/FormBroadcastSetting.vue';

const store = useStore();

const tabs = [
  { key: 'settings', label: 'Pengaturan Broadcast' },
  { key: 'recipients', label: 'Penerima' },
  { key: 'logs', label: 'Log' },
];
const activeTab = ref('settings');

const modalOpen = ref(false);
const editingId = ref<number | undefined>(undefined);
const editingData = ref<any>({});

const loadingSettings = ref(true);
const loadingMembers = ref(false);
const loadingLogs = ref(false);
const blasting = ref<number | null>(null);

const logFilterId = ref('');
const logPage = ref(1);

const settings = computed(() => store.getters.broadcastSettings || []);
const logs = computed(() => store.getters.broadcastLogs || { data: [], pagination: {} });
const members = computed(() => store.getters.broadcastMembers || []);

onMounted(async () => {
  await store.dispatch(GET_BROADCAST_SETTINGS);
  loadingSettings.value = false;
});

watch(activeTab, async (tab) => {
  if (tab === 'recipients' && !members.value.length) {
    loadingMembers.value = true;
    await store.dispatch(GET_BROADCAST_MEMBERS);
    loadingMembers.value = false;
  }
  if (tab === 'logs') {
    await loadLogs();
  }
});

const loadLogs = async () => {
  loadingLogs.value = true;
  await store.dispatch(GET_BROADCAST_LOGS, {
    settingId: logFilterId.value || undefined,
    page: logPage.value,
    limit: 20,
  });
  loadingLogs.value = false;
};

const openAdd = () => {
  editingId.value = undefined;
  editingData.value = {};
  modalOpen.value = true;
};

const openEdit = (s: any) => {
  editingId.value = s.id;
  editingData.value = { ...s };
  modalOpen.value = true;
};

const handleModalClose = async () => {
  modalOpen.value = false;
  editingId.value = undefined;
  editingData.value = {};
  loadingSettings.value = true;
  await store.dispatch(GET_BROADCAST_SETTINGS);
  loadingSettings.value = false;
};

const runNow = async (id: number) => {
  const confirm = await Swal.fire({
    title: 'Blast sekarang?',
    text: 'Notifikasi akan dikirim ke semua penerima dalam setting ini.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, blast!',
    confirmButtonColor: '#4f46e5',
  });
  if (!confirm.isConfirmed) return;

  blasting.value = id;
  try {
    const result: any = await store.dispatch(RUN_BROADCAST, id);
    Swal.fire('Berhasil', `${result?.sent ?? 0} pesan dikirim.`, 'success');
    await store.dispatch(GET_BROADCAST_SETTINGS);
  } catch (err: any) {
    Swal.fire('Error', err?.response?.data?.message || 'Gagal mengirim broadcast.', 'error');
  } finally {
    blasting.value = null;
  }
};

const deleteSetting = async (id: number) => {
  const confirm = await Swal.fire({
    title: 'Hapus setting ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    confirmButtonColor: '#ef4444',
  });
  if (!confirm.isConfirmed) return;
  try {
    await store.dispatch(DELETE_BROADCAST_SETTING, id);
    await store.dispatch(GET_BROADCAST_SETTINGS);
  } catch (err: any) {
    Swal.fire('Error', err?.response?.data?.message || 'Gagal menghapus.', 'error');
  }
};

const scheduleDayLabel = (s: any) => {
  if (s.scheduleInterval === 'weekly') {
    const days = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    return days[s.scheduleDay] || s.scheduleDay;
  }
  return `Tanggal ${s.scheduleDay}`;
};

const formatDate = (d: string) => {
  if (!d) return '-';
  return new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
};

const statusClass = (status: string) => {
  if (status === 'sent') return 'text-green-600 font-semibold';
  if (status === 'failed') return 'text-red-500 font-semibold';
  return 'text-gray-400';
};
</script>

<style scoped>
.table-head {
  @apply px-5 py-3 text-sm font-semibold text-left text-gray-700 bg-gray-100 border-b-2 border-gray-200;
}
.table-cell {
  @apply px-5 py-4 text-sm bg-white border-b border-gray-200 text-gray-900;
}
</style>
