<template>
  <div class="min-h-screen">
    <section class="relative mb-6 overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>

        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight md:text-4xl">
              Panduan Penggunaan Fitur Admin
            </h1>
            <p class="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100">
              Pusat dokumentasi penggunaan dashboard admin IOM ITB. Pilih menu di sisi kiri
              untuk melihat kolom, filter, form, tombol, status, dan langkah penggunaan fitur.
            </p>
          </div>

          <div class="rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-50">
            <p class="text-xs uppercase tracking-wider text-blue-100">Total Dokumentasi</p>
            <p class="mt-1 text-xl font-bold">{{ filteredDocumentation.length }} Menu</p>
          </div>
        </div>
      </section>

      <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div>
            <label for="search" class="mb-2 block text-sm font-semibold text-slate-700">
              Cari dokumentasi
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchKeyword"
                type="text"
                placeholder="Cari: donasi, status, upload, fakultas, pembayaran..."
                class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#003793] focus:ring-4 focus:ring-[#003793]/10"
              />
            </div>
          </div>

          <div>
            <label for="category" class="mb-2 block text-sm font-semibold text-slate-700">
              Kategori
            </label>
            <select
              id="category"
              v-model="selectedCategory"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#003793] focus:ring-4 focus:ring-[#003793]/10"
            >
              <option value="">Semua kategori</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-[310px_1fr]">
        <aside class="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Daftar Menu
            </h2>

            <button
              v-if="searchKeyword || selectedCategory"
              type="button"
              class="text-xs font-semibold text-[#003793] hover:underline"
              @click="resetFilter"
            >
              Reset
            </button>
          </div>

          <div v-if="filteredDocumentation.length > 0" class="space-y-1.5">
            <button
              v-for="feature in filteredDocumentation"
              :key="feature.id"
              type="button"
              class="w-full rounded-xl border px-4 py-3 text-left transition"
              :class="
                selectedFeatureId === feature.id
                  ? 'border-[#003793] bg-[#003793] text-white shadow-sm'
                  : 'border-transparent bg-white text-slate-700 hover:border-[#003793]/20 hover:bg-[#003793]/5'
              "
              @click="selectFeature(feature.id)"
            >
              <span class="block text-sm font-semibold">
                {{ feature.title }}
              </span>
              <span
                class="mt-1 block text-xs"
                :class="selectedFeatureId === feature.id ? 'text-white/70' : 'text-slate-500'"
              >
                {{ feature.category }}
              </span>
            </button>
          </div>

          <div v-else class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
            <p class="text-sm font-semibold text-slate-700">Tidak ada hasil</p>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              Coba ubah kata kunci atau kategori.
            </p>
          </div>
        </aside>

        <main>
          <article
            v-if="selectedFeature"
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <header class="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
              <div class="mb-4 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-[#003793]/10 px-3 py-1 text-xs font-bold text-[#003793]">
                  {{ selectedFeature.category }}
                </span>

                <router-link
                  v-if="selectedFeature.route"
                  :to="selectedFeature.route"
                  class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 transition hover:border-[#003793]/30 hover:bg-[#003793]/5 hover:text-[#003793]"
                >
                  Buka fitur
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5H19.5M19.5 4.5V10.5M19.5 4.5L10.5 13.5" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5V18.75A.75.75 0 0 1 18.75 19.5H5.25A.75.75 0 0 1 4.5 18.75V5.25A.75.75 0 0 1 5.25 4.5H10.5" />
                  </svg>
                </router-link>
              </div>

              <h2 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {{ selectedFeature.title }}
              </h2>

              <p class="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                {{ selectedFeature.summary }}
              </p>
            </header>

            <div class="space-y-8 px-6 py-6 sm:px-8">
              <GuideSection
                v-if="selectedFeature.tableColumns.length"
                title="Kolom yang Ditampilkan"
                description="Kolom atau informasi utama yang dapat dilihat admin pada halaman ini."
                :items="selectedFeature.tableColumns"
              />

              <GuideSection
                v-if="selectedFeature.filters.length"
                title="Filter dan Pencarian"
                description="Kontrol yang digunakan untuk menyaring atau mencari data."
                :items="selectedFeature.filters"
              />

              <GuideSection
                v-if="selectedFeature.formFields.length"
                title="Field Form"
                description="Field yang perlu diisi saat membuat atau mengubah data."
                :items="selectedFeature.formFields"
              />

              <GuideSection
                title="Tombol dan Aksi"
                description="Tombol yang tersedia serta fungsi masing-masing tombol."
                :items="selectedFeature.buttons"
              />

              <GuideSection
                v-if="selectedFeature.statusValues.length"
                title="Nilai Status / Opsi"
                description="Nilai pilihan atau status yang digunakan pada fitur ini."
                :items="selectedFeature.statusValues"
              />

              <section>
                <div class="mb-4 flex items-center gap-3">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003793]/10 text-[#003793]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75H21M8.25 12H21M8.25 17.25H21M3.75 6.75H3.758V6.758H3.75V6.75ZM3.75 12H3.758V12.008H3.75V12ZM3.75 17.25H3.758V17.258H3.75V17.25Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900">Cara Menggunakan</h3>
                    <p class="text-sm text-slate-500">Urutan penggunaan fitur dari awal sampai selesai.</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="(step, index) in selectedFeature.steps"
                    :key="`${selectedFeature.id}-${index}`"
                    class="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div class="flex gap-4">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#003793] text-sm font-bold text-white">
                        {{ index + 1 }}
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-900">{{ step.title }}</h4>
                        <p class="mt-1 text-sm leading-7 text-slate-600">
                          {{ step.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </article>

          <div
            v-else
            class="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"
          >
            <h2 class="text-xl font-bold text-slate-900">Dokumentasi tidak ditemukan</h2>
            <p class="mt-2 text-sm text-slate-600">
              Ubah kata kunci pencarian atau pilih kategori lain.
            </p>
          </div>
        </main>
      </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, watch } from "vue";

interface GuideStep {
  title: string;
  description: string;
}

interface GuideItem {
  title: string;
  description: string;
}

interface AdminDocumentation {
  id: string;
  title: string;
  category: string;
  route?: string;
  summary: string;
  tableColumns: GuideItem[];
  filters: GuideItem[];
  formFields: GuideItem[];
  buttons: GuideItem[];
  statusValues: GuideItem[];
  steps: GuideStep[];
}

const GuideSection = defineComponent({
  name: "GuideSection",
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    items: { type: Array as () => GuideItem[], required: true },
  },
  setup(props) {
    return () =>
      h("section", {}, [
        h("div", { class: "mb-4 flex items-center gap-3" }, [
          h("div", { class: "flex h-9 w-9 items-center justify-center rounded-xl bg-[#003793]/10 text-[#003793]" }, [
            h("span", { class: "text-base font-black" }, "•"),
          ]),
          h("div", {}, [
            h("h3", { class: "text-lg font-bold text-slate-900" }, props.title),
            h("p", { class: "text-sm text-slate-500" }, props.description),
          ]),
        ]),
        h(
          "div",
          { class: "grid gap-3 md:grid-cols-2" },
          props.items.map((item) =>
            h("div", { class: "rounded-xl border border-slate-200 bg-slate-50 p-4" }, [
              h("p", { class: "text-sm font-bold text-slate-900" }, item.title),
              h("p", { class: "mt-1 text-sm leading-6 text-slate-600" }, item.description),
            ])
          )
        ),
      ]);
  },
});

const adminDocumentation: AdminDocumentation[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    category: "Dashboard",
    route: "/dashboard",
    summary:
      "Dashboard adalah halaman utama untuk memantau ringkasan layanan IOM ITB, status pengajuan bantuan, progres donasi, pesanan merchandise, dan aktivitas terbaru.",
    tableColumns: [
      { title: "Kartu Pengajuan Perlu Proses", description: "Menampilkan total pengajuan yang belum selesai, dengan breakdown Bantuan IOM, Bantuan Kesehatan atau Bankes, dan Orang Tua Asuh atau OTA." },
      { title: "Kartu Bantuan Disetujui Bulan Ini", description: "Menampilkan jumlah bantuan yang disetujui pada bulan berjalan, dengan breakdown IOM, Bankes, dan OTA." },
      { title: "Kartu Pesanan Merchandise Baru", description: "Menampilkan jumlah pesanan merchandise baru yang perlu diperiksa." },
      { title: "Kartu Donasi Terkumpul", description: "Menampilkan total donasi, dengan breakdown Donasi IOM dan Orang Tua Asuh." },
      { title: "Kartu Total Anggota", description: "Menampilkan total anggota yang tercatat pada sistem." },
      { title: "Tabel Pengajuan Terbaru", description: "Menampilkan Nama Pemohon, NIM, dan Status pengajuan." },
      { title: "Tabel Aktivitas Admin", description: "Menampilkan Admin, Waktu, dan Perubahan Status." },
    ],
    filters: [],
    formFields: [],
    buttons: [
      { title: "Refresh Data", description: "Memuat ulang statistik, grafik, data terbaru, dan aktivitas admin dari backend." },
      { title: "Dropdown pada kartu Pengajuan Perlu Proses", description: "Membuka rincian jumlah pengajuan untuk Bantuan IOM, Bankes, dan OTA." },
      { title: "Dropdown pada kartu Bantuan Disetujui", description: "Membuka rincian jumlah bantuan disetujui untuk IOM, Bankes, dan OTA." },
    ],
    statusValues: [
      { title: "Status Tidak Diketahui", description: "Status awal ketika pengajuan belum memiliki status proses yang jelas." },
      { title: "Verifikasi Berkas", description: "Pengajuan sedang diperiksa kelengkapan berkasnya." },
      { title: "Wawancara", description: "Pemohon masuk tahap wawancara." },
      { title: "Menunggu", description: "Pengajuan sedang menunggu tindak lanjut." },
      { title: "Diproses", description: "Pengajuan sedang diproses admin." },
      { title: "Disetujui", description: "Pengajuan bantuan disetujui." },
      { title: "Ditolak", description: "Pengajuan bantuan ditolak." },
    ],
    steps: [
      { title: "Buka Dashboard", description: "Klik menu Dashboard pada sidebar." },
      { title: "Periksa kartu ringkasan", description: "Lihat jumlah pengajuan perlu proses, bantuan disetujui bulan ini, pesanan merchandise baru, donasi terkumpul, dan total anggota." },
      { title: "Buka breakdown kartu", description: "Klik kartu yang memiliki ikon panah untuk melihat rincian IOM, Bankes, atau OTA." },
      { title: "Periksa tabel terbaru", description: "Gunakan tabel pengajuan terbaru dan aktivitas admin untuk menentukan data yang perlu ditindaklanjuti." },
      { title: "Klik Refresh Data", description: "Gunakan tombol Refresh Data setelah ada perubahan data di menu lain." },
    ],
  },
  {
    id: "dashboard-pembayaran",
    title: "Dashboard Pembayaran",
    category: "Keuangan",
    route: "/dashboard-pembayaran",
    summary:
      "Dashboard Pembayaran digunakan untuk memantau pembayaran iuran sukarela dan kontribusi sukarela berdasarkan periode, jenis pembayaran, status pembayaran, metode pembayaran, fakultas, dan tren harian.",
    tableColumns: [
      { title: "Tanggal", description: "Tanggal pembayaran, diambil dari paidAt, date, atau createdAt." },
      { title: "Nama", description: "Nama pembayar atau donatur." },
      { title: "Jenis", description: "Jenis pembayaran, seperti iuran_sukarela atau kontribusi_sukarela." },
      { title: "Fakultas", description: "Nama fakultas yang terkait dengan pembayaran." },
      { title: "Nominal", description: "Nominal pembayaran dalam format rupiah." },
      { title: "Metode", description: "Metode pembayaran: manual atau midtrans." },
      { title: "Status", description: "Status pembayaran: pending, settlement, expired, failed, atau refunded." },
    ],
    filters: [
      { title: "Mulai", description: "Tanggal awal periode pembayaran." },
      { title: "Sampai", description: "Tanggal akhir periode pembayaran." },
      { title: "Jenis", description: "Pilihan: Semua, Iuran Sukarela, atau Kontribusi Sukarela." },
      { title: "Status", description: "Pilihan: Semua, Pending, Settlement, Expired, Failed, atau Refunded." },
    ],
    formFields: [],
    buttons: [
      { title: "Terapkan", description: "Menerapkan filter tanggal, jenis pembayaran, dan status pembayaran." },
    ],
    statusValues: [
      { title: "pending", description: "Pembayaran dibuat tetapi belum lunas." },
      { title: "settlement", description: "Pembayaran berhasil atau lunas." },
      { title: "expired", description: "Pembayaran melewati batas waktu." },
      { title: "failed", description: "Pembayaran gagal." },
      { title: "refunded", description: "Pembayaran dikembalikan." },
      { title: "manual", description: "Pembayaran dicatat manual oleh admin." },
      { title: "midtrans", description: "Pembayaran diproses melalui Midtrans." },
    ],
    steps: [
      { title: "Buka Dashboard Pembayaran", description: "Klik menu Dashboard Pembayaran pada sidebar." },
      { title: "Atur periode", description: "Isi tanggal Mulai dan Sampai untuk menentukan periode laporan." },
      { title: "Pilih jenis pembayaran", description: "Pilih Semua, Iuran Sukarela, atau Kontribusi Sukarela." },
      { title: "Pilih status pembayaran", description: "Pilih Pending, Settlement, Expired, Failed, Refunded, atau Semua." },
      { title: "Klik Terapkan", description: "Sistem akan memuat ulang ringkasan KPI, status pembayaran, jenis pembayaran, metode pembayaran, tren harian, dan tabel pembayaran terbaru." },
    ],
  },
  {
    id: "kegiatan",
    title: "Kegiatan",
    category: "Konten",
    route: "/kegiatan",
    summary:
      "Menu Kegiatan digunakan untuk mengelola publikasi kegiatan IOM ITB. Halaman ini menampilkan daftar kegiatan, filter status, pencarian, tombol buat kegiatan, editor, preview, publish, tarik ke draft, dan hapus.",
    tableColumns: [
      { title: "Judul", description: "Judul kegiatan yang ditampilkan pada kartu kegiatan." },
      { title: "Deskripsi", description: "Ringkasan konten kegiatan." },
      { title: "Status", description: "Draft atau Published." },
      { title: "Tanggal Status", description: "Jika Published menampilkan tanggal publikasi; jika Draft menampilkan tanggal pembaruan." },
      { title: "Gambar", description: "Thumbnail kegiatan." },
    ],
    filters: [
      { title: "Filter Semua", description: "Menampilkan kegiatan Draft dan Published." },
      { title: "Filter Draft", description: "Menampilkan kegiatan yang masih berstatus draft." },
      { title: "Filter Published", description: "Menampilkan kegiatan yang sudah dipublikasikan." },
      { title: "Pencarian", description: "Mencari kegiatan berdasarkan judul atau konten." },
    ],
    formFields: [
      { title: "Judul Kegiatan", description: "Diisi pada halaman editor sebagai judul utama kegiatan." },
      { title: "Deskripsi/Konten", description: "Diisi melalui rich text editor pada halaman editor." },
      { title: "Media", description: "Berisi gambar upload, URL gambar, atau URL YouTube." },
      { title: "Caption Media", description: "Keterangan untuk media yang sedang dipilih." },
      { title: "Thumbnail", description: "Dipilih dari media gambar dengan tombol Set as thumbnail." },
    ],
    buttons: [
      { title: "Buat Kegiatan", description: "Membuka editor kegiatan baru dengan parameter id new." },
      { title: "Edit", description: "Membuka editor kegiatan berdasarkan id kegiatan." },
      { title: "Publish", description: "Mengubah status kegiatan dari draft menjadi published." },
      { title: "Tarik ke Draft", description: "Mengubah status kegiatan dari published kembali ke draft." },
      { title: "Preview", description: "Membuka halaman preview kegiatan." },
      { title: "Hapus", description: "Menghapus kegiatan setelah konfirmasi." },
      { title: "Sebelumnya / Berikutnya", description: "Berpindah halaman daftar kegiatan." },
    ],
    statusValues: [
      { title: "draft", description: "Kegiatan belum dipublikasikan dan masih dapat diedit." },
      { title: "published", description: "Kegiatan sudah dipublikasikan." },
    ],
    steps: [
      { title: "Buka menu Kegiatan", description: "Klik menu Kegiatan pada sidebar." },
      { title: "Cari atau filter kegiatan", description: "Gunakan filter Semua, Draft, Published, atau kolom pencarian." },
      { title: "Buat kegiatan baru", description: "Klik Buat Kegiatan untuk membuka editor kegiatan baru." },
      { title: "Edit kegiatan lama", description: "Klik Edit pada kartu kegiatan yang ingin diubah." },
      { title: "Publish atau tarik ke draft", description: "Gunakan Publish untuk mempublikasikan; gunakan Tarik ke Draft untuk menyembunyikan kembali dari status published." },
      { title: "Hapus kegiatan", description: "Klik Hapus, lalu konfirmasi penghapusan." },
    ],
  },
  {
    id: "editor-kegiatan",
    title: "Editor Kegiatan",
    category: "Konten",
    route: "/kegiatan/new/edit",
    summary:
      "Editor Kegiatan digunakan untuk membuat dan menyunting konten kegiatan secara lengkap, termasuk judul, konten rich text, media gambar, URL gambar, YouTube, caption, urutan media, thumbnail, draft, preview, dan publish.",
    tableColumns: [],
    filters: [],
    formFields: [
      { title: "Judul kegiatan", description: "Input utama dengan placeholder Judul kegiatan." },
      { title: "Deskripsi/konten kegiatan", description: "Rich text editor untuk menulis isi kegiatan dalam format HTML." },
      { title: "Tipe Media", description: "Pilihan upload, url, atau youtube." },
      { title: "Upload gambar", description: "Input file image dengan multiple upload." },
      { title: "URL Gambar", description: "Input URL gambar dengan placeholder https://." },
      { title: "URL YouTube", description: "Input URL YouTube dengan placeholder https://youtube.com/watch?v=." },
      { title: "Caption", description: "Input keterangan untuk media yang sedang aktif." },
      { title: "Thumbnail", description: "Gambar utama kegiatan yang wajib ada sebelum publish." },
    ],
    buttons: [
      { title: "Kembali", description: "Kembali dari editor ke halaman sebelumnya." },
      { title: "Simpan Draft", description: "Menyimpan kegiatan sebagai draft." },
      { title: "Tarik ke Draft", description: "Mengubah kegiatan published menjadi draft." },
      { title: "Preview", description: "Membuka tampilan preview kegiatan." },
      { title: "Publish", description: "Mempublikasikan kegiatan. Judul dan thumbnail wajib diisi." },
      { title: "Panah kiri / kanan media", description: "Berpindah ke media sebelumnya atau berikutnya." },
      { title: "Set as thumbnail", description: "Menjadikan gambar yang sedang dipilih sebagai thumbnail." },
      { title: "Pindah kiri / kanan", description: "Mengubah urutan media." },
      { title: "Hapus media", description: "Menghapus media yang sedang dipilih." },
      { title: "Tambah Media", description: "Menambahkan URL gambar atau URL YouTube ke daftar media." },
    ],
    statusValues: [
      { title: "upload", description: "Menambahkan media dari file gambar lokal." },
      { title: "url", description: "Menambahkan media dari URL gambar." },
      { title: "youtube", description: "Menambahkan media dari URL YouTube." },
      { title: "draft", description: "Konten belum dipublikasikan." },
      { title: "published", description: "Konten sudah dipublikasikan." },
    ],
    steps: [
      { title: "Isi judul", description: "Tulis judul kegiatan pada input Judul kegiatan." },
      { title: "Tulis konten", description: "Tulis isi kegiatan pada rich text editor." },
      { title: "Tambahkan media", description: "Pilih tipe media upload, url, atau youtube, lalu masukkan file atau URL sesuai pilihan." },
      { title: "Atur caption dan urutan media", description: "Pilih media, isi Caption, lalu gunakan tombol pindah kiri atau kanan untuk mengatur urutan." },
      { title: "Pilih thumbnail", description: "Pilih media gambar dan klik Set as thumbnail." },
      { title: "Simpan atau publish", description: "Klik Simpan Draft untuk menyimpan sementara, Preview untuk melihat tampilan, atau Publish untuk mempublikasikan." },
    ],
  },
  {
    id: "merchandise",
    title: "Merchandise",
    category: "Produk",
    route: "/merchandise",
    summary:
      "Menu Merchandise digunakan untuk mengelola produk merchandise, termasuk gambar, nama produk, harga, stok, deskripsi, link, tanggal diperbarui, edit, dan hapus.",
    tableColumns: [
      { title: "Gambar", description: "Gambar produk merchandise." },
      { title: "Produk", description: "Nama produk merchandise." },
      { title: "Harga", description: "Harga produk." },
      { title: "Stok", description: "Jumlah stok produk." },
      { title: "Deskripsi", description: "Deskripsi produk." },
      { title: "Link", description: "Link eksternal produk." },
      { title: "Diperbarui", description: "Tanggal data terakhir diperbarui." },
      { title: "Aksi", description: "Berisi tombol Edit dan Hapus." },
    ],
    filters: [
      { title: "Pencarian", description: "Input dengan placeholder Cari merchandise." },
      { title: "Pagination", description: "Tombol Sebelumnya dan Berikutnya untuk berpindah halaman." },
    ],
    formFields: [
      { title: "name", description: "Nama produk merchandise. Wajib diisi." },
      { title: "stock", description: "Jumlah stok produk. Wajib diisi." },
      { title: "price", description: "Harga produk. Wajib diisi." },
      { title: "description", description: "Deskripsi produk. Wajib diisi." },
      { title: "image", description: "Gambar produk." },
      { title: "link", description: "Link produk atau halaman pembelian." },
    ],
    buttons: [
      { title: "Tambah Merchandise", description: "Membuka modal form untuk membuat produk baru." },
      { title: "Edit", description: "Membuka modal form dengan data produk yang dipilih." },
      { title: "Hapus", description: "Menghapus produk setelah konfirmasi." },
      { title: "Cancel", description: "Menutup modal tanpa menyimpan perubahan." },
      { title: "Submit", description: "Menyimpan data baru atau perubahan data merchandise." },
      { title: "Sebelumnya / Berikutnya", description: "Berpindah halaman data." },
    ],
    statusValues: [],
    steps: [
      { title: "Buka menu Merchandise", description: "Klik menu Merchandise pada sidebar." },
      { title: "Cari produk", description: "Gunakan input Cari merchandise untuk memfilter daftar produk." },
      { title: "Tambah produk", description: "Klik Tambah Merchandise, isi name, stock, price, description, image, dan link." },
      { title: "Simpan produk", description: "Klik Submit untuk menyimpan produk." },
      { title: "Edit produk", description: "Klik Edit pada baris produk, ubah field yang diperlukan, lalu klik Submit." },
      { title: "Hapus produk", description: "Klik Hapus pada baris produk, lalu konfirmasi penghapusan." },
    ],
  },
  {
    id: "transaksi-merchandise",
    title: "Transaksi Merchandise",
    category: "Produk",
    route: "/transactions",
    summary:
      "Menu Transaksi Merchandise digunakan untuk memantau pesanan merchandise dan mengubah status pesanan/pengiriman.",
    tableColumns: [
      { title: "Code", description: "Kode transaksi." },
      { title: "Username", description: "Nama pembeli." },
      { title: "Email", description: "Email pembeli." },
      { title: "No Telp", description: "Nomor telepon pembeli." },
      { title: "Address", description: "Alamat pembeli." },
      { title: "Merchandise", description: "Produk merchandise yang dibeli." },
      { title: "Qty", description: "Jumlah barang yang dipesan." },
      { title: "Status", description: "Status pesanan/pengiriman." },
      { title: "Payment", description: "Bukti atau informasi pembayaran." },
      { title: "Update at", description: "Tanggal data terakhir diperbarui." },
    ],
    filters: [
      { title: "Pencarian", description: "Pencarian transaksi pada halaman transaksi." },
      { title: "Pagination", description: "Tombol Sebelumnya dan Berikutnya untuk berpindah halaman." },
    ],
    formFields: [
      { title: "Status Pesanan / Pengiriman", description: "Select status untuk mengubah status transaksi." },
    ],
    buttons: [
      { title: "Edit", description: "Membuka modal update status transaksi." },
      { title: "Hapus", description: "Menghapus transaksi setelah konfirmasi." },
      { title: "Cancel", description: "Menutup modal tanpa menyimpan perubahan." },
      { title: "Submit", description: "Menyimpan status transaksi." },
      { title: "Sebelumnya / Berikutnya", description: "Berpindah halaman transaksi." },
    ],
    statusValues: [
      { title: "waiting", description: "Pesanan menunggu diproses." },
      { title: "on process", description: "Pesanan sedang diproses." },
      { title: "on delivery", description: "Pesanan sedang dikirim. Perubahan ke status ini mengirim notifikasi Email dan WhatsApp." },
      { title: "arrived", description: "Pesanan sudah tiba. Perubahan ke status ini mengirim notifikasi Email dan WhatsApp." },
      { title: "done", description: "Pesanan selesai. Perubahan ke status ini mengirim notifikasi Email dan WhatsApp." },
      { title: "canceled", description: "Pesanan dibatalkan." },
      { title: "denied", description: "Pesanan ditolak." },
    ],
    steps: [
      { title: "Buka menu Transaksi Merchandise", description: "Klik menu Transaksi Merchandise pada sidebar." },
      { title: "Periksa data transaksi", description: "Baca code, username, email, no telp, address, merchandise, qty, status, dan payment." },
      { title: "Ubah status pesanan", description: "Klik Edit, pilih status pada field Status Pesanan / Pengiriman, lalu klik Submit." },
      { title: "Pahami efek notifikasi", description: "Status on delivery, arrived, dan done akan otomatis mengirim notifikasi ke pembeli via Email dan WhatsApp." },
      { title: "Hapus transaksi", description: "Klik Hapus jika transaksi perlu dihapus, lalu konfirmasi." },
    ],
  },
  {
    id: "donasi",
    title: "Donasi",
    category: "Keuangan",
    route: "/donasi",
    summary:
      "Menu Donasi digunakan untuk melihat, memfilter, menambah, mengubah, dan memeriksa bukti donasi manual. Data pembayaran mendukung metode manual dan Midtrans.",
    tableColumns: [
      { title: "No", description: "Nomor urut data pada halaman aktif." },
      { title: "Tanggal", description: "Tanggal uang masuk atau tanggal data dibuat." },
      { title: "Donatur", description: "Nama donatur, email, dan nomor WhatsApp." },
      { title: "Jenis", description: "Jenis donasi." },
      { title: "Fakultas", description: "Fakultas yang terkait dengan donasi." },
      { title: "Kode", description: "Kode unik fakultas." },
      { title: "Nominal", description: "Nominal donasi dalam format rupiah." },
      { title: "Metode", description: "Manual atau Midtrans." },
      { title: "Status", description: "Status pembayaran." },
      { title: "Bukti Manual", description: "Tombol Lihat untuk membuka bukti bayar manual. Midtrans divalidasi dari status transaksi." },
    ],
    filters: [
      { title: "Per halaman", description: "Pilihan 5, 10, 20, atau 50 data per halaman." },
      { title: "Metode", description: "Pilihan Semua, Manual, atau Midtrans." },
      { title: "Status", description: "Pilihan Semua, Pending, Settlement, Expired, Failed, atau Refunded." },
      { title: "Jenis Donasi", description: "Pilihan Semua, Iuran Sukarela, Kontribusi Anggota, Kontribusi Donatur, Pembelian Merchandise, atau Kontribusi Sukarela." },
      { title: "Cari Nama", description: "Input dengan placeholder Ketik nama." },
    ],
    formFields: [
      { title: "Nama", description: "Nama donatur. Wajib diisi." },
      { title: "Email", description: "Email donatur." },
      { title: "No WA", description: "Nomor WhatsApp donatur." },
      { title: "Jenis Donasi", description: "Pilihan: iuran_sukarela, kontribusi_anggota, kontribusi_donatur, pembelian_merchandise, kontribusi_sukarela." },
      { title: "Fakultas", description: "Pilihan fakultas. Jika dipilih, nominal akhir ditambah kode unik fakultas." },
      { title: "Uang yang didonasi", description: "Nominal donasi. Wajib diisi." },
      { title: "Tanggal uang masuk", description: "Tanggal donasi masuk. Wajib diisi." },
      { title: "Bank", description: "Nama bank pembayaran." },
      { title: "Notifikasi melalui?", description: "Checkbox whatsapp dan email. Wajib dipilih." },
      { title: "Sembunyikan nama?", description: "Checkbox untuk menyembunyikan nama donatur." },
      { title: "Hamba Allah?", description: "Checkbox untuk menandai donatur sebagai Hamba Allah." },
      { title: "Bukti Transfer Manual", description: "Upload gambar bukti bayar manual jika ada. Tidak dipakai untuk Midtrans." },
    ],
    buttons: [
      { title: "Tambah Donasi", description: "Membuka form donasi manual." },
      { title: "Lihat", description: "Membuka bukti bayar manual pada kolom Bukti Manual." },
      { title: "Batal", description: "Menutup form donasi." },
      { title: "Simpan", description: "Menyimpan data donasi baru atau perubahan data donasi." },
      { title: "Sebelumnya / Berikutnya", description: "Berpindah halaman data donasi." },
    ],
    statusValues: [
      { title: "iuran_sukarela", description: "Jenis pembayaran iuran sukarela." },
      { title: "kontribusi_anggota", description: "Jenis kontribusi dari anggota." },
      { title: "kontribusi_donatur", description: "Jenis kontribusi dari donatur." },
      { title: "pembelian_merchandise", description: "Jenis pembayaran pembelian merchandise." },
      { title: "kontribusi_sukarela", description: "Jenis kontribusi sukarela." },
      { title: "pending", description: "Pembayaran belum lunas." },
      { title: "settlement", description: "Pembayaran berhasil/lunas." },
      { title: "expired", description: "Pembayaran kedaluwarsa." },
      { title: "failed", description: "Pembayaran gagal." },
      { title: "refunded", description: "Pembayaran dikembalikan." },
      { title: "manual", description: "Pembayaran dicatat manual." },
      { title: "midtrans", description: "Pembayaran melalui Midtrans." },
    ],
    steps: [
      { title: "Buka menu Donasi", description: "Klik menu Donasi pada sidebar." },
      { title: "Filter data", description: "Atur Per halaman, Metode, Status, Jenis Donasi, atau Cari Nama." },
      { title: "Tambah donasi manual", description: "Klik Tambah Donasi, isi semua field yang diperlukan, lalu klik Simpan." },
      { title: "Periksa bukti bayar manual", description: "Klik Lihat pada kolom Bukti Manual untuk donasi manual. Donasi Midtrans mengikuti status transaksi." },
      { title: "Pindah halaman", description: "Gunakan tombol Sebelumnya atau Berikutnya." },
    ],
  },
  {
    id: "fakultas",
    title: "Fakultas",
    category: "Master Data",
    route: "/fakultas",
    summary:
      "Menu Fakultas digunakan untuk mengelola master data fakultas dan kode unik 3 digit yang dipakai pada pembayaran donasi/iuran manual.",
    tableColumns: [
      { title: "Nama", description: "Nama fakultas." },
      { title: "Kode Unik", description: "Kode unik 3 digit." },
      { title: "Status", description: "Aktif atau Nonaktif." },
      { title: "Aksi", description: "Tombol Edit dan Hapus." },
    ],
    filters: [],
    formFields: [
      { title: "Nama Fakultas", description: "Nama fakultas, contoh FTI. Wajib diisi." },
      { title: "Kode Unik (3 digit)", description: "Kode unik maksimal 3 digit, contoh 001. Wajib diisi." },
      { title: "Aktif", description: "Checkbox untuk menentukan fakultas aktif atau nonaktif." },
    ],
    buttons: [
      { title: "+ Tambah Fakultas", description: "Membuka form tambah fakultas." },
      { title: "Edit", description: "Membuka form edit fakultas." },
      { title: "Hapus", description: "Menghapus fakultas setelah konfirmasi." },
      { title: "Batal", description: "Menutup form tanpa menyimpan." },
      { title: "Simpan", description: "Menyimpan data fakultas." },
    ],
    statusValues: [
      { title: "Aktif", description: "Fakultas dapat digunakan pada fitur pembayaran/donasi." },
      { title: "Nonaktif", description: "Fakultas tidak aktif." },
    ],
    steps: [
      { title: "Buka menu Fakultas", description: "Klik menu Fakultas pada sidebar." },
      { title: "Tambah fakultas", description: "Klik + Tambah Fakultas, isi Nama Fakultas, Kode Unik 3 digit, dan status Aktif." },
      { title: "Simpan data", description: "Klik Simpan untuk menyimpan data." },
      { title: "Edit data", description: "Klik Edit pada baris fakultas yang ingin diubah." },
      { title: "Hapus data", description: "Klik Hapus pada baris fakultas yang ingin dihapus." },
    ],
  },
  {
    id: "pengajuan-bantuan",
    title: "Pengajuan Bantuan",
    category: "Bantuan",
    route: "/pengajuan-bantuan",
    summary:
      "Menu Pengajuan Bantuan digunakan untuk meninjau submission bantuan dari Tally, membuka detail jawaban, mengubah status pengajuan, menambahkan catatan, dan melihat riwayat perubahan status.",
    tableColumns: [
      { title: "Tanggal Submit", description: "Tanggal submission masuk." },
      { title: "Kolom dari answersByLabel", description: "Kolom utama diambil dari label pertanyaan form Tally yang dikirim backend melalui payload answersByLabel." },
      { title: "Status", description: "Status proses pengajuan." },
      { title: "Last Update", description: "Tanggal perubahan terakhir." },
      { title: "Aksi", description: "Tombol Detail." },
    ],
    filters: [
      { title: "Pencarian", description: "Mencari data berdasarkan nilai di answersByLabel, misalnya nama atau NIM jika label tersebut ada pada form Tally." },
      { title: "Pagination", description: "Tombol Sebelumnya dan Berikutnya untuk berpindah halaman." },
    ],
    formFields: [
      { title: "Status", description: "Select status pengajuan pada modal detail." },
      { title: "Catatan", description: "Textarea dengan placeholder Tambahkan catatan (opsional)." },
      { title: "Label Pertanyaan dan Jawaban", description: "Modal detail menampilkan seluruh pasangan label dan jawaban dari answersByLabel." },
    ],
    buttons: [
      { title: "Detail", description: "Membuka modal Detail Pengajuan." },
      { title: "Simpan Perubahan", description: "Menyimpan perubahan status dan catatan." },
      { title: "Ya, Simpan", description: "Konfirmasi untuk menyimpan perubahan status." },
      { title: "Batal", description: "Membatalkan konfirmasi simpan." },
      { title: "Tutup", description: "Menutup modal detail." },
      { title: "Ya, Tutup", description: "Konfirmasi menutup modal ketika ada perubahan yang belum disimpan." },
      { title: "Tetap di sini", description: "Membatalkan penutupan modal dan tetap di modal detail." },
    ],
    statusValues: [
      { title: "TIDAK_DIKETAHUI", description: "Ditampilkan sebagai Status Tidak Diketahui." },
      { title: "VERIFIKASI_BERKAS", description: "Ditampilkan sebagai Verifikasi Berkas." },
      { title: "DIPANGGIL_WAWANCARA", description: "Ditampilkan sebagai Dipanggil Wawancara." },
      { title: "KEPUTUSAN_DITERIMA", description: "Ditampilkan sebagai Keputusan Diterima." },
      { title: "KEPUTUSAN_DITOLAK", description: "Ditampilkan sebagai Keputusan Ditolak." },
    ],
    steps: [
      { title: "Buka menu Pengajuan Bantuan", description: "Klik menu Pengajuan Bantuan pada sidebar." },
      { title: "Cari data pengajuan", description: "Gunakan kolom pencarian untuk menemukan submission berdasarkan nilai jawaban form Tally." },
      { title: "Buka detail", description: "Klik Detail untuk melihat seluruh label pertanyaan dan jawaban dari answersByLabel." },
      { title: "Ubah status", description: "Pilih salah satu status: Status Tidak Diketahui, Verifikasi Berkas, Dipanggil Wawancara, Keputusan Diterima, atau Keputusan Ditolak." },
      { title: "Isi catatan", description: "Isi Catatan jika perlu menjelaskan keputusan atau proses admin." },
      { title: "Simpan perubahan", description: "Klik Simpan Perubahan, lalu konfirmasi dengan Ya, Simpan." },
      { title: "Periksa riwayat", description: "Baca riwayat perubahan status pada modal detail untuk melihat waktu, keterangan, dan aktor perubahan." },
    ],
  },
  {
    id: "pendataan-anggota",
    title: "Pendataan Anggota",
    category: "Data Anggota",
    route: "/pendataan-anggota",
    summary:
      "Menu Pendataan Anggota digunakan untuk membaca submission pendaftaran anggota dari Tally. Halaman ini bersifat read-only pada frontend: admin dapat mencari, melihat tabel, dan berpindah halaman.",
    tableColumns: [
      { title: "No", description: "Nomor urut data pada halaman aktif." },
      { title: "Tanggal Submit", description: "Tanggal submission masuk." },
      { title: "Kolom dari answersByLabel", description: "Kolom dinamis dari label pertanyaan form Tally untuk pendataan anggota." },
    ],
    filters: [
      { title: "Pencarian", description: "Mencari nilai jawaban dari form Tally." },
      { title: "Pagination", description: "Tombol Sebelumnya dan Berikutnya untuk berpindah halaman." },
    ],
    formFields: [],
    buttons: [
      { title: "Sebelumnya", description: "Berpindah ke halaman sebelumnya." },
      { title: "Berikutnya", description: "Berpindah ke halaman berikutnya." },
    ],
    statusValues: [],
    steps: [
      { title: "Buka menu Pendataan Anggota", description: "Klik menu Pendataan Anggota pada sidebar." },
      { title: "Cari submission", description: "Gunakan kolom pencarian untuk menemukan data berdasarkan jawaban form." },
      { title: "Baca data tabel", description: "Periksa Tanggal Submit dan kolom jawaban yang ditampilkan dari answersByLabel." },
      { title: "Pindah halaman", description: "Gunakan tombol Sebelumnya atau Berikutnya." },
    ],
  },
  {
    id: "orangtua-asuh",
    title: "Orangtua Asuh",
    category: "Bantuan",
    route: "/orangtua-asuh",
    summary:
      "Menu Orangtua Asuh digunakan untuk membaca submission program Orang Tua Asuh dari Tally. Halaman ini bersifat read-only pada frontend: admin dapat mencari, melihat tabel, dan berpindah halaman.",
    tableColumns: [
      { title: "No", description: "Nomor urut data pada halaman aktif." },
      { title: "Tanggal Submit", description: "Tanggal submission masuk." },
      { title: "Kolom dari answersByLabel", description: "Kolom dinamis dari label pertanyaan form Tally untuk program Orang Tua Asuh." },
    ],
    filters: [
      { title: "Pencarian", description: "Mencari nilai jawaban dari form Tally." },
      { title: "Pagination", description: "Tombol Sebelumnya dan Berikutnya untuk berpindah halaman." },
    ],
    formFields: [],
    buttons: [
      { title: "Sebelumnya", description: "Berpindah ke halaman sebelumnya." },
      { title: "Berikutnya", description: "Berpindah ke halaman berikutnya." },
    ],
    statusValues: [],
    steps: [
      { title: "Buka menu Orangtua Asuh", description: "Klik menu Orangtua Asuh pada sidebar." },
      { title: "Cari submission", description: "Gunakan kolom pencarian untuk menemukan data berdasarkan jawaban form." },
      { title: "Baca data tabel", description: "Periksa Tanggal Submit dan kolom jawaban yang ditampilkan dari answersByLabel." },
      { title: "Pindah halaman", description: "Gunakan tombol Sebelumnya atau Berikutnya." },
    ],
  },
  {
    id: "dana-bantuan",
    title: "Dana Bantuan",
    category: "Bantuan",
    route: "/dana-bantuan",
    summary:
      "Menu Dana Bantuan digunakan untuk mengelola catatan bantuan berdasarkan nama, NIM, program studi, jenis bantuan, bulan, tahun, dan jumlah donasi.",
    tableColumns: [
      { title: "Nama", description: "Nama penerima bantuan." },
      { title: "NIM", description: "NIM penerima bantuan." },
      { title: "Program Studi", description: "Program studi penerima bantuan." },
      { title: "Jenis Bantuan", description: "Jenis bantuan yang diberikan." },
      { title: "Bulan", description: "Bulan bantuan." },
      { title: "Tahun", description: "Tahun bantuan." },
      { title: "Jumlah Donasi", description: "Nominal bantuan." },
      { title: "Aksi", description: "Tombol Edit dan Hapus." },
    ],
    filters: [
      { title: "Pagination", description: "Tombol Sebelumnya dan Berikutnya untuk berpindah halaman." },
    ],
    formFields: [
      { title: "Nama", description: "Nama penerima bantuan. Wajib diisi." },
      { title: "NIM", description: "NIM penerima bantuan. Wajib diisi." },
      { title: "Program Studi", description: "Program studi penerima. Wajib diisi." },
      { title: "Jenis Bantuan", description: "Pilihan: Biaya UKT, Biaya Hidup, Biaya Tugas Akhir, Biaya Kesehatan (Bagi yang membutuhkan dan bersifat darurat), Bantuan Orang Tua Asuh, Bantuan Lainnya." },
      { title: "Bulan", description: "Pilihan: Januari, Febuari, Maret, April, Mei, Juni, Juli, Agustus, September, Oktober, November, Desember." },
      { title: "Tahun", description: "Tahun bantuan. Wajib diisi." },
      { title: "Jumlah Donasi", description: "Nominal bantuan. Wajib diisi." },
    ],
    buttons: [
      { title: "Tambah", description: "Membuka form tambah dana bantuan." },
      { title: "Edit", description: "Membuka form edit dana bantuan." },
      { title: "Hapus", description: "Menghapus data dana bantuan setelah konfirmasi." },
      { title: "Cancel", description: "Menutup modal tanpa menyimpan." },
      { title: "Submit", description: "Menyimpan data dana bantuan." },
      { title: "Sebelumnya / Berikutnya", description: "Berpindah halaman data." },
    ],
    statusValues: [
      { title: "Biaya UKT", description: "Jenis bantuan untuk UKT." },
      { title: "Biaya Hidup", description: "Jenis bantuan untuk biaya hidup." },
      { title: "Biaya Tugas Akhir", description: "Jenis bantuan untuk tugas akhir." },
      { title: "Biaya Kesehatan (Bagi yang membutuhkan dan bersifat darurat)", description: "Jenis bantuan kesehatan darurat." },
      { title: "Bantuan Orang Tua Asuh", description: "Jenis bantuan program OTA." },
      { title: "Bantuan Lainnya", description: "Jenis bantuan di luar opsi utama." },
    ],
    steps: [
      { title: "Buka menu Dana Bantuan", description: "Klik menu Dana Bantuan pada sidebar." },
      { title: "Tambah data", description: "Klik Tambah, isi Nama, NIM, Program Studi, Jenis Bantuan, Bulan, Tahun, dan Jumlah Donasi." },
      { title: "Simpan data", description: "Klik Submit untuk menyimpan data." },
      { title: "Edit data", description: "Klik Edit pada baris data yang ingin diperbarui." },
      { title: "Hapus data", description: "Klik Hapus dan konfirmasi penghapusan." },
    ],
  },
  {
    id: "kemitraan",
    title: "Kemitraan",
    category: "Kemitraan",
    route: "/kemitraan",
    summary:
      "Menu Kemitraan digunakan untuk mengelola data mitra IOM ITB, termasuk nama mitra, PIC, nomor telepon PIC, deskripsi, logo, dan dokumen MoU PDF.",
    tableColumns: [
      { title: "Logo", description: "Logo mitra." },
      { title: "Nama Mitra", description: "Nama organisasi/perusahaan mitra." },
      { title: "Nama PIC", description: "Nama penanggung jawab mitra." },
      { title: "Nomor Telepon PIC", description: "Nomor telepon PIC." },
      { title: "Deskripsi", description: "Deskripsi singkat mitra." },
      { title: "MoU", description: "Dokumen MoU dalam format PDF." },
      { title: "Aksi", description: "Tombol Edit dan Hapus." },
    ],
    filters: [
      { title: "Pencarian", description: "Mencari data kemitraan pada halaman kemitraan." },
    ],
    formFields: [
      { title: "Nama Mitra", description: "Input nama mitra dengan placeholder mis. PT Example." },
      { title: "Nama PIC", description: "Input nama PIC dengan placeholder mis. Budi Santoso." },
      { title: "Nomor Telepon PIC", description: "Input nomor telepon dengan placeholder mis. 08123456789." },
      { title: "Deskripsi", description: "Textarea dengan placeholder Deskripsi singkat tentang mitra." },
      { title: "Logo", description: "Upload logo mitra." },
      { title: "MoU (PDF)", description: "Upload dokumen MoU dalam format PDF." },
    ],
    buttons: [
      { title: "Tambah Kemitraan", description: "Membuka modal tambah kemitraan." },
      { title: "Edit", description: "Membuka modal edit kemitraan." },
      { title: "Hapus", description: "Menghapus data kemitraan setelah konfirmasi." },
      { title: "Batal", description: "Menutup modal tanpa menyimpan." },
      { title: "Simpan", description: "Menyimpan data kemitraan." },
      { title: "Tombol X", description: "Menutup modal form." },
    ],
    statusValues: [],
    steps: [
      { title: "Buka menu Kemitraan", description: "Klik menu Kemitraan pada sidebar." },
      { title: "Tambah mitra", description: "Klik Tambah Kemitraan, isi Nama Mitra, Nama PIC, Nomor Telepon PIC, Deskripsi, Logo, dan MoU PDF." },
      { title: "Simpan data", description: "Klik Simpan untuk menyimpan data mitra." },
      { title: "Edit data", description: "Klik Edit pada baris mitra yang ingin diperbarui." },
      { title: "Hapus data", description: "Klik Hapus dan konfirmasi penghapusan." },
    ],
  },
  {
    id: "kegiatan-kemitraan",
    title: "Kegiatan Kemitraan",
    category: "Kemitraan",
    route: "/kegiatan-kemitraan",
    summary:
      "Menu Kegiatan Kemitraan digunakan untuk menghubungkan kegiatan dengan mitra, lokasi, periode, status, dan gambar publikasi.",
    tableColumns: [
      { title: "Mitra", description: "Nama mitra yang terhubung dengan kegiatan." },
      { title: "Nama Kegiatan", description: "Nama kegiatan kemitraan." },
      { title: "Deskripsi", description: "Deskripsi kegiatan." },
      { title: "Lokasi", description: "Lokasi kegiatan." },
      { title: "Status", description: "planned, ongoing, completed, atau cancelled." },
      { title: "Tanggal Mulai", description: "Tanggal mulai kegiatan." },
      { title: "Tanggal Selesai", description: "Tanggal selesai kegiatan." },
      { title: "Gambar", description: "Gambar kegiatan." },
      { title: "Aksi", description: "Tombol Edit dan Hapus." },
    ],
    filters: [
      { title: "Pencarian", description: "Mencari kegiatan kemitraan pada halaman kegiatan kemitraan." },
    ],
    formFields: [
      { title: "Mitra", description: "Select mitra dari data Kemitraan." },
      { title: "Nama Kegiatan", description: "Nama kegiatan. Wajib diisi." },
      { title: "Deskripsi", description: "Deskripsi kegiatan." },
      { title: "Lokasi", description: "Lokasi kegiatan." },
      { title: "Status", description: "Pilihan: planned, ongoing, completed, cancelled." },
      { title: "Tanggal Mulai", description: "Tanggal mulai kegiatan." },
      { title: "Tanggal Selesai", description: "Tanggal selesai kegiatan." },
      { title: "Gambar", description: "Upload gambar kegiatan." },
    ],
    buttons: [
      { title: "Tambah Kegiatan Kemitraan", description: "Membuka modal tambah kegiatan kemitraan." },
      { title: "Edit", description: "Membuka modal edit kegiatan kemitraan." },
      { title: "Hapus", description: "Menghapus kegiatan kemitraan setelah konfirmasi." },
      { title: "Batal", description: "Menutup modal tanpa menyimpan." },
      { title: "Simpan", description: "Menyimpan data kegiatan kemitraan." },
      { title: "Tombol X", description: "Menutup modal form." },
    ],
    statusValues: [
      { title: "planned", description: "Kegiatan direncanakan." },
      { title: "ongoing", description: "Kegiatan sedang berjalan." },
      { title: "completed", description: "Kegiatan selesai." },
      { title: "cancelled", description: "Kegiatan dibatalkan." },
    ],
    steps: [
      { title: "Buka menu Kegiatan Kemitraan", description: "Klik menu Kegiatan Kemitraan pada sidebar." },
      { title: "Tambah kegiatan", description: "Klik Tambah Kegiatan Kemitraan, pilih Mitra, isi Nama Kegiatan, Deskripsi, Lokasi, Status, Tanggal Mulai, Tanggal Selesai, dan Gambar." },
      { title: "Simpan data", description: "Klik Simpan untuk menyimpan kegiatan." },
      { title: "Edit data", description: "Klik Edit pada baris kegiatan yang ingin diperbarui." },
      { title: "Hapus data", description: "Klik Hapus dan konfirmasi penghapusan." },
    ],
  },
];

const searchKeyword = ref("");
const selectedCategory = ref("");
const selectedFeatureId = ref(adminDocumentation[0]?.id || "");

const categories = computed(() => {
  return Array.from(new Set(adminDocumentation.map((item) => item.category))).sort();
});

const filteredDocumentation = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  return adminDocumentation.filter((item) => {
    const matchCategory = selectedCategory.value
      ? item.category === selectedCategory.value
      : true;

    const searchableText = [
      item.title,
      item.category,
      item.summary,
      ...item.tableColumns.map((item) => `${item.title} ${item.description}`),
      ...item.filters.map((item) => `${item.title} ${item.description}`),
      ...item.formFields.map((item) => `${item.title} ${item.description}`),
      ...item.buttons.map((item) => `${item.title} ${item.description}`),
      ...item.statusValues.map((item) => `${item.title} ${item.description}`),
      ...item.steps.map((step) => `${step.title} ${step.description}`),
    ]
      .join(" ")
      .toLowerCase();

    const matchKeyword = keyword ? searchableText.includes(keyword) : true;

    return matchCategory && matchKeyword;
  });
});

const selectedFeature = computed(() => {
  return filteredDocumentation.value.find((item) => item.id === selectedFeatureId.value);
});

watch(filteredDocumentation, (items) => {
  if (!items.length) {
    selectedFeatureId.value = "";
    return;
  }

  const stillExists = items.some((item) => item.id === selectedFeatureId.value);

  if (!stillExists) {
    selectedFeatureId.value = items[0].id;
  }
});

const selectFeature = (featureId: string) => {
  selectedFeatureId.value = featureId;
};

const resetFilter = () => {
  searchKeyword.value = "";
  selectedCategory.value = "";
  selectedFeatureId.value = adminDocumentation[0]?.id || "";
};
</script>
