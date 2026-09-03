import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getRemainingSeconds } from '../utils/time'

const STORAGE_KEY = 'tempo-de-brincar:v1'
const defaultSettings = { minutesPerUnit: 15, pricePerUnit: 8 }

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { settings: defaultSettings, sessions: [] }
  } catch {
    return { settings: defaultSettings, sessions: [] }
  }
}

export function usePlayground() {
  const saved = loadState()
  const settings = ref({ ...defaultSettings, ...saved.settings })
  const sessions = ref(saved.sessions || [])
  const now = ref(Date.now())
  const justFinished = ref(null)
  let interval

  const activeSessions = computed(() => sessions.value.filter((item) => item.status === 'active'))
  const finishedSessions = computed(() => sessions.value.filter((item) => item.status === 'finished'))
  const pendingPayments = computed(() => sessions.value.filter((item) => !item.paid).length)
  const totalToday = computed(() => sessions.value.filter((item) => item.paid).reduce((sum, item) => sum + item.total, 0))

  function addSession({ name, units, paid }) {
    const startedAt = Date.now()
    sessions.value.unshift({
      id: crypto.randomUUID(), name: name.trim(), units, paid, startedAt,
      endsAt: startedAt + units * settings.value.minutesPerUnit * 60_000,
      total: units * settings.value.pricePerUnit, status: 'active', notified: false,
    })
  }

  function updateSettings(nextSettings) {
    settings.value = { ...nextSettings }
  }

  function markPaid(id) {
    const item = sessions.value.find((session) => session.id === id)
    if (item) item.paid = true
  }

  function removeSession(id) {
    sessions.value = sessions.value.filter((session) => session.id !== id)
  }

  function resetSession(id) {
    const item = sessions.value.find((session) => session.id === id)
    if (!item) return
    item.startedAt = Date.now()
    item.endsAt = item.startedAt + item.units * settings.value.minutesPerUnit * 60_000
    item.status = 'active'
    item.notified = false
  }

  function checkTimers() {
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

  onMounted(() => { checkTimers(); interval = window.setInterval(checkTimers, 1000) })
  onBeforeUnmount(() => window.clearInterval(interval))

  return { settings, sessions, now, activeSessions, finishedSessions, pendingPayments, totalToday, justFinished, addSession, updateSettings, markPaid, removeSession, resetSession }
}
