import { useState } from 'react'
import Head from 'next/head'
import EditableSlidePreview, { SlideData, SlideTheme } from '@/components/EditableSlidePreview'
import SlideRefinementChat from '@/components/SlideRefinementChat'
import { DESIGN_PRESETS } from '@/types/preset'

const DEMO_SLIDES: SlideData[] = [
  {
    slideNumber: 1,
    totalSlides: 5,
    type: 'title',
    headline: 'Instagram Carousel Generator',
    subtitle: 'Erstelle professionelle Carousels mit KI',
  },
  {
    slideNumber: 2,
    totalSlides: 5,
    type: 'content',
    headline: '🚀 Feature 1',
    bullets: [
      'Automatische Farbextraktion von Websites',
      'Dynamische Google Fonts Integration',
      'Instagram-optimiertes 540×540px Format',
    ],
  },
  {
    slideNumber: 3,
    totalSlides: 5,
    type: 'content',
    headline: '✨ Feature 2',
    bullets: [
      'AI-gestützte Content-Generierung',
      'Multi-Mode mit Refine-Optionen',
      '6 professionelle Design-Presets',
    ],
  },
  {
    slideNumber: 4,
    totalSlides: 5,
    type: 'content',
    headline: '💾 Exports',
    bullets: [
      'PNG-Export pro Slide (hochauflösend)',
      'ZIP-Download für alle Slides',
      'JSON-Datenexport zum Archivieren',
    ],
  },
  {
    slideNumber: 5,
    totalSlides: 5,
    type: 'cta',
    cta: 'Starte jetzt und erstelle dein erstes Carousel!',
    buttonText: 'Loslegen',
  },
]

export default function SlideEditor() {
  const [slides, setSlides] = useState<SlideData[]>(DEMO_SLIDES)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
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

  const handleSlideChange = (updatedSlide: SlideData) => {
    const newSlides = [...slides]
    newSlides[currentSlideIndex] = updatedSlide
    setSlides(newSlides)
  }

  const handleSlidesRefine = (refinedSlides: SlideData[]) => {
    setSlides(refinedSlides)
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
  }

  const headerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto 24px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 12px 0',
  }

  const mainGridStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  }

  const editorColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }

  const chatColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }

  const slideContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'opacity 0.2s ease',
  }

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.primaryColor,
    color: theme.backgroundColor,
  }

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
  }

  const slideCounterStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#6b7280',
  }

  const presetSelectorStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }

  const presetButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
    backgroundColor: isActive ? theme.primaryColor : '#f3f4f6',
    color: isActive ? theme.backgroundColor : '#1f2937',
    transition: 'all 0.2s ease',
  })

  const chatWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  }

  const infoBoxStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: `2px solid ${theme.primaryColor}`,
    borderRadius: '8px',
    padding: '16px',
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
  }

  const infoBoldStyle: React.CSSProperties = {
    color: theme.primaryColor,
    fontWeight: 'bold',
  }

  return (
    <>
      <Head>
        <title>Slide Editor | Instagram Carousel Generator</title>
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
          <h1 style={titleStyle}>✏️ Slide Editor</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Bearbeite deine Slides direkt oder nutze den Chat für KI-gestützte
            Änderungen
          </p>
        </div>

        {/* Preset Selector */}
        <div style={presetSelectorStyle}>
          <span style={{ fontWeight: 'bold', color: '#1f2937' }}>
            Design:
          </span>
          {DESIGN_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => setPresetIndex(idx)}
              style={presetButtonStyle(presetIndex === idx)}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div style={mainGridStyle}>
          {/* Left Column: Editor */}
          <div style={editorColumnStyle}>
            {/* Slide Display */}
            <div style={slideContainerStyle}>
              <EditableSlidePreview
                slide={slides[currentSlideIndex]}
                theme={theme}
                onSlideChange={handleSlideChange}
                isEditing={true}
              />
            </div>

            {/* Controls */}
            <div
              style={{
                ...slideContainerStyle,
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={controlsStyle}>
                <button
                  onClick={() =>
                    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
                  }
                  disabled={currentSlideIndex === 0}
                  style={{
                    ...secondaryButtonStyle,
                    opacity: currentSlideIndex === 0 ? 0.5 : 1,
                  }}
                >
                  ← Vorher
                </button>

                <span style={slideCounterStyle}>
                  {currentSlideIndex + 1} / {slides.length}
                </span>

                <button
                  onClick={() =>
                    setCurrentSlideIndex(
                      Math.min(slides.length - 1, currentSlideIndex + 1)
                    )
                  }
                  disabled={currentSlideIndex === slides.length - 1}
                  style={{
                    ...secondaryButtonStyle,
                    opacity:
                      currentSlideIndex === slides.length - 1 ? 0.5 : 1,
                  }}
                >
                  Nächster →
                </button>

                <button style={primaryButtonStyle}>💾 Speichern</button>
                <button style={primaryButtonStyle}>📥 Exportieren</button>
              </div>
            </div>

            {/* Info Box */}
            <div style={infoBoxStyle}>
              <div>
                <span style={infoBoldStyle}>💡 Tipp:</span> Klick auf Text um
                direkt zu bearbeiten. Änderungen werden beim Weggehen
                gespeichert (onBlur).
              </div>
            </div>
          </div>

          {/* Right Column: Chat */}
          <div style={chatColumnStyle}>
            <div style={chatWrapperStyle}>
              <SlideRefinementChat
                slides={slides}
                onSlidesRefine={handleSlidesRefine}
              />
            </div>

            {/* Info Box */}
            <div style={infoBoxStyle}>
              <div>
                <span style={infoBoldStyle}>🤖 AI Refinement:</span> Nutze den
                Chat um alle Slides gleichzeitig zu ändern. Beispiele:
              </div>
              <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                <li>"Mach alle Headlines kürzer"</li>
                <li>"Übersetze alles auf Englisch"</li>
                <li>"Schreib professioneller"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
