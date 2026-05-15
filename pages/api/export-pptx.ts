import type { NextApiRequest, NextApiResponse } from 'next'
import PptxGenJS from 'pptxgenjs'

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

interface ExportRequest {
  slides: SlideData[]
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
    headlineFont?: string
    bodyFont?: string
    ctaFont?: string
  }
  carouselName?: string
}

interface ExportResponse {
  success?: boolean
  error?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExportResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slides, theme, carouselName = 'carousel' } = req.body as ExportRequest

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({ error: 'Slides array is required' })
    }

    if (!theme) {
      return res.status(400).json({ error: 'Theme is required' })
    }

    // Create presentation
    const prs = new PptxGenJS()

    // Define layout for Instagram square format (10x10 inch)
    prs.defineLayout({ name: 'SQUARE', width: 10, height: 10 })

    // Process each slide
    slides.forEach((slide) => {
      const prsSlide = prs.addSlide('SQUARE')

      if (slide.type === 'title') {
        createTitleSlide(prsSlide, slide, theme)
      } else if (slide.type === 'content') {
        createContentSlide(prsSlide, slide, theme)
      } else if (slide.type === 'cta') {
        createCtaSlide(prsSlide, slide, theme)
      }
    })

    // Generate and send file
    const buffer = await prs.write({ outputType: 'arraybuffer' })
    const uint8Array = new Uint8Array(buffer as ArrayBuffer)

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
    res.setHeader('Content-Disposition', `attachment; filename="${carouselName}.pptx"`)
    res.setHeader('Content-Length', uint8Array.length)

    // Send file
    res.end(Buffer.from(uint8Array))
  } catch (error) {
    console.error('PPTX Export Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return res.status(500).json({ error: errorMessage })
  }
}

// ============ SLIDE CREATORS ============

function createTitleSlide(
  slide: any,
  data: SlideData,
  theme: ExportRequest['theme']
) {
  // Background
  slide.background = { color: theme.backgroundColor }

  // Color stripe at top
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: theme.primaryColor },
    line: { type: 'none' },
  })

  // Gradient overlay (simulate)
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: {
      color: theme.accentColor,
      transparency: 40,
    },
    line: { type: 'none' },
  })

  // Headline
  slide.addText(data.headline || '', {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 1.5,
    fontSize: 54,
    bold: true,
    color: theme.primaryColor,
    align: 'center',
    valign: 'middle',
    fontFace: extractFontName(theme.headlineFont || 'Raleway'),
    wrap: true,
  })

  // Subtitle
  slide.addText(data.subtitle || '', {
    x: 0.5,
    y: 5.2,
    w: 9,
    h: 1.2,
    fontSize: 28,
    color: theme.textColor,
    align: 'center',
    valign: 'middle',
    fontFace: extractFontName(theme.bodyFont || 'Raleway'),
    wrap: true,
    transparency: 20,
  })

  // Slide number (bottom right)
  slide.addText(`${data.slideNumber} / ${data.totalSlides}`, {
    x: 8.8,
    y: 9.3,
    w: 1,
    h: 0.5,
    fontSize: 11,
    color: theme.textColor,
    align: 'right',
    transparency: 40,
  })
}

function createContentSlide(
  slide: any,
  data: SlideData,
  theme: ExportRequest['theme']
) {
  // Background
  slide.background = { color: theme.backgroundColor }

  // Header with border
  slide.addShape('rect', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 1,
    fill: { type: 'none' },
    line: { color: theme.primaryColor, width: 3, endArrowType: 'none' },
  })

  // Headline
  slide.addText(data.headline || '', {
    x: 0.7,
    y: 0.55,
    w: 8.6,
    h: 0.9,
    fontSize: 40,
    bold: true,
    color: theme.primaryColor,
    valign: 'middle',
    fontFace: extractFontName(theme.headlineFont || 'Raleway'),
    wrap: true,
  })

  // Bullets
  const bulletStartY = 1.8
  const bulletHeight = 1.3
  const bulletGap = 0.15

  data.bullets?.forEach((bullet, idx) => {
    const yPos = bulletStartY + idx * (bulletHeight + bulletGap)

    // Colored bullet point circle
    slide.addShape('ellipse', {
      x: 0.7,
      y: yPos + 0.25,
      w: 0.35,
      h: 0.35,
      fill: { color: theme.accentColor },
      line: { type: 'none' },
    })

    // Checkmark in circle
    slide.addText('✓', {
      x: 0.7,
      y: yPos + 0.2,
      w: 0.35,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: theme.backgroundColor,
      align: 'center',
      valign: 'middle',
    })

    // Bullet text
    slide.addText(bullet, {
      x: 1.2,
      y: yPos,
      w: 8,
      h: bulletHeight,
      fontSize: 20,
      color: theme.textColor,
      valign: 'top',
      fontFace: extractFontName(theme.bodyFont || 'Raleway'),
      wrap: true,
    })
  })

  // Slide number
  slide.addText(`${data.slideNumber} / ${data.totalSlides}`, {
    x: 8.8,
    y: 9.3,
    w: 1,
    h: 0.5,
    fontSize: 11,
    color: theme.textColor,
    align: 'right',
    transparency: 40,
  })
}

function createCtaSlide(
  slide: any,
  data: SlideData,
  theme: ExportRequest['theme']
) {
  // Full background with accent color
  slide.background = { color: theme.accentColor }

  // CTA Text
  slide.addText(data.cta || '', {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 2,
    fontSize: 36,
    bold: true,
    color: theme.backgroundColor,
    align: 'center',
    valign: 'middle',
    fontFace: extractFontName(theme.headlineFont || 'Raleway'),
    wrap: true,
  })

  // Button shape
  slide.addShape('roundRect', {
    x: 2.5,
    y: 4.8,
    w: 5,
    h: 0.8,
    fill: { color: theme.backgroundColor },
    line: { color: theme.backgroundColor, width: 2 },
    rectRadius: 0.15,
  })

  // Button text
  slide.addText(data.buttonText || '', {
    x: 2.5,
    y: 4.8,
    w: 5,
    h: 0.8,
    fontSize: 24,
    bold: true,
    color: theme.accentColor,
    align: 'center',
    valign: 'middle',
    fontFace: extractFontName(theme.ctaFont || 'Raleway'),
  })

  // Handle text
  slide.addText('@yourhandle', {
    x: 0.5,
    y: 6.2,
    w: 9,
    h: 0.6,
    fontSize: 18,
    color: theme.backgroundColor,
    align: 'center',
    valign: 'middle',
    fontFace: extractFontName(theme.bodyFont || 'Raleway'),
    transparency: 20,
  })

  // Slide number
  slide.addText(`${data.slideNumber} / ${data.totalSlides}`, {
    x: 8.8,
    y: 9.3,
    w: 1,
    h: 0.5,
    fontSize: 11,
    color: theme.backgroundColor,
    align: 'right',
    transparency: 30,
  })
}

// ============ HELPER FUNCTIONS ============

/**
 * Extract font name from CSS font-family string
 * Input: "Raleway, sans-serif" or "'Raleway', sans-serif"
 * Output: "Raleway"
 */
function extractFontName(fontFamily: string): string {
  if (!fontFamily) return 'Raleway'

  // Remove quotes and split by comma
  const fontName = fontFamily
    .split(',')[0]
    .replace(/['"]/g, '')
    .trim()

  // Map Google Fonts to system fonts for PPTX compatibility
  const fontMap: { [key: string]: string } = {
    'Raleway': 'Raleway',
    'Inter': 'Inter',
    'Montserrat': 'Montserrat',
    'Lato': 'Lato',
    'Open Sans': 'Open Sans',
    'Poppins': 'Poppins',
    'Bebas Neue': 'Bebas Neue',
    'Roboto': 'Roboto',
    'DM Sans': 'DM Sans',
    'Merriweather': 'Merriweather',
    'Playfair Display': 'Playfair Display',
    'Cormorant Garamond': 'Cormorant Garamond',
  }

  return fontMap[fontName] || 'Raleway'
}
