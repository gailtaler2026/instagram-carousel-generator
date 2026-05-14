export interface DesignPreset {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
  fonts: {
    headline: string
    body: string
    cta: string
  }
  spacing: {
    padding: string
    gap: string
    lineHeight: number
  }
  preview: {
    bgColor: string
    textColor: string
    accentColor: string
  }
}

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'soft-clean',
    name: 'Soft & Clean',
    description: 'Ruhig und modern',
    colors: {
      primary: '#7C5CE6',
      secondary: '#E8E0FF',
      background: '#F8F7FF',
      text: '#2D2D3D',
      accent: '#7C5CE6',
    },
    fonts: {
      headline: '"Raleway", sans-serif',
      body: '"Raleway", sans-serif',
      cta: '"Raleway", sans-serif',
    },
    spacing: {
      padding: '32px',
      gap: '24px',
      lineHeight: 1.6,
    },
    preview: {
      bgColor: '#F8F7FF',
      textColor: '#2D2D3D',
      accentColor: '#7C5CE6',
    },
  },
  {
    id: 'bold-dark',
    name: 'Bold & Dark',
    description: 'Kontrast und Kraft',
    colors: {
      primary: '#FFD700',
      secondary: '#333333',
      background: '#1A1A1A',
      text: '#FFFFFF',
      accent: '#FFD700',
    },
    fonts: {
      headline: '"Bebas Neue", sans-serif',
      body: '"Inter", sans-serif',
      cta: '"Bebas Neue", sans-serif',
    },
    spacing: {
      padding: '40px',
      gap: '28px',
      lineHeight: 1.4,
    },
    preview: {
      bgColor: '#1A1A1A',
      textColor: '#FFFFFF',
      accentColor: '#FFD700',
    },
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Weich und verspielt',
    colors: {
      primary: '#FF69B4',
      secondary: '#FFE5F0',
      background: '#FFF5FB',
      text: '#5A3D5C',
      accent: '#FF69B4',
    },
    fonts: {
      headline: '"Playfair Display", serif',
      body: '"Lato", sans-serif',
      cta: '"Lato", sans-serif',
    },
    spacing: {
      padding: '36px',
      gap: '24px',
      lineHeight: 1.7,
    },
    preview: {
      bgColor: '#FFF5FB',
      textColor: '#5A3D5C',
      accentColor: '#FF69B4',
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Energisch und dynamisch',
    colors: {
      primary: '#9D4EDD',
      secondary: '#E0AAFF',
      background: '#3C096C',
      text: '#FFFFFF',
      accent: '#C77DFF',
    },
    fonts: {
      headline: '"Montserrat", sans-serif',
      body: '"Montserrat", sans-serif',
      cta: '"Montserrat", sans-serif',
    },
    spacing: {
      padding: '42px',
      gap: '26px',
      lineHeight: 1.5,
    },
    preview: {
      bgColor: '#3C096C',
      textColor: '#FFFFFF',
      accentColor: '#9D4EDD',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Natürlich und organisch',
    colors: {
      primary: '#2D6A4F',
      secondary: '#A7C957',
      background: '#F1FAEE',
      text: '#1B4332',
      accent: '#52B788',
    },
    fonts: {
      headline: '"Merriweather", serif',
      body: '"Merriweather", serif',
      cta: '"Merriweather", serif',
    },
    spacing: {
      padding: '38px',
      gap: '25px',
      lineHeight: 1.8,
    },
    preview: {
      bgColor: '#F1FAEE',
      textColor: '#1B4332',
      accentColor: '#2D6A4F',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Luxuriös und zeitlos',
    colors: {
      primary: '#A0826D',
      secondary: '#E8D5C4',
      background: '#F5F1E8',
      text: '#3E2723',
      accent: '#8B7355',
    },
    fonts: {
      headline: '"Cormorant Garamond", serif',
      body: '"Raleway", sans-serif',
      cta: '"Raleway", sans-serif',
    },
    spacing: {
      padding: '44px',
      gap: '30px',
      lineHeight: 1.9,
    },
    preview: {
      bgColor: '#F5F1E8',
      textColor: '#3E2723',
      accentColor: '#A0826D',
    },
  },
]
