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
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const anthropic = new Anthropic({ apiKey })

    const systemPrompt = `Du bist ein kreativer Content-Designer für Instagram.
Generiere ein Instagram-Karussell mit 5-7 Folien basierend auf dem gegebenen Thema.
Antworte NUR mit einem JSON-Array (keine zusätzlichen Texte).
Array mit Objekten mit den Feldern: title, description, emoji, background.
Verwende Farben für das background Feld (hex oder rgb).
Beispiel: [{"title": "Titel", "description": "Beschreibung", "emoji": "🎨", "background": "#FFE5B4"}]`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Parse JSON from response
    const jsonMatch = content.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    const slides = JSON.parse(jsonMatch[0])
    return res.status(200).json({ slides })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
