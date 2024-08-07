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
  notNullRequired: [(v) => v != null || REQUIRED_MSG], // value must be not null and not undefined
  postalCode: [(v) => !v || /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(v) || 'A valid postal code is required'],
  MMDDYYYY: (v) => (!!v && !isNaN(new Date(v))) || 'Date must be in MM/DD/YYYY format',
  validEndDate(startDate) {
    return (v) => new Date(v) > new Date(startDate) || 'End date must be after start date'
  },
  dateInRange: (v, startDate, endDate) => {
    if (!v) return true
    const date = new Date(v)
    const minDate = new Date(startDate)
    const maxDate = new Date(endDate)
    if (date < minDate || date > maxDate) {
      return `Date must be between ${startDate} and ${endDate}`
    }
    return true
  },
  validHourTo(hourFrom) {
    return (v) => !v || v > hourFrom || `Hours To must be after Hours From`
  },
  max(number) {
    return (v) => !v || v <= number || `Max exceeded: ${number.toLocaleString('en-ca')}`
  },
  min(number) {
    return (v) => !v || v >= number || `Min exceeded: ${number.toLocaleString('en-ca')}`
  },
  maxLength(number) {
    return (v) => !v || v.length <= number || 'Max length exceeded'
  },
  phone: (v) => !v || /^\(?([0-9]{3})\)?-([0-9]{3})-([0-9]{4})$/.test(v) || 'Must be a valid phone number in the format ###-###-####',
  listIsNotEmpty: [(v) => v.length > 0 || REQUIRED_MSG],
}

export default rules
