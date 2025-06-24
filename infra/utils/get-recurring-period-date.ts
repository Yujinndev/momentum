import {
  addDays,
  addYears,
  getDate,
  lastDayOfMonth,
  addWeeks,
  addMonths,
  setDate,
} from 'date-fns'

export const getRecurringPeriodDate = ({
  startDate,
  period,
  multiplier = 1,
}: {
  startDate: Date
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY'
  multiplier?: number
}) => {
  const targetDay = getDate(startDate)
  let currentTime = startDate

  switch (period) {
    case 'DAILY': {
      currentTime = addDays(startDate, 1 * multiplier)
      break
    }

    case 'WEEKLY': {
      currentTime = addWeeks(startDate, 1 * multiplier)
      break
    }

    case 'MONTHLY': {
      const candidate = addMonths(startDate, 1 * multiplier)
      const lastDay = getDate(lastDayOfMonth(candidate))
      currentTime = setDate(candidate, Math.min(targetDay, lastDay))
      break
    }

    case 'ANNUALLY': {
      const candidate = addYears(startDate, 1 * multiplier)
      const lastDay = getDate(lastDayOfMonth(candidate))
      currentTime = setDate(candidate, Math.min(targetDay, lastDay))
      break
    }

    default:
      throw new Error('Invalid recurring period.')
  }

  // PHT end of time in UTC
  currentTime.setUTCHours(15, 59, 59)
  return currentTime
}
