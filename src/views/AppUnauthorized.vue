<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <section class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-wide text-blue-700">Akses dibatasi</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-950">Halaman tidak tersedia untuk role ini</h1>
      <p class="mt-3 text-sm leading-relaxed text-slate-600">
        Pilih role lain yang memiliki akses, atau kembali ke dashboard yang sesuai dengan role aktif.
      </p>
      <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <router-link
          to="/select"
          class="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Pilih Role
        </router-link>
        <router-link
          to="/dashboard"
          class="rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Dashboard
        </router-link>
      </div>
    </section>
  </div>
</template>
