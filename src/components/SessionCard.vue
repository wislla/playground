<script setup>
import { Check, Clock3, MoreVertical, RotateCcw, Trash2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { formatClock, formatCurrency, formatTimer, getRemainingSeconds } from '../utils/time'
const props = defineProps({ session: Object, now: Number })
defineEmits(['paid', 'remove', 'reset'])
const menuOpen = ref(false)
const remaining = computed(() => getRemainingSeconds(props.session, props.now))
const isFinished = computed(() => props.session.status === 'finished')
</script>

<template>
  <article class="card relative overflow-visible p-5 transition" :class="isFinished ? 'border-red-200 bg-red-50/45' : ''">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0"><div class="flex items-center gap-2"><span class="size-2.5 shrink-0 rounded-full" :class="isFinished ? 'bg-coral' : 'bg-emerald-500'" /><h3 class="truncate text-lg font-bold" :class="isFinished ? 'text-red-700' : ''">{{ session.name }}</h3></div><p class="mt-1 pl-[18px] text-xs text-slate-500">{{ session.units }} tempo{{ session.units > 1 ? 's' : '' }} · até {{ formatClock(session.endsAt) }}</p></div>
      <div class="relative"><button class="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Opções" @click="menuOpen = !menuOpen"><MoreVertical :size="19" /></button><div v-if="menuOpen" class="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-xl"><button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50" @click="$emit('reset', session.id); menuOpen=false"><RotateCcw :size="15" /> Reiniciar</button><button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50" @click="$emit('remove', session.id)"><Trash2 :size="15" /> Remover</button></div></div>
    </div>
    <div class="my-5 text-center"><p class="font-mono text-[2rem] font-bold tracking-tight" :class="isFinished ? 'text-red-600' : 'text-ink'">{{ isFinished ? 'ENCERRADO' : formatTimer(remaining) }}</p><p class="mt-1 text-xs font-medium" :class="isFinished ? 'text-red-500' : 'text-slate-400'">{{ isFinished ? 'O tempo de brincar acabou' : 'tempo restante' }}</p></div>
    <div class="flex items-center justify-between border-t border-slate-100 pt-4"><strong class="text-sm">{{ formatCurrency(session.total) }}</strong><span v-if="session.paid" class="flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-brand"><Check :size="13" /> Pago</span><button v-else class="focus-ring rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-200" @click="$emit('paid', session.id)">Marcar como pago</button></div>
  </article>
</template>
