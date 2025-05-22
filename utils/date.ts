import { format, isToday, isYesterday } from 'date-fns'

export const formatTransactionDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today, ${format(date, 'p')}`
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'p')}`
  } else {
    return format(date, 'MMM d, p')
  }
}
