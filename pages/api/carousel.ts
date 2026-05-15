import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

interface Slide {
  slideNumber: number
  type: 'title' | 'content' | 'cta'
  headline?: string
  subtitle?: string
  bullets?: string[]
  cta?: string
  buttonText?: string
  background?: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
}

interface CarouselResponse {
  slides: Slide[]
  mode?: 'generate' | 'refine'
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CarouselResponse>
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ slides: [], error: 'Method not allowed', mode: 'generate' })
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res
        .status(500)
        .json({ slides: [], error: 'API key not configured', mode: 'generate' })
    }

    const anthropic = new Anthropic({ apiKey })

    // Check if this is a refine request
    const { refinePrompt, currentSlides, blogPost, slideCount } = req.body

    if (refinePrompt && currentSlides) {
      // REFINE MODE
      return handleRefineMode(
        anthropic,
        refinePrompt,
        currentSlides,
        res
      )
    } else if (blogPost && slideCount) {
      // GENERATE MODE
      return handleGenerateMode(
        anthropic,
        blogPost,
        slideCount,
        res
      )
    } else {
      return res.status(400).json({
        slides: [],
        error:
          'Either (blogPost + slideCount) or (refinePrompt + currentSlides) are required',
        mode: 'generate',
      })
    }
  } catch (error) {
    console.error('Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return res
      .status(500)
      .json({ slides: [], error: errorMessage, mode: 'generate' })
  }
}

async function handleGenerateMode(
  anthropic: any,
  blogPost: string,
  slideCount: number,
  res: NextApiResponse<CarouselResponse>
) {
  const systemPrompt = `Du bist ein Experte für Instagram-Content-Strategie und strukturierst Blog-Posts in Instagram-Karusselle.

REGELN:
- Slide 1: Titel-Slide mit "headline" (prägnant, max 10 Wörter) und "subtitle" (Anreißer, max 15 Wörter)
- Slides 2 bis vorletzte: Content-Slides mit "headline" (max 10 Wörter) und "bullets" (maximal 3 Bulletpoints)
- Jeder Bullet: MAXIMAL 8 WÖRTER. KEIN Fließtext. Nur prägnante Punkte.
- Letzte Slide: CTA-Slide mit "cta" (Aufforderung, max 20 Wörter) und "buttonText" (Call-to-Action-Text, max 4 Wörter)

WICHTIG:
- Die Anzahl der Slides muss exakt der gewünschten Anzahl entsprechen
- Nutze den Blog-Post-Inhalt und extrahiere die wichtigsten Punkte
- Mache es actionable und viral für Instagram
- Verwende Hooks und Pattern Interrupts auf Slide 1

ANTWORT FORMAT: Nur gültiges JSON, keine zusätzlichen Texte.
JSON-Array mit Objekten: { slideNumber, type, headline?, subtitle?, bullets?, cta?, buttonText? }`

  const userPrompt = `Strukturiere diesen Blog-Post in ein Instagram-Karussell mit ${slideCount} Slides:

"${blogPost}"

Antworte NUR mit einem JSON-Array, keine zusätzlichen Erklärungen.`

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
    throw new Error('Unexpected response type from Claude')
  }

  // Extract JSON from response
  const jsonMatch = content.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    console.error('Response text:', content.text)
    throw new Error('No valid JSON found in Claude response')
  }

  const slides = JSON.parse(jsonMatch[0]) as Slide[]

  return res.status(200).json({ slides, mode: 'generate' })
}

async function handleRefineMode(
  anthropic: any,
  refinePrompt: string,
  currentSlides: Slide[],
  res: NextApiResponse<CarouselResponse>
) {
  const systemPrompt = `Du bist ein Experte für Instagram-Content-Optimierung und verfeinert Carousel-Slides nach spezifischen Anweisungen.

ANFORDERUNGEN:
- Modifiziere die Slides genau nach den Anweisung des Nutzers
- Behalte die Struktur und Anzahl der Slides bei
- Für Farb-Änderungen: Verwende HEX-Codes (#RRGGBB)
- Für Text-Änderungen: Behalte die Längenbeschränkungen ein (Bullets max 8 Wörter, Headlines max 10 Wörter)
- Stelle sicher, dass die Änderungen konsistent über alle Slides angewendet werden

MÖGLICHE FARB-FELDER:
- backgroundColor: Hintergrundfarbe (HEX)
- textColor: Textfarbe (HEX)
- accentColor: Akzentfarbe (HEX)
- background: Kann auch ein Gradient sein

ANTWORT FORMAT: Nur gültiges JSON, keine zusätzlichen Texte.
JSON-Array mit den aktualisierten Slides.`

  const userPrompt = `Verfeinere diese Carousel-Slides nach folgender Anweisung:

ANWEISUNG: "${refinePrompt}"

AKTUELLE SLIDES:
${JSON.stringify(currentSlides, null, 2)}

Antworte NUR mit dem aktualisierten JSON-Array, keine zusätzlichen Erklärungen.`

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
    throw new Error('Unexpected response type from Claude')
  }

  // Extract JSON from response
  const jsonMatch = content.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    console.error('Response text:', content.text)
    throw new Error('No valid JSON found in Claude response')
  }

  const refinedSlides = JSON.parse(jsonMatch[0]) as Slide[]

  return res.status(200).json({ slides: refinedSlides, mode: 'refine' })
}
