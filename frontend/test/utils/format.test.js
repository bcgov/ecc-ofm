import momentTZ from 'moment-timezone'
import { describe, expect, it } from 'vitest'

import format from '@/utils/format'
import { TIME_ZONE } from '@/utils/constants'

describe('convertUTCDatetoPSTDate (date -> America/Vancouver midnight as UTC)', () => {
  it('returns null for empty or invalid input', () => {
    expect(format.convertUTCDatetoPSTDate(null)).toBeNull()
    expect(format.convertUTCDatetoPSTDate('')).toBeNull()
    expect(format.convertUTCDatetoPSTDate('not-a-date')).toBeNull()
  })

  it('anchors PST dates before the change to 08:00Z', () => {
    expect(format.convertUTCDatetoPSTDate('2026-01-15')).toBe('2026-01-15T08:00:00Z')
  })

  it('anchors summer 2026 (PDT) dates to 07:00Z', () => {
    expect(format.convertUTCDatetoPSTDate('2026-07-01')).toBe('2026-07-01T07:00:00Z')
  })

  it('anchors dates after Nov 1 2026 to 07:00Z (BC permanent UTC-7, no fall back)', () => {
    expect(format.convertUTCDatetoPSTDate('2026-11-05')).toBe('2026-11-05T07:00:00Z')
    expect(format.convertUTCDatetoPSTDate('2027-01-15')).toBe('2027-01-15T07:00:00Z')
  })

  it('normalises an ISO input and is idempotent across re-saves (no +8h drift)', () => {
    const first = format.convertUTCDatetoPSTDate('2026-11-05')
    expect(format.convertUTCDatetoPSTDate('2026-11-05T07:00:00Z')).toBe(first)
    expect(format.convertUTCDatetoPSTDate('2026-11-05T23:59:59Z')).toBe(first)
    expect(format.convertUTCDatetoPSTDate(first)).toBe(first)
  })

  it('renders the same calendar date through the portal display path (formatDate is UTC-based)', () => {
    expect(format.formatDate(format.convertUTCDatetoPSTDate('2026-11-05'))).toBe('2026-Nov-05')
    expect(format.formatDate(format.convertUTCDatetoPSTDate('2026-01-15'))).toBe('2026-Jan-15')
  })

  it('renders the same calendar date when converted to America/Vancouver', () => {
    expect(momentTZ.tz(format.convertUTCDatetoPSTDate('2026-11-05'), TIME_ZONE).format('YYYY-MM-DD')).toBe('2026-11-05')
    expect(momentTZ.tz(format.convertUTCDatetoPSTDate('2027-01-15'), TIME_ZONE).format('YYYY-MM-DD')).toBe('2027-01-15')
  })
})

describe('convertTimeToDateTimeFormat', () => {
  it('returns null for empty input', () => {
    expect(format.convertTimeToDateTimeFormat(null)).toBeNull()
  })

  it('builds today at the given time in America/Vancouver', () => {
    const result = format.convertTimeToDateTimeFormat('13:30')
    expect(result.tz()).toBe(TIME_ZONE)
    expect(result.format('HH:mm')).toBe('13:30')
    // Vancouver is UTC-8 (PST) or UTC-7 (PDT / permanent after 2026-11-01) - never the system zone
    expect([-480, -420]).toContain(result.utcOffset())
  })
})
