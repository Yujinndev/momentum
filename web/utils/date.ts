import {
  format,
  isToday,
  isYesterday,
  addDays,
  addYears,
  getDate,
  lastDayOfMonth,
  addWeeks,
  addMonths,
  setDate,
} from 'date-fns'
import { isRecurringTimeConfig } from '@/utils/type-guards-schemas'
import { TimeConfig } from '@/types/budget'

export const formatTransactionDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today, ${format(date, 'p')}`
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'p')}`
  } else {
    return format(date, 'MMM d, p')
  }
}

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

export const extractTimeConfig = (timeConfig: TimeConfig, startDate: Date) => {
  if (isRecurringTimeConfig(timeConfig)) {
    return {
      endDate: getRecurringPeriodDate({
        startDate,
        period: timeConfig.recurringPeriod,
      }),
      recurringPeriod: timeConfig.recurringPeriod,
      isRecurring: true,
    }
  }

  return {
    endDate: timeConfig.endDate,
    recurringPeriod: null,
    isRecurring: false,
  }
}
