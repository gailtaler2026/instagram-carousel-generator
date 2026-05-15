import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

interface SlideData {
  slideNumber: number
  totalSlides: number
  type: 'title' | 'content' | 'cta'
  headline?: string
  subtitle?: string
  bullets?: string[]
  cta?: string
  buttonText?: string
}

interface RefineSlidesResponse {
  slides?: SlideData[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RefineSlidesResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slides, refinementPrompt } = req.body

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({ error: 'Slides array is required' })
    }

    if (!refinementPrompt || refinementPrompt.trim().length === 0) {
      return res.status(400).json({ error: 'Refinement prompt is required' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const anthropic = new Anthropic({ apiKey })

    const systemPrompt = `Du bist ein Experte für Instagram-Content und Text-Optimierung.
Verfeinere die gegebenen Carousel-Slides basierend auf den Anweisungen des Nutzers.

REGELN:
- Behalte die Struktur und Anzahl der Slides
- Ändere nur die Texte, nicht die Typen
- Für Headlines: halte sie prägnant und eingängig
- Für Bullets: max 8 Wörter pro Bullet, prägnant
- Für Subtitles: max 15 Wörter, anreißend
- Für CTAs: überzeugend, actionable
- Alle Texte sollten zur Instagram-Kommunikation passen

WICHTIG:
- Antworte NUR mit einem gültigen JSON-Array
- Keine zusätzlichen Erklärungen
- Alle Original-Felder beibehalten
- Nur die Texte ändern`

    const userPrompt = `Verfeinere diese Carousel-Slides nach folgender Anweisung:

ANWEISUNG: "${refinementPrompt}"

AKTUELLE SLIDES:
${JSON.stringify(slides, null, 2)}

Antworte NUR mit dem aktualisierten JSON-Array.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Extract JSON
    const jsonMatch = content.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('Response:', content.text)
      throw new Error('No valid JSON found in response')
    }

    const refinedSlides = JSON.parse(jsonMatch[0]) as SlideData[]

    return res.status(200).json({ slides: refinedSlides })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return res.status(500).json({ error: errorMessage })
  }
}
