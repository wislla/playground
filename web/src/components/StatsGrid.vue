<script setup lang="ts">
import { Banknote, CircleDollarSign, Timer } from 'lucide-vue-next'
import { formatCurrency } from '../utils/time'
defineProps<{ active: number, pending: number, revenue: number }>()
</script>

<template>
  <section class="grid gap-3 sm:grid-cols-3">
    <article class="card flex items-center gap-4 p-5"><div class="grid size-11 place-items-center rounded-xl bg-mint text-brand"><Timer :size="22" /></div><div><p class="text-sm text-slate-500">Brincando agora</p><p class="text-2xl font-bold">{{ active }}</p></div></article>
    <article class="card flex items-center gap-4 p-5"><div class="grid size-11 place-items-center rounded-xl bg-pink-soft text-pink-deep"><CircleDollarSign :size="22" /></div><div><p class="text-sm text-slate-500">Pagamentos pendentes</p><p class="text-2xl font-bold">{{ pending }}</p></div></article>
    <article class="card flex items-center gap-4 p-5"><div class="grid size-11 place-items-center rounded-xl bg-blue-soft text-brand-dark"><Banknote :size="22" /></div><div><p class="text-sm text-slate-500">Recebido hoje</p><p class="text-2xl font-bold">{{ formatCurrency(revenue) }}</p></div></article>
  </section>
</template>
