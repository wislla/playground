<script setup lang="ts">
import { X } from 'lucide-vue-next'
defineProps<{ title: string, description?: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-40 grid place-items-center bg-ink/45 p-4 backdrop-blur-[2px]" @mousedown.self="$emit('close')">
      <section class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true">
        <div class="flex items-start justify-between gap-4"><div><h2 class="text-xl font-bold">{{ title }}</h2><p v-if="description" class="mt-1 text-sm text-slate-500">{{ description }}</p></div><button class="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Fechar" @click="$emit('close')"><X :size="20" /></button></div>
        <div class="mt-6"><slot /></div>
      </section>
    </div>
  </Teleport>
</template>
