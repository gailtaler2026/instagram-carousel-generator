import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

interface ColorResponse {
  colors?: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ColorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { imageBase64, imageMimeType } = req.body

    if (!imageBase64 || !imageMimeType) {
      return res.status(400).json({ error: 'Image data is required' })
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validMimes.includes(imageMimeType)) {
      return res.status(400).json({
        error: 'Invalid image format. Supported: JPEG, PNG, GIF, WebP',
      })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const anthropic = new Anthropic({ apiKey })

    const systemPrompt = `Du bist ein Experte für Markendesign und Farbanalyse.
Analysiere das hochgeladene Logo-Bild und extrahiere die Unternehmensfarben.

Identifiziere:
1. Primary Color: Die Hauptfarbe des Logos
2. Secondary Color: Zusätzliche Farben im Logo
3. Background Color: Empfohlene Hintergrundfarbe (basierend auf Logo-Stil)
4. Text Color: Empfohlene Textfarbe für hohen Kontrast
5. Accent Color: Hervorgehobene/Akzent-Farbe

Rückgabe: Ein JSON-Objekt mit 5 HEX-Farben:
{
  "primary": "#RRGGBB",
  "secondary": "#RRGGBB",
  "background": "#RRGGBB",
  "text": "#RRGGBB",
  "accent": "#RRGGBB"
}

Regeln:
- Nutze tatsächliche Farben aus dem Logo für primary und secondary
- Wähle intelligente Komplementärfarben für background, text, accent
- Stelle hohen Kontrast zwischen text und background sicher
- Alle Farben sollten professionell und kohärent wirken`

    const userPrompt = `Analysiere dieses Logo und extrahiere die Unternehmensfarben.
Antworte NUR mit einem gültigen JSON-Objekt mit HEX-Farben.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageMimeType as
                  | 'image/jpeg'
                  | 'image/png'
                  | 'image/gif'
                  | 'image/webp',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Extract JSON
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Response:', content.text)
      throw new Error('No valid JSON found in response')
    }

    const colors = JSON.parse(jsonMatch[0])

    // Validate hex colors
    const hexRegex = /^#[0-9A-F]{6}$/i
    for (const [key, value] of Object.entries(colors)) {
      if (!hexRegex.test(value as string)) {
        throw new Error(`Invalid hex color for ${key}: ${value}`)
      }
    }

    return res.status(200).json({ colors })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return res.status(500).json({ error: errorMessage })
  }
}
