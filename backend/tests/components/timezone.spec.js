'use strict';

const momentTZ = require('moment-timezone')

const { formatDateTimeForBack } = require('../../src/components/utils')

const TIME_ZONE = 'America/Vancouver'

describe('BC permanent UTC-7 timezone support', () => {
  it('Node ICU tzdata is 2026b or later', () => {
    expect(process.versions.tz >= '2026b').toBe(true)
  })

  it('Node Intl does not fall back on Nov 1, 2026', () => {
    const formatted = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date('2026-11-01T09:00:00Z'))
    expect(formatted).toBe('02:00')
  })

  it('moment-timezone data is 2026b or later and keeps UTC-7 after Nov 1, 2026', () => {
    expect(momentTZ.tz.dataVersion >= '2026b').toBe(true)
    expect(momentTZ.tz('2026-11-02T12:00:00', TIME_ZONE).utcOffset()).toBe(-420)
  })
})

describe('formatDateTimeForBack sends Dynamics an offset-safe anchor', () => {
  it('converts a date to noon Pacific at -07:00 (19:00 UTC)', () => {
    expect(formatDateTimeForBack('2026-11-05')).toBe('2026-11-05T12:00:00-07:00')
    expect(momentTZ.utc(formatDateTimeForBack('2026-11-05')).format('YYYY-MM-DDTHH:mm:ss[Z]')).toBe('2026-11-05T19:00:00Z')
  })

  it('keeps the same calendar date whether CRM converts at UTC-7 or legacy UTC-8', () => {
    const back = formatDateTimeForBack('2026-11-05')
    expect(momentTZ(back).utcOffset(-420).format('YYYY-MM-DD HH:mm')).toBe('2026-11-05 12:00')
    expect(momentTZ(back).utcOffset(-480).format('YYYY-MM-DD HH:mm')).toBe('2026-11-05 11:00')
  })
})