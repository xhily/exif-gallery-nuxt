import { init } from '@paralleldrive/cuid2'

export function createCuid(length = 16) {
  return init({ length })()
}
