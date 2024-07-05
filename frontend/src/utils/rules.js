const REQUIRED_MSG = 'This field is required'
const rules = {
  email: (v) => !v || /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) || 'A valid email is required', // https://emailregex.com/
  required: [
    function (v) {
      if (v === 0) {
        return true
      } else if (Array.isArray(v)) {
        return v.length > 0 || REQUIRED_MSG
      } else if (!v) {
        return REQUIRED_MSG
      }
      return true
    },
  ],
  postalCode: [(v) => !v || /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(v) || 'A valid postal code is required'],
  MMDDYYYY: (v) => (!!v && !isNaN(new Date(v))) || 'Date must be in MM/DD/YYYY format',
  validEndDate(startDate) {
    return (v) => new Date(v) > new Date(startDate) || 'End date must be after start date'
  },
  max(number) {
    return (v) => !v || v <= number || `Max exceeded: ${number.toLocaleString('en-ca')}`
  },
  min(number) {
    return (v) => !v || v >= number || `Min exceeded: ${number.toLocaleString('en-ca')}`
  },
  greaterThan(value) {
    return (v) => !v || v > value || `Must be greater than: ${value}`
  },
  maxLength(number) {
    return (v) => !v || v.length <= number || 'Max length exceeded'
  },
  phone: (v) => !v || /^\(?([0-9]{3})\)?-([0-9]{3})-([0-9]{4})$/.test(v) || 'Must be a valid phone number in the format ###-###-####',
  listIsNotEmpty: [(v) => v.length > 0 || 'This field is required'],
}

export default rules
