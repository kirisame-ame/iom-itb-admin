<template>
  <header
    class="
      flex
      items-center
      justify-between
      min-w-0
      gap-3
      px-3
      py-2
      sm:px-4
      lg:px-6
      bg-white
      border-b-4 border-indigo-600
    "
  >
    <div class="flex min-w-0 items-center">
      <button
        @click="isOpen = true"
        class="mr-1 shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-slate-100 focus:outline-none lg:hidden"
        aria-label="Buka menu"
      >
        <svg
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M4 12H20M4 18H11"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="flex min-w-0 items-center gap-1.5 sm:mx-2 lg:mx-0">
        <div class="flex min-w-0 flex-col">
          <h1 class="truncate text-lg font-bold leading-none text-[#003793] sm:text-2xl lg:text-4xl">
            Dashboard Admin
          </h1>
          <p class="text-xs text-gray-600 mt-1.5 hidden sm:block">
            Ikatan Orang Tua Mahasiswa Institut Teknologi Bandung
          </p>
        </div>
      </div>
    </div>

    <div class="flex shrink-0 items-center">
      <div class="hidden items-center sm:flex">
        <div class="relative">
          <button
            type="button"
            @click="toggleNotifications"
            class="relative mx-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-[#003793] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label="Buka notifikasi"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              v-if="notificationBadge"
              class="absolute -right-1 -top-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-white"
            >
              {{ notificationBadge }}
            </span>
          </button>

          <div
            v-show="notificationOpen"
            @click="closeNotifications"
            class="fixed inset-0 z-10 h-full w-full"
          ></div>

          <div
            v-show="notificationOpen"
            class="absolute right-0 z-20 mt-3 w-[28rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
          >
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
              <div>
                <h2 class="text-sm font-bold text-slate-950">Notifikasi Pembayaran</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                  Donasi dan transaksi Merchandise via Midtrans.
                </p>
              </div>
              <button
                type="button"
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#003793] disabled:cursor-wait disabled:opacity-50"
                :disabled="notificationLoading"
                aria-label="Muat ulang notifikasi"
                @click.stop="fetchNotifications"
              >
                <svg
                  class="h-4 w-4"
                  :class="{ 'animate-spin': notificationLoading }"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 11A8 8 0 0 0 5.9 5.9M4 5v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M4 13a8 8 0 0 0 14.1 5.1M20 19v-5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50">
              <router-link
                to="/donasi"
                class="px-4 py-3 transition hover:bg-white"
                @click="closeNotifications"
              >
                <p class="text-[11px] font-semibold text-slate-500">Donasi Lunas</p>
                <p class="mt-1 text-lg font-bold text-slate-950">{{ notificationSummary.donationCount }}</p>
              </router-link>
              <router-link
                to="/transactions"
                class="px-4 py-3 transition hover:bg-white"
                @click="closeNotifications"
              >
                <p class="text-[11px] font-semibold text-slate-500">Merchandise Lunas</p>
                <p class="mt-1 text-lg font-bold text-slate-950">{{ notificationSummary.merchandiseCount }}</p>
              </router-link>
            </div>

            <div v-if="notificationError" class="border-b border-red-100 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
              {{ notificationError }}
            </div>

            <div v-if="notificationLoading && notifications.length === 0" class="space-y-3 px-4 py-4">
              <div v-for="item in 3" :key="item" class="flex gap-3">
                <div class="h-9 w-9 animate-pulse rounded-full bg-slate-100"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3 w-4/5 animate-pulse rounded bg-slate-100"></div>
                  <div class="h-3 w-2/3 animate-pulse rounded bg-slate-100"></div>
                </div>
              </div>
            </div>

            <div v-else-if="notifications.length === 0" class="px-4 py-8 text-center">
              <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <p class="mt-3 text-sm font-semibold text-slate-900">Belum ada pembayaran baru</p>
              <p class="mt-1 text-xs text-slate-500">Pembayaran Midtrans yang lunas akan muncul di sini.</p>
            </div>

            <div v-else class="max-h-[22rem] overflow-y-auto">
              <router-link
                v-for="item in notifications"
                :key="item.id"
                :to="item.route"
                class="group flex gap-3 border-b border-slate-100 px-4 py-3 transition last:border-b-0 hover:bg-blue-50/50"
                @click="closeNotifications"
              >
                <div
                  class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  :class="notificationIconClass(item.tone)"
                >
                  <svg
                    v-if="item.kind === 'donation-paid'"
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 21s-7-4.35-9.2-8.6C1.2 9.3 3.1 6 6.5 6c1.9 0 3.3 1 4.1 2.2C11.4 7 12.8 6 14.7 6c3.4 0 5.3 3.3 3.7 6.4C16.2 16.65 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                    <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex min-w-0 items-center gap-2">
                      <span v-if="isNotificationUnread(item)" class="h-2 w-2 shrink-0 rounded-full bg-red-500"></span>
                      <p class="truncate text-sm font-bold text-slate-950">{{ item.title }}</p>
                    </div>
                    <span class="shrink-0 text-[11px] font-medium text-slate-400">{{ item.relativeTime }}</span>
                  </div>
                  <p class="mt-0.5 truncate text-sm font-medium text-slate-700">{{ item.subject }}</p>
                  <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{{ item.description }}</p>
                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">Midtrans</span>
                    <span v-if="item.amountLabel" class="text-xs font-bold text-slate-900">{{ item.amountLabel }}</span>
                  </div>
                </div>
              </router-link>
            </div>

            <div class="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 bg-white">
              <router-link
                to="/dashboard-pembayaran"
                class="px-4 py-3 text-center text-xs font-bold text-[#003793] transition hover:bg-slate-50"
                @click="closeNotifications"
              >
                Dashboard Pembayaran
              </router-link>
              <router-link
                to="/transactions"
                class="px-4 py-3 text-center text-xs font-bold text-[#003793] transition hover:bg-slate-50"
                @click="closeNotifications"
              >
                Transaksi Merchandise
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div class="relative">
        <div class="flex items-center gap-2">
        <span class="hidden max-w-[220px] truncate text-sm text-slate-600 md:inline">{{ currentUser?.email }}</span>
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="
            relative
            z-10
            block
            w-8
            h-8
            overflow-hidden
            rounded-full
            shadow
            focus:outline-none
          "
        >
          <img
            class="object-cover w-full h-full"
            :src="require('@/assets/image/logo.webp')"
            alt="Your avatar"
          />
        </button>
      </div>

        <div
          v-show="dropdownOpen"
          @click="dropdownOpen = false"
          class="fixed inset-0 z-10 w-full h-full"
        ></div>

        <transition
          enter-active-class="transition duration-150 ease-out transform"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in transform"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-show="dropdownOpen"
            class="
              absolute
              right-0
              z-20
              w-48
              py-1
              mt-2
              bg-white
              rounded-lg
              shadow-xl
            "
          >
            <a
              href="#"
              class="
                px-4
                py-2
                flex
                rounded-md
                text-sm text-gray-700
                hover:bg-indigo-600 hover:text-white
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile</a
            >
            <a
              href="#"
              class="
                flex
                rounded-md
                px-4
                py-2
                text-sm text-gray-700
                hover:bg-indigo-600 hover:text-white
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings</a
            >
            <button
              @click="logout"
              class="
                flex
                px-4
                py-2
                rounded-md
                text-sm text-gray-700
                hover:bg-indigo-600 hover:text-white
                w-full
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out</button
            >
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSidebar } from "../hooks/useSidebar";
import { usePaymentNotifications } from "@/hooks/usePaymentNotifications";
import { useStore } from "vuex";
import { LOGOUT } from "@/store/auth.module";

const store = useStore();
const dropdownOpen = ref(false);
const { isOpen } = useSidebar();
const {
  isOpen: notificationOpen,
  isLoading: notificationLoading,
  errorMessage: notificationError,
  items: notifications,
  summary: notificationSummary,
  badgeLabel: notificationBadge,
  refresh: fetchNotifications,
  toggle: toggleNotifications,
  close: closeNotifications,
  isUnread: isNotificationUnread,
  iconClass: notificationIconClass,
} = usePaymentNotifications();

const currentUser = computed(() => store.getters.currentUser);

const logout = async () => {
  await store.dispatch(LOGOUT);
};
</script>
