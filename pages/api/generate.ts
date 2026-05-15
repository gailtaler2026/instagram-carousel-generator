import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

type ResponseData = {
  slides?: any[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, slideCount = 5 } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const anthropic = new Anthropic({ apiKey })

    const systemPrompt = `Du bist ein kreativer Instagram Content-Designer.
Generiere ein Instagram-Karussell mit EXAKT ${slideCount} Slides zum gegebenen Thema.

REGELN:
- Slide 1: IMMER type "title" (Überschrift + kurzer Untertitel)
- Slide 2 bis ${slideCount - 1}: type "content" (Überschrift + 3 kurze Bullet Points)
- Letzter Slide (${slideCount}): IMMER type "cta" (Call-to-Action Text + Button Text)

Antworte NUR mit einem validen JSON-Array, KEIN weiterer Text.

Beispielformat:
[
  {"type": "title", "headline": "Haupttitel hier", "subtitle": "Kurzer Untertitel"},
  {"type": "content", "headline": "Punkt 1", "bullets": ["Detail A", "Detail B", "Detail C"]},
  {"type": "cta", "cta": "Handlungsaufforderung hier!", "buttonText": "Jetzt starten"}
]`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Erstelle ein Instagram-Karussell über: ${prompt}`,
        },
      ],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    const rawSlides = JSON.parse(jsonMatch[0])

    const slides = rawSlides.map((slide: any, index: number) => ({
      slideNumber: index + 1,
      totalSlides: rawSlides.length,
      type: slide.type || 'content',
      headline: slide.headline || slide.title || '',
      subtitle: slide.subtitle || '',
      bullets: slide.bullets || [],
      cta: slide.cta || '',
      buttonText: slide.buttonText || 'Mehr erfahren',
    }))

    return res.status(200).json({ slides })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
