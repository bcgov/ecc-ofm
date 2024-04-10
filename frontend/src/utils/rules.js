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
  YYYY: [(v) => (v > 1900 && v < 2100) || 'A valid year is required'],
  notRequired: [() => true],
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
  listIsNotEmpty: [(v) => v.length > 0 || 'This field is required'],
}

export default rules
