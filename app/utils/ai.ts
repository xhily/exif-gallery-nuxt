import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { useAIConfig } from '../composables/useAIConfig'

export const imageAnalysisSchema = z.object({
  title: z.string().max(20).describe('为图片生成一个不超过20个字的简洁标题'),
  caption: z.string().max(30).describe('用不超过6个词描述图片要点，无需标点符号'),
  tags: z.array(z.string()).max(4).describe('最多3个关键词标签，用于描述图片主要元素，避免使用形容词和副词'),
  semanticDescription: z.string().describe('简要描述图片内容，直接描述要点，无需引导性语句'),
})

export type ImageAnalysis = z.infer<typeof imageAnalysisSchema>

// Prompt template for image analysis
export const AI_IMAGE_PROMPT = '请分析这张图片并以JSON格式提供以下信息：\n'
  + '- 一个不超过不超过20个字的简洁标题\n'
  + '- 用不超过6个词描述图片要点，无需标点符号\n'
  + '- 最多3个关键词标签，用于描述主要元素（避免形容词和副词）\n'
  + '- 简要直接地描述图片内容，无需引导性语句'

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

export async function getAiImageAnalysis(imageFile: File): Promise<ImageAnalysis> {
  const client = initializeAIClient()
  const { config } = useAIConfig()

  if (import.meta.env.DEV) {
    // FIXME: For development purposes only
    return {
      title: 'AI Title',
      caption: 'AI Caption',
      tags: ['AI Tag 1', 'AI Tag 2', 'AI Tag 3'],
      semanticDescription: 'AI Semantic Description',
    }
  }

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

    return {
      title: cleanUpAiTextResponse(object.title || ''),
      caption: cleanUpAiTextResponse(object.caption || ''),
      tags: (object.tags || []).map((tag: string) => cleanUpAiTextResponse(tag)),
      semanticDescription: cleanUpAiTextResponse(object.semanticDescription || ''),
    }
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
