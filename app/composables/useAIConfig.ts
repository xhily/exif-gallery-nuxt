interface AIConfig {
  provider: 'gemini' | 'openai'
  baseUrl: string
  secretKey: string
  enabled: boolean
}

const defaultConfig: AIConfig = {
  provider: 'openai',
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
