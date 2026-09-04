<script setup lang="ts">
import { reactive } from 'vue'
import BaseModal from './BaseModal.vue'
import type { PlaygroundSettings } from '../types/playground'

const props = defineProps<{ settings: PlaygroundSettings }>()
const emit = defineEmits<{
  close: []
  save: [settings: PlaygroundSettings]
}>()
const form = reactive<PlaygroundSettings>({ ...props.settings })
function submit() { emit('save', { minutesPerUnit: Number(form.minutesPerUnit), pricePerUnit: Number(form.pricePerUnit) }); emit('close') }
</script>

<template>
  <BaseModal title="Configurações" description="Defina a duração e o valor de cada tempo." @close="$emit('close')">
    <form class="space-y-5" @submit.prevent="submit">
      <label class="block"><span class="mb-2 block text-sm font-semibold">Duração de um tempo</span><div class="relative"><input v-model.number="form.minutesPerUnit" required min="1" type="number" class="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm" /><span class="absolute right-4 top-3 text-sm text-slate-500">minutos</span></div></label>
      <label class="block"><span class="mb-2 block text-sm font-semibold">Valor de um tempo</span><div class="relative"><span class="absolute left-4 top-3 text-sm text-slate-500">R$</span><input v-model.number="form.pricePerUnit" required min="0" step="0.5" type="number" class="focus-ring w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-sm" /></div></label>
      <p class="rounded-xl bg-mint/70 p-4 text-sm text-brand-dark">As alterações serão aplicadas às novas crianças. Contagens em andamento não serão modificadas.</p>
      <button class="focus-ring w-full rounded-xl bg-blue-soft py-3 text-sm font-bold text-brand-dark hover:bg-blue-soft/70">Salvar configurações</button>
    </form>
  </BaseModal>
</template>
