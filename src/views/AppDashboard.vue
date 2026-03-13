<template>
  <div>
    <!-- STAT CARD -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

      <div
        v-for="(stat,index) in stats"
        :key="index"
        class="p-4 bg-gray-100 rounded-lg flex items-center justify-between"
      >

        <div>
          <p class="text-sm text-gray-600">
            {{ stat.label }}
          </p>

          <p class="text-2xl font-bold text-gray-900 mt-1">
            {{ stat.value }}
          </p>

          <p
            v-if="stat.description"
            class="text-xs text-green-600 mt-1"
          >
            {{ stat.description }}
          </p>
        </div>

        <component
          :is="stat.icon"
          class="w-8 h-8 text-[#003793]"
        />

      </div>

    </div>

    <!-- CHART -->
    <div class="mt-8 bg-gray-100 rounded-lg shadow p-6">

      <h3 class="text-2xl font-bold text-[#003793] mb-4">
        Tren Donasi 12 bulan terakhir
      </h3>

      <apexchart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="chartSeries"
      />

    </div>

    <!-- DONASI TERBARU -->
    <div class="mt-8 bg-gray-100 rounded-lg shadow overflow-hidden">

      <div class="px-6 py-4 border-b">
        <h3 class="text-2xl font-bold text-[#003793]">
          Donasi Terbaru
        </h3>
      </div>

      <table class="min-w-full text-sm">

        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Donatur</th>
            <th class="px-6 py-3 text-left">Jumlah</th>
            <th class="px-6 py-3 text-left">Tanggal</th>
            <th class="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody class="divide-y">

          <tr
            v-for="donation in recentDonations"
            :key="donation.id"
            class="hover:bg-gray-50"
          >

            <td class="px-6 py-4 font-medium">
              {{ donation.donorName }}
            </td>

            <td class="px-6 py-4 text-green-600 font-bold">
              {{ formatCurrency(donation.amount) }}
            </td>

            <td class="px-6 py-4 text-gray-500">
              {{ formatDate(donation.date) }}
            </td>

            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                {{ donation.status }}
              </span>
            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <!-- CSV Upload (Dev Only) -->
    <div
      class="mt-6 p-4 border border-dashed border-gray-400 rounded-md bg-gray-50 max-w-md"
    >
      <p class="text-sm font-semibold text-gray-600 mb-2">
        Upload Dummy CSV
      </p>

      <input
        type="file"
        accept=".csv"
        class="block w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
        @change="handleCsvUpload"
      />

      <div v-if="csvRows.length" class="mt-3 overflow-x-auto">

        <p class="text-xs text-gray-500 mb-1">
          {{ csvRows.length - 1 }} rows loaded
        </p>

        <table class="text-xs border-collapse w-full">

          <thead>
            <tr>
              <th
                v-for="header in csvRows[0]"
                :key="header"
                class="border border-gray-300 bg-gray-200 px-2 py-1 text-left"
              >
                {{ header }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row,i) in csvRows.slice(1,6)" :key="i">
              <td
                v-for="(cell,j) in row"
                :key="j"
                class="border border-gray-300 px-2 py-1"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>

        </table>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import { ref } from "vue"
import VueApexCharts from "vue3-apexcharts"

import Banner from "../partials/AppBanner.vue"
import Breadcrumb from "../partials/AppBreadcrumb.vue"

import bantuanIcon from "@/assets/svg/ic-card.vue"
import donasiIcon from "@/assets/svg/ic-bag.vue"
import anggotaIcon from "@/assets/svg/ic-user.vue"
import approveIcon from "@/assets/svg/ic-grafic.vue"

interface DashboardStat{
label:string
value:string|number
description?:string
icon:any
}

interface Donation{
id:number
donorName:string
amount:number
date:string
status:string
}

const formatCurrency=(value:number)=>{
return new Intl.NumberFormat("id-ID",{
style:"currency",
currency:"IDR"
}).format(value)
}

const formatDate=(date:string)=>{
return new Date(date).toLocaleDateString("id-ID")
}

const stats=ref<DashboardStat[]>([

{
label:"Pengajuan Bantuan",
value:15,
icon:bantuanIcon
},

{
label:"Pengajuan Disetujui",
value:15,
icon:approveIcon
},

{
label:"Total Donasi Bulan Ini",
value:"Rp 15.000.000",
icon:donasiIcon
},

{
label:"Total Anggota",
value:1500,
description:"+15 anggota baru bulan ini",
icon:anggotaIcon
}

])

const chartSeries=ref([

{
name:"UKT",
data:[45,50,40,30,60,75,45,65,55,70,60,80]
},

{
name:"Biaya Hidup",
data:[35,40,45,35,50,70,60,45,55,65,75,60]
},

{
name:"Tugas Akhir",
data:[20,30,40,50,30,60,40,30,50,60,40,70]
},

{
name:"Anak Asuh",
data:[10,20,30,25,35,0,70,25,35,50,65,40]
},

{
name:"Bantuan Kesehatan",
data:[5,5,10,5,0,0,5,10,0,5,0,15]
}

])

const chartOptions=ref({

chart:{
type:"bar",
toolbar:{show:false}
},

plotOptions:{
bar:{
columnWidth:"45%"
}
},

dataLabels:{
enabled:false
},

colors:[
"#3b82f6",
"#f97316",
"#94a3b8",
"#eab308",
"#60a5fa"
],

xaxis:{
categories:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
title:{text:"BULAN"}
},

legend:{
position:"bottom"
}

})

const recentDonations=ref<Donation[]>([

{
id:1,
donorName:"Hamba Allah",
amount:5000000,
date:"2023-10-25",
status:"Berhasil"
},

{
id:2,
donorName:"Alumni 98",
amount:1500000,
date:"2023-10-24",
status:"Berhasil"
},

{
id:3,
donorName:"Budi Santoso",
amount:250000,
date:"2023-10-24",
status:"Berhasil"
}

])

const csvRows=ref<string[][]>([])

function handleCsvUpload(event:Event){

const file=(event.target as HTMLInputElement).files?.[0]

if(!file)return

const reader=new FileReader()

reader.onload=(e)=>{

const text=e.target?.result as string

csvRows.value=text
.trim()
.split("\n")
.map(line=>line.split(",").map(cell=>cell.trim()))

}

reader.readAsText(file)

}

</script>