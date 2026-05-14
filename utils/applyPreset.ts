import { DesignPreset } from '@/types/preset'

export interface PresetStyle {
  backgroundColor: string
  textColor: string
  accentColor: string
  headlineFont: string
  bodyFont: string
  ctaFont: string
  padding: string
  gap: string
  lineHeight: number
}

export interface StyledSlide {
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
  // Styling properties
  headlineFont?: string
  bodyFont?: string
  padding?: string
  gap?: string
  lineHeight?: number
}

export function applyPresetToSlides(
  slides: any[],
  preset: DesignPreset
): StyledSlide[] {
  return slides.map((slide) => ({
    ...slide,
    backgroundColor: preset.colors.background,
    textColor: preset.colors.text,
    accentColor: preset.colors.accent,
    headlineFont: preset.fonts.headline,
    bodyFont: preset.fonts.body,
    ctaFont: preset.fonts.cta,
    padding: preset.spacing.padding,
    gap: preset.spacing.gap,
    lineHeight: preset.spacing.lineHeight,
  }))
}

export function getPresetCSS(preset: DesignPreset): string {
  return `
    /* ${preset.name} Preset */
    :root {
      --primary: ${preset.colors.primary};
      --secondary: ${preset.colors.secondary};
      --background: ${preset.colors.background};
      --text: ${preset.colors.text};
      --accent: ${preset.colors.accent};

      --font-headline: ${preset.fonts.headline};
      --font-body: ${preset.fonts.body};
      --font-cta: ${preset.fonts.cta};

      --padding: ${preset.spacing.padding};
      --gap: ${preset.spacing.gap};
      --line-height: ${preset.spacing.lineHeight};
    }

    .carousel-slide {
      background-color: var(--background);
      color: var(--text);
      padding: var(--padding);
      gap: var(--gap);
      line-height: var(--line-height);
    }

    .carousel-headline {
      font-family: var(--font-headline);
      color: var(--text);
    }

    .carousel-body {
      font-family: var(--font-body);
      color: var(--text);
      line-height: var(--line-height);
    }

    .carousel-cta {
      font-family: var(--font-cta);
      background-color: var(--accent);
      color: var(--background);
    }

    .carousel-accent {
      color: var(--accent);
    }
  `
}

export function presetToJSON(preset: DesignPreset): object {
  return {
    preset: {
      name: preset.name,
      colors: preset.colors,
      fonts: preset.fonts,
      spacing: preset.spacing,
    },
  }
}
