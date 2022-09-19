
const { getYear, getMonth } = require('./date');

const validationPattern = {
  contact: /^([0-9]{10})+$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  number: /^[0-9]+$/
}

const messages = {
  required: 'Required.',
  invalidEmail: 'Invalid Email Id.',
  invalidContact: 'Invalid Contact.'
}

const amountDifference = (amount = 0, originalAmount = 0) => {
  const amountInNumber = Number(amount)
  const originalAmountInNumber = Number(originalAmount)
  return amountInNumber - originalAmountInNumber
}

const isYearMonthUpdated = (date, originalDate) => getYear(date) !== getYear(originalDate) || getMonth(date) !== getMonth(originalDate)

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

module.exports = {
  validationPattern,
  messages,
  amountDifference,
  isYearMonthUpdated,
  monthList,
}
