<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-6">
    <div class="w-full max-w-md rounded-lg bg-white px-7 py-8 text-center shadow-md">
      <p class="text-sm font-semibold uppercase tracking-wide text-blue-700">Akses terbatas</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Anda tidak memiliki akses</h1>
      <p class="mt-3 text-sm leading-6 text-slate-600">
        Akun Anda belum memiliki role yang diizinkan untuk membuka halaman ini.
      </p>
      <router-link
        to="/dashboard"
        class="mt-6 inline-flex rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Kembali ke Dashboard
      </router-link>
    </div>
  </div>
</template>
