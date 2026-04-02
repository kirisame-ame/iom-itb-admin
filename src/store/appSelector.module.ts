import { ActionContext } from "vuex";

// ─────────────────────────────────────────────────────────────────────────────
// DUMMY DATA
// Ganti dengan API call ke backend kalau sudah siap.
// Shape yang diharapkan dari backend:
//   GET /api/sso/apps  →  { apps: App[] }
// ─────────────────────────────────────────────────────────────────────────────
export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  url: string;           // URL tujuan setelah user pilih app + role
  color: string;         // warna aksen app
  colorLight: string;    // warna background light
  iconKey: string;       // key untuk icon (lihat AppSelectorView)
  roles: Role[];
}

const DUMMY_APPS: App[] = [
  {
    id: "iom-admin",
    name: "IOM Admin",
    description: "Dashboard administrasi utama",
    url: "/dashboard",   // dalam app yang sama, pakai vue-router push
    color: "#1e40af",
    colorLight: "#eff6ff",
    iconKey: "dashboard",
    roles: [
      { id: "admin", name: "Admin", description: "Akses penuh ke semua fitur" },
      { id: "viewer", name: "Viewer", description: "Hanya bisa melihat data" },
    ],
  },
  {
    id: "iom-public",
    name: "IOM Website",
    description: "Portal publik IOM-ITB",
    url: "http://localhost:3001", // external app, pakai window.location
    color: "#0d7347",
    colorLight: "#f0fff4",
    iconKey: "globe",
    roles: [
      { id: "member", name: "Member", description: "Anggota terdaftar IOM" },
      { id: "guest", name: "Guest", description: "Pengunjung umum" },
    ],
  },
  {
    id: "iom-finance",
    name: "IOM Finance",
    description: "Pengelolaan keuangan & donasi",
    url: "http://localhost:3002",
    color: "#b45309",
    colorLight: "#fffbeb",
    iconKey: "finance",
    roles: [
      { id: "treasurer", name: "Bendahara", description: "Kelola dana & laporan" },
      { id: "auditor", name: "Auditor", description: "Periksa laporan keuangan" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Action & Mutation types
// ─────────────────────────────────────────────────────────────────────────────
export const FETCH_APPS = "fetchApps";
export const SET_SELECTED_APP = "setSelectedApp";
export const SET_SELECTED_ROLE = "setSelectedRole";
export const SET_APPS = "setApps";
export const SET_APPS_LOADING = "setAppsLoading";
export const SET_APPS_ERROR = "setAppsError";

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────
interface AppSelectorState {
  apps: App[];
  selectedApp: App | null;
  selectedRole: Role | null;
  loading: boolean;
  error: string | null;
}

const state: AppSelectorState = {
  apps: [],
  selectedApp: null,
  selectedRole: null,
  loading: false,
  error: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Getters
// ─────────────────────────────────────────────────────────────────────────────
const getters = {
  allApps: (s: AppSelectorState) => s.apps,
  selectedApp: (s: AppSelectorState) => s.selectedApp,
  selectedRole: (s: AppSelectorState) => s.selectedRole,
  appsLoading: (s: AppSelectorState) => s.loading,
  appsError: (s: AppSelectorState) => s.error,
  canEnter: (s: AppSelectorState) => !!s.selectedApp && !!s.selectedRole,
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────
type Ctx = ActionContext<AppSelectorState, any>;

const actions = {
  /**
   * Fetch daftar app yang boleh diakses user.
   * Sekarang pakai DUMMY_APPS.
   *
   * TODO: ganti dengan API call ketika backend siap:
   *   const { data } = await ApiService.get("/api/sso/apps");
   *   context.commit(SET_APPS, data.apps);
   */
  async [FETCH_APPS](context: Ctx) {
    context.commit(SET_APPS_LOADING, true);
    context.commit(SET_APPS_ERROR, null);
    try {
      // ── DUMMY: simulasi network delay ──
      await new Promise((r) => setTimeout(r, 400));
      context.commit(SET_APPS, DUMMY_APPS);

      // ── TODO: uncomment ini dan hapus DUMMY ketika backend siap ──
      // const { data } = await ApiService.get<{ apps: App[] }>("/api/sso/apps");
      // context.commit(SET_APPS, data.apps);
    } catch (err: any) {
      context.commit(SET_APPS_ERROR, err?.message ?? "Gagal memuat daftar aplikasi");
    } finally {
      context.commit(SET_APPS_LOADING, false);
    }
  },

  [SET_SELECTED_APP](context: Ctx, app: App | null) {
    context.commit(SET_SELECTED_APP, app);
    context.commit(SET_SELECTED_ROLE, null); // reset role saat ganti app
  },

  [SET_SELECTED_ROLE](context: Ctx, role: Role | null) {
    context.commit(SET_SELECTED_ROLE, role);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────
const mutations = {
  [SET_APPS](state: AppSelectorState, apps: App[]) {
    state.apps = apps;
  },
  [SET_SELECTED_APP](state: AppSelectorState, app: App | null) {
    state.selectedApp = app;
  },
  [SET_SELECTED_ROLE](state: AppSelectorState, role: Role | null) {
    state.selectedRole = role;
  },
  [SET_APPS_LOADING](state: AppSelectorState, val: boolean) {
    state.loading = val;
  },
  [SET_APPS_ERROR](state: AppSelectorState, msg: string | null) {
    state.error = msg;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};