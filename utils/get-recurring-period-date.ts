import { addDays } from 'date-fns'

type GetRecurringPeriodArgs = {
  startDate: Date
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY' | 'NONE'
}

export const getRecurringPeriodDate = ({
  startDate,
  period,
}: GetRecurringPeriodArgs) => {
  switch (period) {
    case 'DAILY':
      return addDays(startDate, 1)

    case 'WEEKLY':
      return addDays(startDate, 7)

    case 'NONE':
      return addDays(startDate, 30)

    case 'MONTHLY':
      return addDays(startDate, 30)

    case 'ANNUALLY':
      return addDays(startDate, 365)

    default:
      return addDays(startDate, 30)
  }
}
