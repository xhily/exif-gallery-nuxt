import type { UseDateFormatOptions } from '@vueuse/core'
import { formatDate as _formatDate } from '@vueuse/core'

export function formatDate(date?: Date | null, formatStr = 'YYYY-MM-DD HH:mm:ss', options?: UseDateFormatOptions) {
  if (!date)
    return ''
  return _formatDate(date, formatStr, options)
}
