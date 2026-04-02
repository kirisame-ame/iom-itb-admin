<template>
  <div class="selector-page">
    <!-- Background Labtek -->
    <div class="selector-bg">
      <img src="@/assets/image/bg-itb.webp" alt="" class="selector-bg__img" />
      <div class="selector-bg__overlay" />
    </div>

    <!-- < Kembali -->
    <button class="selector-back" @click="handleBack">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      Kembali
    </button>

    <!-- Card -->
    <div class="selector-card" :class="{ 'selector-card--ready': !loading }">

      <!-- Header -->
      <div class="selector-header">
        <div class="selector-header__left">
          <img src="@/assets/image/logo.webp" alt="IOM ITB" class="selector-logo"
            onerror="this.style.display='none'" />
          <div>
            <p class="selector-org-name">Ikatan Orang Tua Mahasiswa</p>
            <p class="selector-org-sub">Institut Teknologi Bandung</p>
          </div>
        </div>

        <!-- Header actions: Profile + Logout -->
        <div class="selector-header__actions">
          <!-- Profile -->
          <div class="selector-tooltip-wrap">
            <button class="selector-icon-btn" @click="handleProfile" aria-label="Profil">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <span class="selector-tooltip">Profil</span>
          </div>

          <!-- Logout -->
          <div class="selector-tooltip-wrap">
            <button class="selector-icon-btn selector-icon-btn--logout"
              @click="showLogoutConfirm = true" aria-label="Logout">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
            <span class="selector-tooltip">Logout</span>
          </div>
        </div>
      </div>

      <div class="selector-header-divider" />

      <!-- Loading -->
      <div v-if="loading" class="selector-loading">
        <div class="selector-spinner" />
        <p>Memuat daftar aplikasi...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="selector-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ error }}
        <button @click="loadApps">Coba lagi</button>
      </div>

      <!-- Content -->
      <div v-else class="selector-content">

        <!-- Daftar Aplikasi -->
        <div class="selector-section">
          <p class="selector-section__label">Daftar Aplikasi</p>
          <div class="selector-app-grid">
            <button
              v-for="app in apps"
              :key="app.id"
              class="selector-app-tile"
              :class="{ 'selector-app-tile--active': selectedApp?.id === app.id }"
              :style="selectedApp?.id === app.id
                ? { borderColor: app.color, background: app.colorLight }
                : {}"
              @click="selectApp(app)"
            >
              <span v-if="app.id === originAppId" class="selector-origin-badge">Asal</span>

              <div class="selector-app-tile__icon"
                :style="{
                  color: selectedApp?.id === app.id ? app.color : '#94a3b8',
                  background: selectedApp?.id === app.id ? app.colorLight : '#f1f5f9'
                }">
                <component :is="iconMap[app.iconKey]" />
              </div>

              <span class="selector-app-tile__name">{{ app.name }}</span>
            </button>
          </div>
        </div>

        <!-- Daftar Role -->
        <div class="selector-section">
          <p class="selector-section__label">Daftar Role</p>

          <div v-if="!selectedApp" class="selector-role-empty">
            Pilih aplikasi terlebih dahulu
          </div>

          <div v-else class="selector-role-grid">
            <button
              v-for="role in selectedApp.roles"
              :key="role.id"
              class="selector-role-tile"
              :class="{ 'selector-role-tile--active': selectedRole?.id === role.id }"
              :style="selectedRole?.id === role.id
                ? { borderColor: selectedApp.color, background: selectedApp.colorLight, color: selectedApp.color }
                : {}"
              @click="selectRole(role)"
            >
              {{ role.name }}
            </button>
          </div>
        </div>

        <!-- Enter -->
        <div class="selector-footer">
          <button
            class="selector-enter-btn"
            :style="canEnter ? { background: selectedApp!.color } : {}"
            :disabled="!canEnter || isEntering"
            @click="handleEnter"
          >
            <span v-if="isEntering" class="selector-btn-spinner" />
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
      <div v-if="showLogoutConfirm" class="selector-popup-overlay" @click="showLogoutConfirm = false">
        <div class="selector-popup" @click.stop>
          <div class="selector-popup__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <h3 class="selector-popup__title">Konfirmasi Logout</h3>
          <p class="selector-popup__desc">Apakah kamu yakin ingin keluar dari sistem IOM-ITB?</p>
          <div class="selector-popup__actions">
            <button class="selector-popup__cancel" @click="showLogoutConfirm = false">Batal</button>
            <button class="selector-popup__confirm" @click="handleLogout">Ya, Logout</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, h } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  FETCH_APPS,
  SET_SELECTED_APP,
  SET_SELECTED_ROLE,
} from "@/store/appSelector.module";
import type { App, Role } from "@/store/appSelector.module";

const IconDashboard = defineComponent({
  render: () => h("svg", { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round" }, [
    h("rect", { x: 3, y: 3, width: 7, height: 9, rx: 1 }),
    h("rect", { x: 14, y: 3, width: 7, height: 5, rx: 1 }),
    h("rect", { x: 14, y: 12, width: 7, height: 9, rx: 1 }),
    h("rect", { x: 3, y: 16, width: 7, height: 5, rx: 1 }),
  ]),
});

const IconGlobe = defineComponent({
  render: () => h("svg", { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round" }, [
    h("circle", { cx: 12, cy: 12, r: 10 }),
    h("line", { x1: 2, y1: 12, x2: 22, y2: 12 }),
    h("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" }),
  ]),
});

const IconFinance = defineComponent({
  render: () => h("svg", { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round" }, [
    h("line", { x1: 12, y1: 1, x2: 12, y2: 23 }),
    h("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }),
  ]),
});

export default defineComponent({
  name: "AppSelectorView",
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

    // TODO: sesuaikan key query param dengan yang Keycloak kirim
    const originAppId = computed(() => (route.query.from as string) || null);

    const loadApps = async () => {
      await store.dispatch(`appSelector/${FETCH_APPS}`);
      if (originAppId.value) {
        const found = apps.value.find((a: App) => a.id === originAppId.value);
        if (found) store.dispatch(`appSelector/${SET_SELECTED_APP}`, found);
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
      const app = selectedApp.value!;
      // TODO: kirim pilihan role ke backend ketika siap:
      // await ApiService.post("/api/sso/select", { appId: app.id, roleId: selectedRole.value!.id });
      setTimeout(() => {
        if (app.url.startsWith("/")) router.push(app.url);
        else window.location.href = app.url;
      }, 350);
    };

    const handleBack = () => router.back();

    const handleProfile = () => {
      // TODO: arahkan ke halaman profil
      router.push("/profile");
    };

    const handleLogout = () => {
      showLogoutConfirm.value = false;
      // TODO: sesuaikan dengan logout URL Keycloak:
      // window.location.href = "http://localhost:8080/realms/sso-poc/protocol/openid-connect/logout?redirect_uri=...";
      router.push("/");
    };

    return {
      apps, selectedApp, selectedRole,
      loading, error, canEnter,
      isEntering, showLogoutConfirm,
      originAppId, iconMap,
      loadApps, selectApp, selectRole,
      handleEnter, handleBack, handleProfile, handleLogout,
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.selector-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.selector-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.selector-bg__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: blur(2px) brightness(0.7);
  transform: scale(1.05);
}

.selector-bg__overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
}

.selector-back {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 8px;
  padding: 8px 14px;
  color: white;
  font-size: 13.5px;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.selector-back:hover { background: rgba(255,255,255,0.22); }

.selector-card {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 20px;
  width: 680px;
  max-width: 100%;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.15);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.selector-card--ready { opacity: 1; transform: translateY(0); }
.selector-card::-webkit-scrollbar { width: 4px; }
.selector-card::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  gap: 12px;
}

.selector-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selector-logo { height: 44px; width: auto; flex-shrink: 0; }

.selector-org-name { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.selector-org-sub  { font-size: 12px; color: #64748b; margin: 0; }

.selector-header__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.selector-tooltip-wrap { position: relative; }

.selector-icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.selector-icon-btn:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }
.selector-icon-btn--logout:hover { background: #fff5f5; border-color: #fca5a5; color: #dc2626; }

.selector-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  font-size: 11.5px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.selector-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #1e293b;
}

.selector-tooltip-wrap:hover .selector-tooltip { opacity: 1; }

.selector-header-divider { height: 1px; background: #f1f5f9; margin: 0 24px; }

.selector-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 24px;
  color: #94a3b8;
  font-size: 14px;
}

.selector-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e2e8f0;
  border-top-color: #1e40af;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.selector-error {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 24px;
  padding: 12px 16px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 13px;
}

.selector-error button {
  margin-left: auto;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.selector-content {
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.selector-section { display: flex; flex-direction: column; gap: 12px; }

.selector-section__label { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }

/* App grid — 4 kolom */
.selector-app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.selector-app-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 12px 16px;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: border-color 0.15s, background 0.15s, transform 0.12s, box-shadow 0.15s;
  min-height: 110px;
}

.selector-app-tile:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.selector-app-tile--active {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
}

.selector-app-tile__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}

.selector-app-tile__name {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  text-align: center;
  line-height: 1.3;
}

.selector-origin-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: #fef3c7;
  color: #92400e;
  border-radius: 20px;
  padding: 2px 7px;
}

/* Role grid — 2 kolom */
.selector-role-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.selector-role-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 16px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.15s;
  min-height: 60px;
}

.selector-role-tile:hover { border-color: #cbd5e1; background: #f1f5f9; transform: translateY(-1px); }

.selector-role-tile--active {
  font-weight: 700;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.selector-role-empty {
  text-align: center;
  padding: 24px;
  color: #94a3b8;
  font-size: 13.5px;
  font-style: italic;
  background: #f8fafc;
  border-radius: 12px;
  border: 1.5px dashed #e2e8f0;
}

.selector-footer { display: flex; justify-content: flex-end; padding-top: 4px; }

.selector-enter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 28px;
  border-radius: 10px;
  border: none;
  background: #cbd5e1;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: opacity 0.2s, transform 0.12s, background 0.2s;
}

.selector-enter-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }
.selector-enter-btn:disabled { cursor: not-allowed; opacity: 0.5; }

.selector-btn-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

/* Logout popup */
.selector-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.selector-popup {
  background: white;
  border-radius: 18px;
  padding: 32px 28px 24px;
  width: 360px;
  max-width: calc(100vw - 32px);
  text-align: center;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
}

.selector-popup__icon {
  width: 56px;
  height: 56px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.selector-popup__title { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
.selector-popup__desc  { font-size: 13.5px; color: #64748b; margin: 0 0 24px; line-height: 1.5; }

.selector-popup__actions { display: flex; gap: 10px; }

.selector-popup__cancel {
  flex: 1;
  padding: 10px;
  border-radius: 9px;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #475569;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.15s;
}

.selector-popup__cancel:hover { background: #f8fafc; border-color: #cbd5e1; }

.selector-popup__confirm {
  flex: 1;
  padding: 10px;
  border-radius: 9px;
  border: none;
  background: #dc2626;
  color: white;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: opacity 0.15s;
}

.selector-popup__confirm:hover { opacity: 0.88; }

.popup-enter-active { animation: popup-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1); }
.popup-leave-active { animation: popup-out 0.18s ease; }

@keyframes popup-in  { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes popup-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }

@media (max-width: 600px) {
  .selector-app-grid { grid-template-columns: repeat(2, 1fr); }
  .selector-card { border-radius: 16px; }
  .selector-back { top: 16px; left: 16px; }
}
</style>