import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@ai-sdk/anthropic'

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
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const anthropic = new Anthropic({ apiKey })

    // Fetch website content
    let htmlContent = ''
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 10000,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch website')
      }

      htmlContent = await response.text()
    } catch (error) {
      return res.status(400).json({
        error: 'Failed to fetch website. Make sure the URL is valid and accessible.',
      })
    }

    // Extract colors using Claude
    const systemPrompt = `Du bist ein Experte für Webdesign und Farbpsychologie.
Analysiere den HTML-Inhalt einer Website und extrahiere die wichtigsten Farben der Corporate Identity.

Suche nach:
1. Primary Color: Die Hauptmarkenfarbe (meistens in Logos, Buttons, wichtigen Elementen)
2. Secondary Color: Zusatzfarbe für Akzente
3. Background Color: Hintergrundfarbe (meist weiß, aber oft spezifisch)
4. Text Color: Haupttextfarbe (meist schwarz oder dunkelgrau)
5. Accent Color: Hervorgehobene Elemente (Links, Hover-States)

Analysiere:
- CSS-Variablen
- Inline-Styles
- Häufigste Farben in den Elementen
- Brand-spezifische Farben
- Kontraste und visuellen Hierarchie

Antworte NUR mit einem JSON-Objekt mit exakten HEX-Codes:
{
  "primary": "#RRGGBB",
  "secondary": "#RRGGBB",
  "background": "#RRGGBB",
  "text": "#RRGGBB",
  "accent": "#RRGGBB"
}`

    const userPrompt = `Analysiere diese Website und extrahiere die Unternehmensfarben:

URL: ${url}

HTML-Content (erste 10000 Zeichen):
${htmlContent.substring(0, 10000)}

Antworte NUR mit einem gültigen JSON-Objekt mit den HEX-Farben.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
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
      throw new Error('Invalid response format')
    }

    const colors = JSON.parse(jsonMatch[0])

    // Validate hex colors
    const hexRegex = /^#[0-9A-F]{6}$/i
    for (const [key, value] of Object.entries(colors)) {
      if (!hexRegex.test(value as string)) {
        throw new Error(`Invalid hex color: ${value}`)
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
