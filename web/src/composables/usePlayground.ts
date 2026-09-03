import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { NewSession, PlaygroundSession, PlaygroundSettings, PlaygroundState } from '../types/playground'
import { getRemainingSeconds } from '../utils/time'

export const STORAGE_KEY = 'tempo-de-brincar:v1'
export const defaultSettings: PlaygroundSettings = { minutesPerUnit: 15, pricePerUnit: 8 }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function loadState(storage: Pick<Storage, 'getItem'> = localStorage): PlaygroundState {
  try {
    const saved: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')
    if (!isRecord(saved)) return { settings: defaultSettings, sessions: [] }

    const savedSettings = isRecord(saved.settings) ? saved.settings : {}
    return {
      settings: {
        minutesPerUnit: typeof savedSettings.minutesPerUnit === 'number' ? savedSettings.minutesPerUnit : defaultSettings.minutesPerUnit,
        pricePerUnit: typeof savedSettings.pricePerUnit === 'number' ? savedSettings.pricePerUnit : defaultSettings.pricePerUnit,
      },
      sessions: Array.isArray(saved.sessions) ? saved.sessions as PlaygroundSession[] : [],
    }
  } catch {
    return { settings: defaultSettings, sessions: [] }
  }
}

export function usePlayground() {
  const saved = loadState()
  const settings = ref<PlaygroundSettings>({ ...defaultSettings, ...saved.settings })
  const sessions = ref<PlaygroundSession[]>(saved.sessions)
  const now = ref(Date.now())
  const justFinished = ref<PlaygroundSession | null>(null)
  let interval: ReturnType<typeof window.setInterval> | undefined

  const activeSessions = computed(() => sessions.value.filter((item) => item.status === 'active'))
  const finishedSessions = computed(() => sessions.value.filter((item) => item.status === 'finished'))
  const pendingPayments = computed(() => sessions.value.filter((item) => !item.paid).length)
  const totalToday = computed(() => sessions.value.filter((item) => item.paid).reduce((sum, item) => sum + item.total, 0))

  function addSession({ name, units, paid }: NewSession): void {
    const startedAt = Date.now()
    sessions.value.unshift({
      id: crypto.randomUUID(), name: name.trim(), units, paid, startedAt,
      endsAt: startedAt + units * settings.value.minutesPerUnit * 60_000,
      total: units * settings.value.pricePerUnit, status: 'active', notified: false,
    })
  }

  function updateSettings(nextSettings: PlaygroundSettings): void {
    settings.value = { ...nextSettings }
  }

  function markPaid(id: string): void {
    const item = sessions.value.find((session) => session.id === id)
    if (item) item.paid = true
  }

  function removeSession(id: string): void {
    sessions.value = sessions.value.filter((session) => session.id !== id)
  }

  function resetSession(id: string): void {
    const item = sessions.value.find((session) => session.id === id)
    if (!item) return
    item.startedAt = Date.now()
    item.endsAt = item.startedAt + item.units * settings.value.minutesPerUnit * 60_000
    item.status = 'active'
    item.notified = false
  }

  function checkTimers(): void {
    now.value = Date.now()
    sessions.value.forEach((session) => {
      if (session.status === 'active' && getRemainingSeconds(session, now.value) === 0) {
        session.status = 'finished'
        if (!session.notified) {
          session.notified = true
          justFinished.value = session
        }
      }
    })
  }

  watch([settings, sessions], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings: settings.value, sessions: sessions.value }))
  }, { deep: true })

  onMounted(() => {
    checkTimers()
    interval = window.setInterval(checkTimers, 1000)
  })
  onBeforeUnmount(() => {
    if (interval !== undefined) window.clearInterval(interval)
  })

  return { settings, sessions, now, activeSessions, finishedSessions, pendingPayments, totalToday, justFinished, addSession, updateSettings, markPaid, removeSession, resetSession }
}
