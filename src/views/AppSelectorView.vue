<template>
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-inter">

    <!-- Background -->
    <div class="fixed inset-0 z-0 overflow-hidden">
      <img
        src="@/assets/image/bg-itb.webp"
        class="absolute inset-0 w-full h-full object-cover object-center scale-105"
      />

      <!-- Overlay gradient biru -->
      <div class="absolute inset-0 bg-[rgba(208,226,255,0.82)]" />

    </div>

    <!-- Card -->
    <div
      class="selector-card relative z-10 bg-white rounded-2xl w-[680px] max-w-full shadow-2xl flex flex-col overflow-visible"
      :class="{ 'selector-card--ready': !loading }"
      style="max-height: calc(100vh - 80px);"
    >

      <!-- Header -->
      <div class="flex-shrink-0 flex items-center justify-between px-6 py-5 gap-3">
        <div class="flex items-center gap-3">
          <img
            src="@/assets/image/logo.webp"
            alt="IOM ITB"
            class="h-11 w-auto flex-shrink-0"
            onerror="this.style.display='none'"
          />
          <div>
            <p class="text-sm font-bold text-slate-900 mb-0.5">Ikatan Orang Tua Mahasiswa</p>
            <p class="text-xs text-slate-500">Institut Teknologi Bandung</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right max-w-[220px]">
            <p class="text-xs font-semibold text-slate-700 truncate">{{ currentUser?.name || currentUser?.preferredUsername || '-' }}</p>
            <p class="text-[11px] text-slate-500 truncate">{{ currentUser?.email || '-' }}</p>
          </div>

          <div class="relative group flex-shrink-0">
            <button
              class="w-[38px] h-[38px] rounded-[9px] border border-slate-200 bg-slate-50 text-slate-500 flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              aria-label="Logout"
              @click="showLogoutConfirm = true"
            >
              <IconLogout />
            </button>
            <span class="selector-tooltip pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11.5px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              Logout
            </span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex-shrink-0 h-px bg-slate-100 mx-6" />

      <div
        v-if="accessWarning"
        class="mx-6 mt-4 px-4 py-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-[13px]"
      >
        {{ accessWarning }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center gap-3 py-16 text-slate-400 text-sm">
        <div class="selector-spinner w-[30px] h-[30px] rounded-full border-[3px] border-slate-200 border-t-blue-800" />
        <p>Memuat daftar aplikasi...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error"
        class="flex items-center gap-2.5 mx-6 my-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[13px]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ error }}
        <button
          class="ml-auto bg-red-600 text-white border-none rounded-md px-3 py-1 text-xs cursor-pointer"
          @click="loadApps"
        >Coba lagi</button>
      </div>

      <!-- Content -->
      <div v-else class="overflow-y-auto px-6 pt-5 pb-6 flex flex-col gap-6">

        <!-- Daftar Aplikasi -->
        <div class="flex flex-col gap-3">
          <p class="text-[15px] font-bold text-slate-900">Daftar Aplikasi</p>
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="app in apps"
              :key="app.id"
              class="relative flex flex-col items-center justify-center gap-2.5 px-3 pt-5 pb-4 rounded-[14px] border-[1.5px] border-slate-200 bg-slate-50 cursor-pointer transition-all duration-150 min-h-[110px] hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 hover:shadow-md"
              :class="{ '-translate-y-0.5 shadow-md': selectedApp?.id === app.id }"
              :style="selectedApp?.id === app.id
                ? { borderColor: app.color, background: app.colorLight }
                : {}"
              @click="selectApp(app)"
            >
              <span v-if="app.id === originAppId"
                class="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 rounded-full px-1.5 py-0.5">
                Asal
              </span>
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150"
                :style="{
                  color: selectedApp?.id === app.id ? app.color : '#94a3b8',
                  background: selectedApp?.id === app.id ? app.colorLight : '#f1f5f9'
                }"
              >
                <component :is="iconMap[app.iconKey] || iconMap.dashboard" />
              </div>
              <span class="text-[12.5px] font-semibold text-slate-700 text-center leading-tight">
                {{ app.name }}
              </span>
            </button>
          </div>
        </div>

        <!-- Daftar Role -->
        <div class="flex flex-col gap-3">
          <p class="text-[15px] font-bold text-slate-900">Daftar Role</p>

          <div v-if="!selectedApp"
            class="text-center py-6 text-slate-400 text-[13.5px] italic bg-slate-50 rounded-xl border-[1.5px] border-dashed border-slate-200">
            Pilih aplikasi terlebih dahulu
          </div>

          <div v-else class="grid grid-cols-2 gap-3">
            <button
              v-for="role in selectedApp.roles"
              :key="role.id"
              class="flex items-center justify-center px-4 py-[18px] rounded-xl border-[1.5px] border-slate-200 bg-slate-50 cursor-pointer text-sm font-semibold text-slate-600 transition-all duration-150 min-h-[60px] hover:border-slate-300 hover:bg-slate-100 hover:-translate-y-px"
              :class="{ '-translate-y-px shadow-md !font-bold': selectedRole?.id === role.id }"
              :style="selectedRole?.id === role.id
                ? { borderColor: selectedApp.color, background: selectedApp.colorLight, color: selectedApp.color }
                : {}"
              @click="selectRole(role)"
            >
              {{ role.name }}
            </button>
          </div>
        </div>

        <!-- Enter button -->
        <div class="flex justify-end pt-1">
          <button
            class="flex items-center gap-2 px-7 py-[11px] rounded-xl border-none text-white text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            :class="canEnter && !isEntering ? 'hover:opacity-90 hover:-translate-y-px' : ''"
            :style="canEnter ? { background: selectedApp!.color } : { background: '#cbd5e1' }"
            :disabled="!canEnter || isEntering"
            @click="handleEnter"
          >
            <span v-if="isEntering"
              class="selector-btn-spinner inline-block w-[15px] h-[15px] rounded-full border-2 border-white/40 border-t-white" />
            <template v-else>
              Masuk
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </template>
          </button>
        </div>

      </div>
    </div>

    <!-- Logout Confirm Popup -->
    <Transition name="popup">
      <div v-if="showLogoutConfirm"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click="showLogoutConfirm = false">
        <div
          class="bg-white rounded-[18px] px-7 pt-8 pb-6 w-[360px] max-w-[calc(100vw-32px)] text-center shadow-2xl"
          @click.stop>
          <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <IconLogout />
          </div>
          <h3 class="text-[17px] font-bold text-slate-900 mb-2">Konfirmasi Logout</h3>
          <p class="text-[13.5px] text-slate-500 mb-6 leading-relaxed">
            Apakah kamu yakin ingin keluar dari sistem IOM-ITB?
          </p>
          <div class="flex gap-2.5">
            <button
              class="flex-1 py-2.5 rounded-[9px] border border-slate-200 bg-white text-slate-600 text-[13.5px] font-semibold cursor-pointer transition-all duration-150 hover:bg-slate-50 hover:border-slate-300"
              @click="showLogoutConfirm = false">
              Batal
            </button>
            <button
              class="flex-1 py-2.5 rounded-[9px] border-none bg-red-600 text-white text-[13.5px] font-semibold cursor-pointer transition-opacity duration-150 hover:opacity-90"
              @click="handleLogout">
              Ya, Logout
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import ApiService from "@/store/api.service";
import {
  FETCH_APPS,
  SET_SELECTED_APP,
  SET_SELECTED_ROLE,
} from "@/store/appSelector.module";
import type { App, Role } from "@/store/appSelector.module";
import { FETCH_JWT, LOGOUT } from "@/store/auth.module";

import IconDashboard from "@/assets/image/IconDashboard.vue";
import IconGlobe from "@/assets/image/IconGlobe.vue";
import IconFinance from "@/assets/image/IconFinance.vue";
import IconLogout from "@/assets/image/IconLogout.vue";

import "@/assets/css/AppSelector.css";

export default defineComponent({
  name: "AppSelectorView",
  components: { IconLogout },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const isEntering = ref(false);
    const showLogoutConfirm = ref(false);

    const iconMap: Record<string, any> = {
      dashboard: IconDashboard,
      globe: IconGlobe,
      finance: IconFinance,
    };

    const apps = computed(() => store.getters["appSelector/allApps"]);
    const selectedApp = computed(() => store.getters["appSelector/selectedApp"]);
    const selectedRole = computed(() => store.getters["appSelector/selectedRole"]);
    const loading = computed(() => store.getters["appSelector/appsLoading"]);
    const error = computed(() => store.getters["appSelector/appsError"]);
    const canEnter = computed(() => store.getters["appSelector/canEnter"]);
    const currentUser = computed(() => store.getters.currentUser);

    const originAppId = computed(() => (route.query.from as string) || null);
    const accessWarning = computed(() => {
      if (route.query.reason === "no-web-access") {
        return "Akun Anda tidak memiliki akses ke modul web admin. Pilih modul lain yang tersedia.";
      }

      return null;
    });

    const loadApps = async () => {
      await store.dispatch(FETCH_JWT);
      await store.dispatch(`appSelector/${FETCH_APPS}`);

      if (originAppId.value) {
        const found = apps.value.find((a: App) => a.id === originAppId.value);
        if (found) {
          await store.dispatch(`appSelector/${SET_SELECTED_APP}`, found);
          if (found.roles.length === 1) {
            await store.dispatch(`appSelector/${SET_SELECTED_ROLE}`, found.roles[0]);
          }
        }
      }
    };

    onMounted(loadApps);

    const selectApp = (app: App) => {
      store.dispatch(`appSelector/${SET_SELECTED_APP}`, app);
    };

    const selectRole = (role: Role) => {
      store.dispatch(`appSelector/${SET_SELECTED_ROLE}`, role);
    };

    const handleEnter = async () => {
      if (!canEnter.value || isEntering.value) return;
      isEntering.value = true;

      try {
        const app = selectedApp.value!;
        const role = selectedRole.value!;

        const response: any = await ApiService.post("/auth/select", {
          appId: app.id,
          role: role.id,
        });

        const payload = response?.data || response;
        const redirectUrl = payload?.redirectUrl || app.url;

        if (redirectUrl.startsWith("/")) {
          await router.push(redirectUrl);
        } else {
          window.location.href = redirectUrl;
        }
      } finally {
        isEntering.value = false;
      }
    };

    const handleLogout = async () => {
      showLogoutConfirm.value = false;
      await store.dispatch(LOGOUT);
    };

    return {
      apps, selectedApp, selectedRole,
      loading, error, canEnter,
      currentUser, accessWarning,
      isEntering, showLogoutConfirm,
      originAppId, iconMap,
      loadApps, selectApp, selectRole,
      handleEnter, handleLogout,
    };
  },
});
</script>