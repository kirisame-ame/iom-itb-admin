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
          <p class="mb-1.5 px-5 text-[13px] font-semibold text-blue-100">
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
  | "mail"
  | "bookCheck"
  | "fileHeart"
  | "userCheck"
  | "shieldHeart"
  | "paymentChart"
  | "handCoins"
  | "school"
  | "piggyBank"
  | "mailCheck"
  | "calendarCheck"
  | "shirt"
  | "packageChart"
  | "receiptText"
  | "handshake"
  | "calendarHandshake";

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
  bookCheck: [
    "M12 6.75v10.5",
    "M12 6.75C10.832 5.91 9.332 5.25 7.5 5.25S4.168 5.91 3 6.75v10.5c1.168-.84 2.668-1.5 4.5-1.5s3.332.66 4.5 1.5",
    "M12 6.75c1.168-.84 2.668-1.5 4.5-1.5s3.332.66 4.5 1.5v10.5c-1.168-.84-2.668-1.5-4.5-1.5s-3.332.66-4.5 1.5",
    "M15.25 11.75 16.5 13l2.25-2.75",
  ],
  fileHeart: [
    "M14.25 2.75H7A2.25 2.25 0 0 0 4.75 5v14A2.25 2.25 0 0 0 7 21.25h10A2.25 2.25 0 0 0 19.25 19v-9.25",
    "M14.25 2.75v5A2.25 2.25 0 0 0 16.5 10h2.75",
    "M9.25 14.25c0-1.05.86-1.9 1.92-1.9.8 0 1.48.46 1.78 1.13.3-.67.98-1.13 1.78-1.13 1.06 0 1.92.85 1.92 1.9 0 2.75-3.7 4.7-3.7 4.7s-3.7-1.95-3.7-4.7Z",
  ],
  userCheck: [
    "M15 19.25a6.5 6.5 0 0 0-13 0",
    "M8.5 12.25a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M16.25 11.75 18 13.5l3.25-4",
  ],
  shieldHeart: [
    "M12 3.75 4.5 6.75v5.625c0 4.238 2.832 8.05 7.5 9.375 4.668-1.325 7.5-5.137 7.5-9.375V6.75L12 3.75Z",
    "M8.75 12.15c0-1.05.82-1.9 1.85-1.9.62 0 1.16.3 1.4.78.24-.48.78-.78 1.4-.78 1.03 0 1.85.85 1.85 1.9 0 2.25-3.25 3.95-3.25 3.95s-3.25-1.7-3.25-3.95Z",
  ],
  paymentChart: [
    "M4 19.25h16",
    "M6.25 16.25v-4.5",
    "M11.75 16.25v-8.5",
    "M17.25 16.25v-11.5",
    "M4.75 5.75h5.5",
    "M4.75 8.75h3.5",
  ],
  handCoins: [
    "M3.5 14.75h3.25l2.7 2.15a3.25 3.25 0 0 0 2.04.72h3.26c.85 0 1.55-.7 1.55-1.55s-.7-1.55-1.55-1.55h-3.1",
    "M7 14.75l1.75-1.35a3.1 3.1 0 0 1 1.9-.65h2.1a1.55 1.55 0 0 1 1.55 1.55",
    "M17.25 7.5a3.25 3.25 0 1 0-6.5 0 3.25 3.25 0 0 0 6.5 0Z",
    "M14 5.95v3.1M12.75 7.5h2.5",
  ],
  school: [
    "M3.5 21h17",
    "M5.25 21V9.75L12 5.75l6.75 4V21",
    "M8.25 12.5h1.5M14.25 12.5h1.5M8.25 15.5h1.5M14.25 15.5h1.5",
    "M10.25 21v-3.25h3.5V21",
    "M3.5 9.75 12 4.75l8.5 5",
  ],
  piggyBank: [
    "M6.5 12.25H4.75A1.75 1.75 0 0 0 3 14v1.25A1.75 1.75 0 0 0 4.75 17H6l1.25 2.25h2L10 17h5.25l.75 2.25h2L18.75 17A4.75 4.75 0 0 0 21 13c0-2.9-2.65-5.25-6.25-5.25h-5.5A5 5 0 0 0 6.5 12.25Z",
    "M8.5 8.25V6.5c1.45-.7 2.8-.72 4 0",
    "M16.25 11.25h.01",
    "M5.75 12.25V10.5",
  ],
  mailCheck: [
    "M21.25 7.75v8.75A2.25 2.25 0 0 1 19 18.75H5A2.25 2.25 0 0 1 2.75 16.5V7.75",
    "M21.25 7.75 12 13.25 2.75 7.75",
    "M5 5.25h14a2.25 2.25 0 0 1 2.25 2.25H2.75A2.25 2.25 0 0 1 5 5.25Z",
    "M14.75 16.25 16 17.5l2.5-3",
  ],
  calendarCheck: [
    "M6.75 3.25v2.5M17.25 3.25v2.5M4 8.75h16",
    "M5.5 5.75h13A1.5 1.5 0 0 1 20 7.25v11A1.5 1.5 0 0 1 18.5 19.75h-13A1.5 1.5 0 0 1 4 18.25v-11a1.5 1.5 0 0 1 1.5-1.5Z",
    "M8.75 14.25 11 16.5l4.25-5",
  ],
  shirt: [
    "M9 4.75 7 6.25l-3.25 1.5 2 4.75 2.5-1V20h7.5v-8.5l2.5 1 2-4.75-3.25-1.5-2-1.5",
    "M9 4.75c.55 1.1 1.55 1.75 3 1.75s2.45-.65 3-1.75",
  ],
  packageChart: [
    "M4.5 8.5 12 4.5l7.5 4-7.5 4-7.5-4Z",
    "M4.5 8.5v7l7.5 4 7.5-4v-7",
    "M12 12.5v7",
    "M8.25 15.75v-2M12 16.75v-3M15.75 17.5v-4.5",
  ],
  receiptText: [
    "M6.25 3.75h11.5A1.25 1.25 0 0 1 19 5v15.25l-2-1.25-2 1.25-2-1.25-2 1.25-2-1.25-2 1.25V5a1.25 1.25 0 0 1 1.25-1.25Z",
    "M8.75 8.25h6.5M8.75 11.75h6.5M8.75 15.25h3.5",
  ],
  handshake: [
    "M8.5 12.25 10.75 10a2 2 0 0 1 2.83 0l.92.92",
    "M4.75 12.25 8 15.5a2.5 2.5 0 0 0 3.54 0l.71-.71.71.71a2.5 2.5 0 0 0 3.54 0l2.75-2.75",
    "M3.5 9.5 7 6h3.25l1.25 1.25",
    "M20.5 9.5 17 6h-3.25L12.5 7.25",
  ],
  calendarHandshake: [
    "M6.75 3.25v2.5M17.25 3.25v2.5M4 8.75h16",
    "M5.5 5.75h13A1.5 1.5 0 0 1 20 7.25v11A1.5 1.5 0 0 1 18.5 19.75h-13A1.5 1.5 0 0 1 4 18.25v-11a1.5 1.5 0 0 1 1.5-1.5Z",
    "M8.25 14.25 10.25 12.75a1.5 1.5 0 0 1 2 .12l.5.5",
    "M8.25 14.25 10 16a1.75 1.75 0 0 0 2.48 0l.27-.27.27.27a1.75 1.75 0 0 0 2.48 0l1.25-1.25",
  ],
};

const navGroups: NavGroup[] = [
  {
    label: "Utama",
    items: [
      { name: "Dashboard", label: "Dashboard", to: "/dashboard", icon: "dashboard" },
      { name: "Panduan Admin", label: "Panduan Admin", to: "/panduan-admin", icon: "bookCheck" },
    ],
  },
  {
    label: "Formulir Masuk",
    items: [
      { name: "Pengajuan Bantuan", label: "Pengajuan Bantuan", to: "/pengajuan-bantuan", icon: "fileHeart" },
      { name: "Pendataan Anggota", label: "Pendataan Anggota", to: "/pendataan-anggota", icon: "userCheck" },
      { name: "Orangtua Asuh", label: "Orangtua Asuh", to: "/orangtua-asuh", icon: "shieldHeart" },
    ],
  },
  {
    label: "Donasi & Pembayaran",
    items: [
      { name: "Dashboard Pembayaran", label: "Dashboard Pembayaran", to: "/dashboard-pembayaran", icon: "paymentChart" },
      { name: "Donasi", label: "Donasi", to: "/donasi", icon: "handCoins" },
      { name: "Fakultas", label: "Fakultas", to: "/fakultas", icon: "school" },
      { name: "Dana Bantuan", label: "Dana Bantuan", to: "/dana-bantuan", icon: "piggyBank" },
      { name: "Broadcast", label: "Broadcast Pesan", to: "/broadcast", icon: "mail" },
      { name: "Template Email", label: "Template Email", to: "/email-templates", icon: "mailCheck"},
    ],
  },
  {
    label: "Konten & Katalog",
    items: [
      { name: "Kegiatan", label: "Kegiatan", to: "/kegiatan", icon: "calendarCheck" },
      { name: "Merchandise", label: "Merchandise", to: "/merchandise", icon: "shirt" },
      { name: "Merchandise Dashboard", label: "Dashboard Merchandise", to: "/merchandise-dashboard", icon: "packageChart" },
      { name: "Transactions", label: "Transaksi Merchandise", to: "/transactions", icon: "receiptText" },
    ],
  },
  {
    label: "Kemitraan",
    items: [
      { name: "Kemitraan", label: "Kemitraan", to: "/kemitraan", icon: "handshake" },
      { name: "Kegiatan Kemitraan", label: "Kegiatan Kemitraan", to: "/kegiatan-kemitraan", icon: "calendarHandshake" },
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
