import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { loadState, STORAGE_KEY, usePlayground } from './usePlayground'

function mountComposable() {
  let playground: ReturnType<typeof usePlayground> | undefined
  const wrapper = mount(defineComponent({
    setup() {
      playground = usePlayground()
      return () => null
    },
  }))
  return { wrapper, playground: playground! }
}

describe('usePlayground', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-03T12:00:00Z'))
    vi.stubGlobal('crypto', { randomUUID: () => 'session-id' })
  })

  it('falls back to defaults when persisted data is invalid', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid')
    expect(loadState()).toEqual({
      settings: { minutesPerUnit: 15, pricePerUnit: 8 },
      sessions: [],
    })
  })

  it('creates a typed session and derives totals', async () => {
    const { wrapper, playground } = mountComposable()
    playground.addSession({ name: '  Maria  ', units: 2, paid: false })
    await flushPromises()

    expect(playground.sessions.value[0]).toMatchObject({
      id: 'session-id', name: 'Maria', units: 2, total: 16, paid: false, status: 'active',
    })
    expect(playground.activeSessions.value).toHaveLength(1)
    expect(playground.pendingPayments.value).toBe(1)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toHaveProperty('sessions.0.id', 'session-id')
    wrapper.unmount()
  })

  it('finishes a session when its timer expires', async () => {
    const { wrapper, playground } = mountComposable()
    playground.updateSettings({ minutesPerUnit: 1, pricePerUnit: 5 })
    playground.addSession({ name: 'João', units: 1, paid: true })

    vi.advanceTimersByTime(60_000)
    await flushPromises()

    expect(playground.activeSessions.value).toHaveLength(0)
    expect(playground.finishedSessions.value).toHaveLength(1)
    expect(playground.justFinished.value?.name).toBe('João')
    expect(playground.totalToday.value).toBe(5)
    wrapper.unmount()
  })
})
