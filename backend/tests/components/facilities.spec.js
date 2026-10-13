'use strict';

jest.mock('../../src/components/utils', () => ({
  getOperation: jest.fn(),
  patchOperationWithObjectId: jest.fn(),
}));

jest.mock('../../src/components/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
}));

const { LocalDate } = require('@js-joda/core');
const { getOperation } = require('../../src/components/utils');
const { isRenewalOpen, getNextBusinessDay, getFacilitiesWithValidIntake } = require('../../src/components/facilities');

const { OPEN_INTAKE, LIMITED_INTAKE } = { OPEN_INTAKE: 1, LIMITED_INTAKE: 2 };

function intakeRow(overrides = {}) {
  return {
    ofm_intakeid: 'intake-1',
    ofm_intake_type: LIMITED_INTAKE,
    ofm_start_date: '2026-01-01',
    ofm_end_date: '2027-12-31',
    ofm_intake_facilityintake: [],
    ...overrides,
  };
}

function facilityLink(facilityId, linkId = 'link-1') {
  return { ofm_facility_intakeid: linkId, _ofm_facility_value: facilityId };
}

describe('facilities component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNextBusinessDay', () => {
    it('leaves a weekday unchanged', () => {
      const wednesday = LocalDate.parse('2027-02-03');
      expect(getNextBusinessDay(wednesday)).toEqual(LocalDate.parse('2027-02-03'));
    });

    it('rolls Saturday forward to Monday', () => {
      const saturday = LocalDate.parse('2027-04-17');
      expect(getNextBusinessDay(saturday)).toEqual(LocalDate.parse('2027-04-19'));
    });

    it('rolls Sunday forward to Monday', () => {
      const sunday = LocalDate.parse('2026-12-06');
      expect(getNextBusinessDay(sunday)).toEqual(LocalDate.parse('2026-12-07'));
    });
  });

  describe('isRenewalOpen', () => {
    const ACCEPTANCE_CRITERIA = [
      { endDate: '2026-11-30', opensOn: '2026-10-05' },
      { endDate: '2026-12-31', opensOn: '2026-11-05' },
      { endDate: '2027-01-31', opensOn: '2026-12-07' },
      { endDate: '2027-02-28', opensOn: '2027-01-04' },
      { endDate: '2027-03-31', opensOn: '2027-02-03' },
      { endDate: '2027-04-30', opensOn: '2027-03-05' },
      { endDate: '2027-05-31', opensOn: '2027-04-05' },
      { endDate: '2027-06-30', opensOn: '2027-05-05' },
      { endDate: '2027-07-31', opensOn: '2027-06-07' },
      { endDate: '2027-08-31', opensOn: '2027-07-06' },
      { endDate: '2027-11-30', opensOn: '2027-10-05' },
    ];

    ACCEPTANCE_CRITERIA.forEach(({ endDate, opensOn }) => {
      it(`FA expiring ${endDate}: is CLOSED the day before it opens (${opensOn})`, () => {
        const dayBefore = LocalDate.parse(opensOn).minusDays(1);
        expect(isRenewalOpen(LocalDate.parse(endDate), dayBefore)).toBe(false);
      });

      it(`FA expiring ${endDate}: is OPEN exactly on the expected open date (${opensOn})`, () => {
        expect(isRenewalOpen(LocalDate.parse(endDate), LocalDate.parse(opensOn))).toBe(true);
      });

      it(`FA expiring ${endDate}: stays OPEN the day after it opens`, () => {
        const dayAfter = LocalDate.parse(opensOn).plusDays(1);
        expect(isRenewalOpen(LocalDate.parse(endDate), dayAfter)).toBe(true);
      });
    });

    it('opens the renewal window on Oct 5 2026 for an FA expiring Nov 30 2026', () => {
      expect(isRenewalOpen(LocalDate.parse('2026-11-30'), LocalDate.parse('2026-10-05'))).toBe(true);
    });
  });

  describe('getFacilitiesWithValidIntake', () => {
    it('includes all facilities when an OPEN intake is active', async () => {
      getOperation.mockResolvedValue({
        value: [intakeRow({ ofm_intake_type: OPEN_INTAKE })],
      });

      const result = await getFacilitiesWithValidIntake(['fac-1', 'fac-2', 'fac-3']);

      expect(result.has('fac-1')).toBe(true);
      expect(result.has('fac-2')).toBe(true);
      expect(result.has('fac-3')).toBe(true);
    });

    it('includes only linked facilities for a LIMITED intake', async () => {
      getOperation.mockResolvedValue({
        value: [intakeRow({ ofm_intake_facilityintake: [facilityLink('fac-1'), facilityLink('fac-2', 'link-2')] })],
      });

      const result = await getFacilitiesWithValidIntake(['fac-1', 'fac-2', 'fac-3']);

      expect(result.has('fac-1')).toBe(true);
      expect(result.has('fac-2')).toBe(true);
      expect(result.has('fac-3')).toBe(false);
    });

    it('returns empty set when no active intakes exist', async () => {
      getOperation.mockResolvedValue({ value: [] });

      const result = await getFacilitiesWithValidIntake(['fac-1']);

      expect(result.size).toBe(0);
    });

    it('returns empty set when the intake query returns no value', async () => {
      getOperation.mockResolvedValue(undefined);

      const result = await getFacilitiesWithValidIntake(['fac-1']);

      expect(result.size).toBe(0);
    });

    it('does not include facilities for an unknown intake type', async () => {
      getOperation.mockResolvedValue({
        value: [intakeRow({ ofm_intake_type: 99, ofm_intake_facilityintake: [facilityLink('fac-1')] })],
      });

      const result = await getFacilitiesWithValidIntake(['fac-1']);

      expect(result.size).toBe(0);
    });

    it('combines facilities from OPEN and LIMITED intakes', async () => {
      getOperation.mockResolvedValue({
        value: [
          intakeRow({ ofm_intakeid: 'intake-1', ofm_intake_type: LIMITED_INTAKE, ofm_intake_facilityintake: [facilityLink('fac-1')] }),
          intakeRow({ ofm_intakeid: 'intake-2', ofm_intake_type: OPEN_INTAKE }),
        ],
      });

      const result = await getFacilitiesWithValidIntake(['fac-1', 'fac-2']);

      expect(result.has('fac-1')).toBe(true);
      expect(result.has('fac-2')).toBe(true);
    });

    it('queries intakes with a date window filter', async () => {
      getOperation.mockResolvedValue({ value: [] });

      await getFacilitiesWithValidIntake(['fac-1']);

      expect(getOperation).toHaveBeenCalledTimes(1);
      const query = getOperation.mock.calls[0][0];
      expect(query).toContain('ofm_intakes');
      expect(query).toContain('statecode eq 0');
      expect(query).toContain('ofm_start_date le');
      expect(query).toContain('ofm_end_date ge');
    });
  });
});
