import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { useAIConfig } from '../composables/useAIConfig'

// Helper function to remove base64 prefix
function removeBase64Prefix(base64: string) {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '')
}

// Helper function to clean up AI response text
function cleanUpAiTextResponse(text: string) {
  return text.trim().replace(/[\n\r]+/g, ' ')
}

// Initialize AI client based on provider
function initializeAIClient() {
  const { config } = useAIConfig()

  if (!config.value.enabled) {
    console.error('[DEV] AI is disabled. Please enable it in the settings.')
    return null
  }

  if (!config.value.secretKey) {
    throw new Error('AI secret key is missing. Please provide it in the settings.')
  }

  if (config.value.provider === 'openai') {
    return createOpenAI({
      baseURL: config.value.baseUrl || undefined,
      apiKey: config.value.secretKey,
    })
  }
  else if (config.value.provider === 'gemini') {
    return createGoogleGenerativeAI({
      baseURL: config.value.baseUrl || undefined,
      apiKey: config.value.secretKey,
    })
  }

  return null
}

export async function getAiImageAnalysis(imageFile: File) {
  const client = initializeAIClient()
  const { config } = useAIConfig()
  const { t } = useNuxtApp().$i18n

  const imageAnalysisSchema = z.object({
    title: z.string().max(20).describe(t('ai.title_desc')),
    caption: z.string().max(30).describe(t('ai.caption_desc')),
    tags: z.array(z.string()).max(4).describe(t('ai.tags_desc')),
    semanticDescription: z.string().describe(t('ai.semantic_desc')),
  })

  type ImageAnalysis = z.infer<typeof imageAnalysisSchema>

  const AI_IMAGE_PROMPT = `${t('ai.question')}\n`
    + `- ${t('ai.title')}\n`
    + `- ${t('ai.caption')}\n`
    + `- ${t('ai.tags')}\n`
    + `- ${t('ai.semantic')}`

  // if (import.meta.env.DEV) {
  //   // FIXME: For development purposes only
  //   await new Promise(resolve => setTimeout(resolve, 1000))
  //   return {
  //     title: `AI Title ${Math.round(Math.random() * 1000)}`,
  //     caption: `AI Caption ${Math.round(Math.random() * 1000)}`,
  //     tags: [`AI Tag ${Math.round(Math.random() * 10)}`, `AI Tag ${Math.round(Math.random() * 10)}`, `AI Tag ${Math.round(Math.random() * 10)}`],
  //     semanticDescription: 'AI Semantic Description',
  //   }
  // }

  if (!client) {
    return {
      title: '',
      caption: '',
      tags: [],
      semanticDescription: '',
    }
  }

  try {
    const base64 = await getCompressedImageBase64(imageFile)
    const { object } = await generateObject({
      model: client(config.value.provider === 'openai' ? 'gpt-4o' : 'gemini-2.0-flash'),
      schema: imageAnalysisSchema,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: AI_IMAGE_PROMPT,
          },
          {
            type: 'image',
            image: removeBase64Prefix(base64),
          },
        ],
      }],
    })

    const result: ImageAnalysis = {
      title: cleanUpAiTextResponse(object.title || ''),
      caption: cleanUpAiTextResponse(object.caption || ''),
      tags: (object.tags || []).map((tag: string) => cleanUpAiTextResponse(tag)),
      semanticDescription: cleanUpAiTextResponse(object.semanticDescription || ''),
    }

    return result
  }
  catch (error) {
    console.error('Error generating image analysis:', error)
    return {
      title: '',
      caption: '',
      tags: [],
      semanticDescription: '',
    }
  }
}
