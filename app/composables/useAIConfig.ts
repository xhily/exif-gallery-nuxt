interface AIConfig {
  provider: 'gemini' | 'openai'
  baseUrl: string
  secretKey: string
  enabled: boolean
}

const defaultConfig: AIConfig = {
  provider: 'gemini',
  baseUrl: '',
  secretKey: '',
  enabled: false,
}

const providers = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Gemini', value: 'gemini' },
]

export function useAIConfig() {
  const config = useLocalStorage<AIConfig>('ai-config', defaultConfig)

  return {
    config,
    providers,
  }
}
