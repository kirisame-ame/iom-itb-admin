<template>
  <div class="flex">
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden"
      @click="isOpen = false"
    ></div>

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-72 max-w-[calc(100vw-2rem)] transform overflow-y-auto bg-[#002b73] text-blue-50 transition duration-300 lg:static lg:inset-0 lg:translate-x-0"
    >
      <div class="border-b border-white/10 px-5 py-4">
        <div class="flex items-center gap-2">
          <div class="flex h-14 shrink-0 items-center justify-start rounded-lg px-0">
            <img
              :src="sidebarLogo"
              alt="IOM ITB"
              class="max-h-12 w-auto object-contain"
              onerror="this.style.display='none'"
            />
          </div>
          <div class="min-w-0">
            <p class="text-[17px] font-semibold leading-tight text-white">IOM ITB</p>
            <p class="mt-0.5 text-sm font-normal leading-snug text-blue-100">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav class="mt-4 pb-7">
        <div v-for="group in navGroups" :key="group.label" class="mt-5 first:mt-0">
          <p class="mb-1.5 px-5 text-[13px] font-semibold tracking-normal text-blue-100">
            {{ group.label }}
          </p>

          <router-link
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="sidebar-link mt-0.5 flex items-center border-l-4 px-5 py-2.5 text-[15px] font-normal duration-200"
            :class="[
              $route.name === item.name
                ? 'sidebar-link--active border-white bg-white/15 font-semibold shadow-inner'
                : 'sidebar-link--inactive border-transparent hover:border-blue-200 hover:bg-white/10'
            ]"
          >
            <svg
              class="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <path
                v-for="path in icons[item.icon]"
                :key="path"
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="path"
              />
            </svg>
            <span class="mx-3 truncate">{{ item.label }}</span>
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from "../hooks/useSidebar";
import sidebarLogo from "@/assets/image/IOM-ITB-PrimaryLogo-white.png";

type IconName =
  | "dashboard"
  | "guide"
  | "calendar"
  | "bag"
  | "card"
  | "heart"
  | "chart"
  | "building"
  | "document"
  | "users"
  | "shield"
  | "wallet"
  | "link"
  | "mail";

interface NavItem {
  name: string;
  label: string;
  to: string;
  icon: IconName;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const { isOpen } = useSidebar();

const icons: Record<IconName, string[]> = {
  dashboard: [
    "M3.75 3.75h6.5v6.5h-6.5v-6.5Z",
    "M13.75 3.75h6.5v6.5h-6.5v-6.5Z",
    "M3.75 13.75h6.5v6.5h-6.5v-6.5Z",
    "M13.75 13.75h6.5v6.5h-6.5v-6.5Z",
  ],
  guide: [
    "M12 6.75v10.5",
    "M12 6.75C10.832 5.91 9.332 5.25 7.5 5.25S4.168 5.91 3 6.75v10.5c1.168-.84 2.668-1.5 4.5-1.5s3.332.66 4.5 1.5",
    "M12 6.75c1.168-.84 2.668-1.5 4.5-1.5s3.332.66 4.5 1.5v10.5c-1.168-.84-2.668-1.5-4.5-1.5s-3.332.66-4.5 1.5",
  ],
  calendar: [
    "M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5",
    "M5.25 5.25h13.5a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5H5.25A1.5 1.5 0 0 1 3.75 18V6.75a1.5 1.5 0 0 1 1.5-1.5Z",
  ],
  bag: [
    "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5",
    "M19.606 8.507 20.869 20.5c.07.665-.45 1.25-1.119 1.25H4.25c-.669 0-1.189-.585-1.119-1.25L4.394 8.507A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z",
  ],
  card: [
    "M2.25 8.25h19.5M2.25 9h19.5",
    "M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z",
    "M6.75 15.75h3",
  ],
  heart: [
    "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.098 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
  ],
  chart: [
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75H3v-6.75Z",
    "M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25h-4.5V8.625Z",
    "M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75h-4.5V4.125Z",
  ],
  building: [
    "M3.75 21h16.5",
    "M4.5 21V5.25A2.25 2.25 0 0 1 6.75 3h10.5a2.25 2.25 0 0 1 2.25 2.25V21",
    "M9 7.5h1.5M9 10.5h1.5M9 13.5h1.5M13.5 7.5H15M13.5 10.5H15M13.5 13.5H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  ],
  document: [
    "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25",
    "M8.25 2.25H6.375A2.625 2.625 0 0 0 3.75 4.875v14.25A2.625 2.625 0 0 0 6.375 21.75h11.25a2.625 2.625 0 0 0 2.625-2.625V12",
    "M8.25 13.5h7.5M8.25 16.5h4.5",
  ],
  users: [
    "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493",
    "M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 12.75 0Z",
    "M12 7.5a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM20.25 8.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
  ],
  shield: [
    "M12 3.75 4.5 6.75v5.625c0 4.238 2.832 8.05 7.5 9.375 4.668-1.325 7.5-5.137 7.5-9.375V6.75L12 3.75Z",
    "M9.75 12.75 11.25 14.25 14.5 10.5",
  ],
  wallet: [
    "M21 12.75V9.75A2.25 2.25 0 0 0 18.75 7.5H4.5A2.25 2.25 0 0 0 2.25 9.75v8.25A2.25 2.25 0 0 0 4.5 20.25h14.25A2.25 2.25 0 0 0 21 18v-2.25",
    "M18.75 9.75V6A2.25 2.25 0 0 0 16.5 3.75H5.25A3 3 0 0 0 2.25 6.75v3",
    "M18.75 12.75h-3a1.5 1.5 0 0 0 0 3h3a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75Z",
  ],
  link: [
    "M13.19 8.688a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757a4.5 4.5 0 0 1-6.364 0",
    "M10.81 15.312a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757a4.5 4.5 0 0 1 6.364 0",
    "M8.25 12h7.5",
  ],
  mail: [
    "M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9",
    "M21.75 7.5 12 13.5 2.25 7.5",
    "M4.5 5.25h15A2.25 2.25 0 0 1 21.75 7.5H2.25A2.25 2.25 0 0 1 4.5 5.25Z",
  ],
};

const navGroups: NavGroup[] = [
  {
    label: "Utama",
    items: [
      { name: "Dashboard", label: "Dashboard", to: "/dashboard", icon: "dashboard" },
      { name: "Panduan Admin", label: "Panduan Admin", to: "/panduan-admin", icon: "guide" },
    ],
  },
  {
    label: "Formulir Masuk",
    items: [
      { name: "Pengajuan Bantuan", label: "Pengajuan Bantuan", to: "/pengajuan-bantuan", icon: "document" },
      { name: "Pendataan Anggota", label: "Pendataan Anggota", to: "/pendataan-anggota", icon: "users" },
      { name: "Orangtua Asuh", label: "Orangtua Asuh", to: "/orangtua-asuh", icon: "shield" },
    ],
  },
  {
    label: "Donasi & Pembayaran",
    items: [
      { name: "Dashboard Pembayaran", label: "Dashboard Pembayaran", to: "/dashboard-pembayaran", icon: "chart" },
      { name: "Donasi", label: "Donasi", to: "/donasi", icon: "heart" },
      { name: "Fakultas", label: "Fakultas", to: "/fakultas", icon: "building" },
      { name: "Dana Bantuan", label: "Dana Bantuan", to: "/dana-bantuan", icon: "wallet" },
      { name: "Template Email", label: "Template Email", to: "/email-templates", icon: "mail"},
    ],
  },
  {
    label: "Konten & Katalog",
    items: [
      { name: "Kegiatan", label: "Kegiatan", to: "/kegiatan", icon: "calendar" },
      { name: "Merchandise", label: "Merchandise", to: "/merchandise", icon: "bag" },
      { name: "Merchandise Dashboard", label: "Dashboard Merchandise", to: "/merchandise-dashboard", icon: "chart" },
      { name: "Transactions", label: "Transaksi Merchandise", to: "/transactions", icon: "card" },
    ],
  },
  {
    label: "Kemitraan",
    items: [
      { name: "Kemitraan", label: "Kemitraan", to: "/kemitraan", icon: "link" },
      { name: "Kegiatan Kemitraan", label: "Kegiatan Kemitraan", to: "/kegiatan-kemitraan", icon: "calendar" },
    ],
  },
];
</script>

<style scoped>
.sidebar-link {
  color: rgba(219, 234, 254, 0.72) !important;
}

.sidebar-link--active,
.sidebar-link--inactive:hover {
  color: #ffffff !important;
}
</style>