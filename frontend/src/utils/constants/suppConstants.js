import { SUPPLEMENTARY_TYPES } from '@/utils/constants'

export const INDIG_CHECKBOX_LABELS = Object.freeze([
  {
    label:
      'Honoraria for Elder involvement, language revitalization and/ or other resource people including curriculum development resource',
    value: '1',
  },
  { label: 'Culturally based meals and traditional foods', value: '2' },
  { label: 'Materials for a cultural program (beads, wood, food, etc.)', value: '3' },
  { label: 'Books, music, videos, and arts and crafts materials', value: '4' },
  { label: 'Culturally relevant toys and games', value: '5' },
  {
    label:
      'Facility decor enhancement (pictures, including artwork, photos, outdoor structures, and natural materials)',
    value: '6',
  },
  { label: 'Field trips and outings', value: '7' },
  { label: 'Land-based play support', value: '8' },
  { label: 'Other', value: '9' },
])

export const SUPPORT_CHECKBOX_LABELS = Object.freeze([
  {
    label: 'Resources and materials with the intention of increasing accessibility and inclusion for all children',
    value: '1',
    tooltip: 'e.g. Toileting step stool',
  },
  {
    label: 'Resources to proactively support inclusion of children with diverse needs',
    value: '2',
    tooltip: 'e.g. Sensory toys',
  },
  {
    label: 'Accessibility enhancements in the facility',
    value: '3',
    tooltip: 'e.g. Wheelchair ramps, automatic door installations, bathroom renovations for accessibility',
  },
  { label: 'Other', value: '4' },
])

export const SUPP_TERM_CODES = Object.freeze({
  TERM_ONE: 1,
  TERM_TWO: 2,
  TERM_THREE: 3,
})

export const CORE_SERVICES_PANELS = Object.freeze([
  {
    title: 'Indigenous Programming Allowance',
    id: 'indigenous',
    supplementaryType: SUPPLEMENTARY_TYPES.INDIGENOUS,
  },
  {
    title: 'Support Needs Programming Allowance',
    id: 'support-needs',
    supplementaryType: SUPPLEMENTARY_TYPES.SUPPORT,
  },
])

export const DISCRETIONARY_PANEL = Object.freeze({
  title: 'Transportation Allowance',
  id: 'transportation',
  supplementaryType: SUPPLEMENTARY_TYPES.TRANSPORT,
})
