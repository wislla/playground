<script setup>
import { computed, reactive } from 'vue'
import BaseModal from './BaseModal.vue'
import { formatCurrency } from '../utils/time'
const props = defineProps({ settings: Object })
const emit = defineEmits(['close', 'save'])
const form = reactive({ name: '', units: 1, paid: true })
const total = computed(() => form.units * props.settings.pricePerUnit)
function submit() { if (!form.name.trim()) return; emit('save', { ...form }); emit('close') }
</script>

<template>
  <BaseModal title="Adicionar criança" description="Informe os dados para iniciar a contagem." @close="$emit('close')">
    <form class="space-y-5" @submit.prevent="submit">
      <label class="block"><span class="mb-2 block text-sm font-semibold">Nome da criança</span><input v-model="form.name" autofocus required placeholder="Ex.: Maria" class="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400" /></label>
      <label class="block"><span class="mb-2 block text-sm font-semibold">Quantidade de tempos</span><select v-model.number="form.units" class="focus-ring w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"><option v-for="number in 8" :key="number" :value="number">{{ number }} tempo{{ number > 1 ? 's' : '' }} · {{ number * settings.minutesPerUnit }} min</option></select></label>
      <div class="rounded-xl bg-slate-50 p-4"><div class="flex justify-between text-sm"><span class="text-slate-500">Valor total</span><strong class="text-lg text-brand">{{ formatCurrency(total) }}</strong></div></div>
      <label class="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4"><div><span class="block text-sm font-semibold">Pagamento realizado</span><span class="text-xs text-slate-500">Marque se o valor já foi recebido</span></div><input v-model="form.paid" type="checkbox" class="size-5 accent-brand" /></label>
      <button class="focus-ring w-full rounded-xl bg-brand py-3 text-sm font-bold text-white hover:bg-brand-dark">Iniciar tempo</button>
    </form>
  </BaseModal>
</template>
