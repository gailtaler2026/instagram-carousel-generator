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
    const { description } = req.body

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const anthropic = new Anthropic({ apiKey })

    const systemPrompt = `Du bist ein Experte für Farbtheorie und Corporate Identity Design.
Konvertiere eine Text-Beschreibung einer Unternehmensidentität in konkrete HEX-Farben.

Basierend auf der Beschreibung (z.B. "Lila, weißer Hintergrund, modern, Gold-Akzente"):
1. Extrahiere alle erwähnten Farben
2. Wende Farbpsychologie an um fehlende Farben zu wählen
3. Stelle sicher, dass die Farben harmonisch zusammenpassen
4. Achte auf ausreichenden Kontrast

Rückgabe Format: Ein JSON-Objekt mit 5 HEX-Farben:
{
  "primary": "#RRGGBB",        // Hauptmarkenfarbe
  "secondary": "#RRGGBB",      // Zusatzfarbe
  "background": "#RRGGBB",     // Hintergrund
  "text": "#RRGGBB",           // Text-Hauptfarbe
  "accent": "#RRGGBB"          // Akzent-Highlights
}

Wichtig:
- Nur gültige HEX-Codes (#RRGGBB)
- Gute Lesbarkeit (Kontrast text auf background > 4.5:1)
- Farben sollten zur Beschreibung passen
- Konsistent und professionell`

    const userPrompt = `Konvertiere diese Corporate Identity Beschreibung in konkrete Farben:

"${description}"

Antworte NUR mit einem gültigen JSON-Objekt. Keine zusätzlichen Texte oder Erklärungen.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
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
