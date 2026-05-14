import { useState } from 'react'
import Head from 'next/head'
import SlideGallery from '@/components/SlideGallery'
import { SlideData, SlideTheme } from '@/components/SlidePreview'
import { DESIGN_PRESETS } from '@/types/preset'

const DEMO_SLIDES: SlideData[] = [
  {
    slideNumber: 1,
    totalSlides: 7,
    type: 'title',
    headline: 'Instagram Carousel Generator',
    subtitle: 'Erstelle professionelle Carousels mit KI',
  },
  {
    slideNumber: 2,
    totalSlides: 7,
    type: 'content',
    headline: '🚀 Feature 1',
    bullets: [
      'Automatische Farbextraktion',
      'Google Fonts Integration',
      'Export in 540×540px Format',
    ],
  },
  {
    slideNumber: 3,
    totalSlides: 7,
    type: 'content',
    headline: '✨ Feature 2',
    bullets: [
      'Multi-Mode Content-Generierung',
      'Vorlagensystem mit 6 Presets',
      'Refine-Mode für Anpassungen',
    ],
  },
  {
    slideNumber: 4,
    totalSlides: 7,
    type: 'content',
    headline: '🎨 Feature 3',
    bullets: [
      'Corporate Identity Builder',
      '4 Methoden zur Farbextraktion',
      'Dynamische Schriftarten-Auswahl',
    ],
  },
  {
    slideNumber: 5,
    totalSlides: 7,
    type: 'content',
    headline: '💾 Export-Optionen',
    bullets: [
      'PNG-Export pro Slide',
      'ZIP-Download aller Slides',
      'JSON-Datenexport',
    ],
  },
  {
    slideNumber: 6,
    totalSlides: 7,
    type: 'content',
    headline: '📱 Mobile-Ready',
    bullets: [
      'Perfekt für Instagram',
      'Responsive Design',
      'Schnelles Laden',
    ],
  },
  {
    slideNumber: 7,
    totalSlides: 7,
    type: 'cta',
    cta: 'Jetzt starten und dein erstes Carousel erstellen!',
    buttonText: 'Loslegen',
  },
]

export default function SlidePreviewDemo() {
  const [presetIndex, setPresetIndex] = useState(0)

  const currentPreset = DESIGN_PRESETS[presetIndex]

  const theme: SlideTheme = {
    primaryColor: currentPreset.colors.primary,
    secondaryColor: currentPreset.colors.secondary,
    backgroundColor: currentPreset.colors.background,
    textColor: currentPreset.colors.text,
    accentColor: currentPreset.colors.accent,
    headlineFont: currentPreset.fonts.headline,
    bodyFont: currentPreset.fonts.body,
    ctaFont: currentPreset.fonts.cta,
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
  }

  const headerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto 32px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 16px 0',
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#6b7280',
    margin: 0,
  }

  const presetSelectorStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '32px auto',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }

  const presetButtonStyle: React.CSSProperties = {
    padding: '12px 20px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
  }

  const activePresetButtonStyle: React.CSSProperties = {
    ...presetButtonStyle,
    backgroundColor: currentPreset.colors.primary,
    color: currentPreset.colors.background,
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
  }

  const contentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
  }

  const infoBoxStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: `2px solid ${currentPreset.colors.primary}`,
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '32px',
  }

  const infoTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: currentPreset.colors.primary,
    margin: '0 0 12px 0',
  }

  const infoTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.6',
  }

  const featureListStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  }

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#6b7280',
  }

  const featureIconStyle: React.CSSProperties = {
    fontSize: '20px',
    flexShrink: 0,
  }

  return (
    <>
      <Head>
        <title>Slide Preview Demo | Instagram Carousel Generator</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Bebas+Neue&family=Inter:wght@300;400;600&family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;600;700&family=Merriweather:wght@300;400;700&family=Cormorant+Garamond:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>🎬 Slide Preview Demo</h1>
          <p style={descriptionStyle}>
            Sieh dir dein Carousel mit verschiedenen Design-Presets an
          </p>
        </div>

        {/* Preset Selector */}
        <div style={presetSelectorStyle}>
          {DESIGN_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => setPresetIndex(idx)}
              style={presetIndex === idx ? activePresetButtonStyle : presetButtonStyle}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div style={contentStyle}>
          <div style={infoBoxStyle}>
            <h3 style={infoTitleStyle}>ℹ️ Über diesen Preview</h3>
            <p style={infoTextStyle}>
              Dies ist eine Demo mit 7 Sample-Slides. Jedes Slide ist exakt 540×540px
              (Instagram-Format) und kann als PNG exportiert werden. Die Styles sind alle
              inline definiert, daher funktioniert der Export mit html2canvas perfekt.
            </p>

            <div style={{ ...featureListStyle, marginTop: '16px' }}>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>✅</span>
                <span>Instagram-Format (540×540px)</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>✅</span>
                <span>3 Slide-Typen (Title, Content, CTA)</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>✅</span>
                <span>Slide-Counter auf jedem Slide</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>✅</span>
                <span>PNG-Export pro Slide</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>✅</span>
                <span>ZIP-Download aller Slides</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>✅</span>
                <span>100% Inline-Styles (exportgerecht)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Gallery */}
        <SlideGallery
          slides={DEMO_SLIDES}
          theme={theme}
          title={`Preview mit "${currentPreset.name}" Design`}
        />
      </div>
    </>
  )
}
