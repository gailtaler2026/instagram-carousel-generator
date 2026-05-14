// Google Fonts Utility Functions
// Dynamisch Google Fonts laden basierend auf Corporate Identity

export const GOOGLE_FONTS_LIBRARY = {
  // Serifs
  garamond: {
    name: 'Cormorant Garamond',
    weights: [300, 400, 500, 600, 700],
    category: 'serif',
  },
  merriweather: {
    name: 'Merriweather',
    weights: [300, 400, 700],
    category: 'serif',
  },
  playfair: {
    name: 'Playfair Display',
    weights: [400, 600, 700],
    category: 'serif',
  },
  lora: {
    name: 'Lora',
    weights: [400, 500, 600, 700],
    category: 'serif',
  },

  // Sans-Serif
  raleway: {
    name: 'Raleway',
    weights: [300, 400, 600, 700, 800],
    category: 'sans-serif',
  },
  inter: {
    name: 'Inter',
    weights: [300, 400, 600, 700, 800],
    category: 'sans-serif',
  },
  montserrat: {
    name: 'Montserrat',
    weights: [400, 600, 700, 800],
    category: 'sans-serif',
  },
  lato: {
    name: 'Lato',
    weights: [300, 400, 700],
    category: 'sans-serif',
  },
  opensans: {
    name: 'Open Sans',
    weights: [300, 400, 600, 700],
    category: 'sans-serif',
  },
  poppins: {
    name: 'Poppins',
    weights: [300, 400, 600, 700],
    category: 'sans-serif',
  },
  bebas: {
    name: 'Bebas Neue',
    weights: [400],
    category: 'sans-serif',
  },
  roboto: {
    name: 'Roboto',
    weights: [300, 400, 500, 700],
    category: 'sans-serif',
  },
  dm_sans: {
    name: 'DM Sans',
    weights: [400, 500, 700],
    category: 'sans-serif',
  },
}

export type FontKey = keyof typeof GOOGLE_FONTS_LIBRARY

/**
 * Generiere Google Fonts Import Link für mehrere Schriftarten
 */
export function generateGoogleFontsLink(fonts: FontKey[]): string {
  const uniqueFonts = Array.from(new Set(fonts))
  const fontSpecs = uniqueFonts
    .map((key) => {
      const font = GOOGLE_FONTS_LIBRARY[key]
      const weights = font.weights.join(';')
      return `family=${font.name.replace(/ /g, '+')}:wght@${weights}`
    })
    .join('&')

  return `https://fonts.googleapis.com/css2?${fontSpecs}&display=swap`
}

/**
 * Erzeuge CSS für eine Schriftart
 */
export function getFontCSS(
  fontKey: FontKey,
  usage: 'headline' | 'body' | 'cta' = 'body'
): string {
  const font = GOOGLE_FONTS_LIBRARY[fontKey]
  const weights = {
    headline: '600,700',
    body: '400,600',
    cta: '600,700',
  }

  return `
    @import url('https://fonts.googleapis.com/css2?family=${font.name.replace(/ /g, '+')}:wght@${weights[usage]}&display=swap');
    font-family: '${font.name}', ${font.category};
  `
}

/**
 * Lade Google Fonts dynamisch in den DOM
 */
export function loadGoogleFonts(fonts: FontKey[]): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.href = generateGoogleFontsLink(fonts)
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}

/**
 * Generiere inline <link> tag für Google Fonts
 */
export function getGoogleFontsHead(fonts: FontKey[]): string {
  const link = generateGoogleFontsLink(fonts)
  return `<link href="${link}" rel="stylesheet" />`
}

/**
 * Generiere CSS-Klassen für alle Schriftarten
 */
export function generateFontClasses(fonts: FontKey[]): string {
  return fonts
    .map((key) => {
      const font = GOOGLE_FONTS_LIBRARY[key]
      return `
.font-${key} {
  font-family: '${font.name}', ${font.category};
}
`
    })
    .join('\n')
}

/**
 * Suche nach passenden Schriftarten für eine Beschreibung
 */
export function suggestFonts(description: string): FontKey[] {
  const desc = description.toLowerCase()
  const suggestions: FontKey[] = []

  // Eleganz, Luxus, Premium
  if (desc.match(/elegant|luxury|premium|sophisticated|classic/)) {
    suggestions.push('garamond', 'playfair', 'raleway')
  }

  // Modern, Tech, Minimalistisch
  if (desc.match(/modern|tech|clean|minimal|geometric/)) {
    suggestions.push('inter', 'montserrat', 'raleway')
  }

  // Verspielt, Kreativ, Quirky
  if (desc.match(/playful|fun|creative|quirky|bold/)) {
    suggestions.push('bebas', 'montserrat', 'poppins')
  }

  // Natürlich, Organisch, Warm
  if (desc.match(/natural|organic|warm|friendly|earth/)) {
    suggestions.push('merriweather', 'lato', 'opensans')
  }

  // Standard/Keine Treffer
  if (suggestions.length === 0) {
    suggestions.push('inter', 'lato', 'raleway')
  }

  return [...new Set(suggestions)].slice(0, 3)
}

/**
 * Konvertiere FontKey zu CSS font-family String
 */
export function getFontFamily(fontKey: FontKey): string {
  const font = GOOGLE_FONTS_LIBRARY[fontKey]
  return `'${font.name}', ${font.category}`
}

/**
 * Erstelle ein vollständiges CSS-Theme aus Fonts und Farben
 */
export function generateThemeCSS(
  fonts: { headline: FontKey; body: FontKey; cta: FontKey },
  colors: { primary: string; background: string; text: string }
): string {
  const fontLinks = [fonts.headline, fonts.body, fonts.cta]
  const link = generateGoogleFontsLink(fontLinks)

  return `
@import url('${link}');

:root {
  --font-headline: '${GOOGLE_FONTS_LIBRARY[fonts.headline].name}', ${GOOGLE_FONTS_LIBRARY[fonts.headline].category};
  --font-body: '${GOOGLE_FONTS_LIBRARY[fonts.body].name}', ${GOOGLE_FONTS_LIBRARY[fonts.body].category};
  --font-cta: '${GOOGLE_FONTS_LIBRARY[fonts.cta].name}', ${GOOGLE_FONTS_LIBRARY[fonts.cta].category};

  --color-primary: ${colors.primary};
  --color-background: ${colors.background};
  --color-text: ${colors.text};
}

.carousel {
  background-color: var(--color-background);
  color: var(--color-text);
}

.carousel h1,
.carousel h2,
.carousel h3 {
  font-family: var(--font-headline);
  color: var(--color-primary);
}

.carousel p,
.carousel li {
  font-family: var(--font-body);
}

.carousel-cta {
  font-family: var(--font-cta);
  background-color: var(--color-primary);
}
`
}
