import { describe, expect, it } from 'vitest'
import { formatTimer, getRemainingSeconds } from './time'

describe('time utilities', () => {
  it('formats minute timers', () => expect(formatTimer(754)).toBe('12:34'))
  it('formats timers longer than one hour', () => expect(formatTimer(3723)).toBe('01:02:03'))
  it('never returns negative remaining time', () => expect(getRemainingSeconds({ endsAt: 100, status: 'active' }, 200)).toBe(0))
})
