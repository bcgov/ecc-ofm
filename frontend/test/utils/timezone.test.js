import momentTZ from 'moment-timezone'
import { describe, expect, it } from 'vitest'

import { TIME_ZONE } from '@/utils/constants'

describe('America/Vancouver timezone data (BC permanent UTC-7)', () => {
  it('uses tzdata 2026b or later', () => {
    expect(momentTZ.tz.dataVersion >= '2026b').toBe(true)
  })

  it('is UTC-8 (PST) before the change', () => {
    expect(momentTZ.tz('2026-01-15T12:00:00', TIME_ZONE).utcOffset()).toBe(-480)
  })

  it('is UTC-7 in summer 2026', () => {
    expect(momentTZ.tz('2026-07-01T12:00:00', TIME_ZONE).utcOffset()).toBe(-420)
  })

  it('stays UTC-7 after Nov 1, 2026 (no fall back)', () => {
    expect(momentTZ.tz('2026-11-02T12:00:00', TIME_ZONE).utcOffset()).toBe(-420)
    expect(momentTZ.tz('2027-01-15T12:00:00', TIME_ZONE).utcOffset()).toBe(-420)
  })
})
