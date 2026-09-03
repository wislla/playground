<script setup>
import { BellRing, Clock3, Plus, X } from 'lucide-vue-next'
import { ref } from 'vue'
import AddChildModal from './components/AddChildModal.vue'
import AppHeader from './components/AppHeader.vue'
import SessionCard from './components/SessionCard.vue'
import SettingsModal from './components/SettingsModal.vue'
import StatsGrid from './components/StatsGrid.vue'
import { usePlayground } from './composables/usePlayground'

const showAdd = ref(false)
const showSettings = ref(false)
const { settings, now, activeSessions, finishedSessions, pendingPayments, totalToday, justFinished, addSession, updateSettings, markPaid, removeSession, resetSession } = usePlayground()
</script>

<template>
  <div class="min-h-screen">
    <AppHeader @open-settings="showSettings = true" />
    <main class="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div class="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p class="mb-1 text-sm font-semibold text-brand">VISÃO GERAL</p><h2 class="text-3xl font-bold tracking-[-.04em]">Olá! Vamos brincar?</h2><p class="mt-2 text-sm text-slate-500">Acompanhe todos os tempos em um só lugar.</p></div><button class="focus-ring flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/15 hover:bg-brand-dark" @click="showAdd = true"><Plus :size="19" /> Adicionar criança</button></div>
      <StatsGrid :active="activeSessions.length" :pending="pendingPayments" :revenue="totalToday" />

      <section class="mt-10"><div class="mb-4 flex items-center gap-2"><Clock3 :size="19" class="text-brand" /><h2 class="text-lg font-bold">Brincando agora</h2><span class="rounded-full bg-mint px-2 py-0.5 text-xs font-bold text-brand">{{ activeSessions.length }}</span></div>
        <div v-if="activeSessions.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><SessionCard v-for="session in activeSessions" :key="session.id" :session="session" :now="now" @paid="markPaid" @remove="removeSession" @reset="resetSession" /></div>
        <div v-else class="card grid place-items-center border-dashed py-14 text-center"><div class="grid size-12 place-items-center rounded-full bg-mint text-brand"><Clock3 :size="23" /></div><h3 class="mt-4 font-bold">Nenhuma criança brincando</h3><p class="mt-1 text-sm text-slate-500">Adicione uma criança para começar a contagem.</p></div>
      </section>

      <section v-if="finishedSessions.length" class="mt-10"><div class="mb-4 flex items-center gap-2"><BellRing :size="19" class="text-coral" /><h2 class="text-lg font-bold">Tempos encerrados</h2><span class="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">{{ finishedSessions.length }}</span></div><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><SessionCard v-for="session in finishedSessions" :key="session.id" :session="session" :now="now" @paid="markPaid" @remove="removeSession" @reset="resetSession" /></div></section>
    </main>

    <Transition name="toast"><div v-if="justFinished" class="fixed right-5 top-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl bg-ink p-4 text-white shadow-2xl"><div class="grid size-9 shrink-0 place-items-center rounded-lg bg-coral"><BellRing :size="18" /></div><div><strong class="text-sm">O tempo acabou!</strong><p class="mt-0.5 text-xs text-white/70">Avise {{ justFinished.name }} que a brincadeira terminou.</p></div><button class="p-1 text-white/60 hover:text-white" aria-label="Fechar aviso" @click="justFinished = null"><X :size="17" /></button></div></Transition>
    <AddChildModal v-if="showAdd" :settings="settings" @close="showAdd = false" @save="addSession" />
    <SettingsModal v-if="showSettings" :settings="settings" @close="showSettings = false" @save="updateSettings" />
  </div>
</template>
