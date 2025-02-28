// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  // formatters: true,
  ignores: [
    'server/database/migrations/*',
  ],
})
