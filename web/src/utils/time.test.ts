import { describe, expect, it } from 'vitest'
import { formatCurrency, formatTimer, getRemainingSeconds } from './time'

describe('time utilities', () => {
  it('formats minute timers', () => expect(formatTimer(754)).toBe('12:34'))
  it('formats timers longer than one hour', () => expect(formatTimer(3723)).toBe('01:02:03'))
  it('never returns negative remaining time', () => expect(getRemainingSeconds({ endsAt: 100, status: 'active' }, 200)).toBe(0))
  it('rounds partial remaining seconds up', () => expect(getRemainingSeconds({ endsAt: 1_501, status: 'active' }, 1_000)).toBe(1))
  it('returns zero for an already finished session', () => expect(getRemainingSeconds({ endsAt: 2_000, status: 'finished' }, 1_000)).toBe(0))
  it('formats values as Brazilian currency', () => expect(formatCurrency(16)).toMatch(/R\$\s16,00/))
})
