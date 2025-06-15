import { addDays } from 'date-fns'

type GetRecurringPeriodArgs = {
  startDate: Date
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY' | 'NONE'
  multiplier?: number
}

export const getRecurringPeriodDate = ({
  startDate,
  period,
  multiplier = 1,
}: GetRecurringPeriodArgs) => {
  switch (period) {
    case 'DAILY':
      return addDays(startDate, 1 * multiplier)

    case 'WEEKLY':
      return addDays(startDate, 7 * multiplier)

    case 'NONE':
      return addDays(startDate, 30 * multiplier)

    case 'MONTHLY':
      return addDays(startDate, 30 * multiplier)

    case 'ANNUALLY':
      return addDays(startDate, 365 * multiplier)

    default:
      return addDays(startDate, 30 * multiplier)
  }
}
