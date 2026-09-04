<script setup lang="ts">
import { Clock3, Settings } from 'lucide-vue-next'
defineEmits<{ 'open-settings': [] }>()
</script>

<template>
  <header class="border-b border-blue-soft bg-white/85 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
      <div class="flex items-center gap-3">
        <div class="grid size-10 place-items-center rounded-xl bg-pink-soft text-pink-deep"><Clock3 :size="22" :stroke-width="2.3" /></div>
        <div><h1 class="text-lg font-bold tracking-[-.02em]">Tempo de Brincar</h1><p class="text-xs text-slate-500">Controle de permanência</p></div>
      </div>
      <button class="focus-ring flex items-center gap-2 rounded-xl border border-blue-soft bg-white px-3.5 py-2 text-sm font-semibold hover:bg-blue-soft/60" @click="$emit('open-settings')">
        <Settings :size="17" /><span class="hidden sm:inline">Configurações</span>
      </button>
    </div>
  </header>
</template>
