import { useState, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import EditableSlidePreview, { SlideData, SlideTheme } from '@/components/EditableSlidePreview'
import SlideRefinementChat from '@/components/SlideRefinementChat'
import { DESIGN_PRESETS } from '@/types/preset'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

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
      'Direkte Textbearbeitung auf Slides',
      'Claude-basierte Refinements',
    ],
  },
  {
    slideNumber: 4,
    totalSlides: 5,
    type: 'content',
    headline: '💾 Exports',
    bullets: [
      'PNG-Export pro Slide (hochauflösend)',
      'PowerPoint-Export aller Slides',
      'ZIP-Download für Content-Kalender',
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

export default function CarouselViewer() {
  const router = useRouter()
  const [slides, setSlides] = useState<SlideData[]>(DEMO_SLIDES)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [presetIndex, setPresetIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)

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

  // EXPORTS
  const handleExportPNG = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()
      let exportedCount = 0

      // Wait a bit for DOM to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      for (let i = 0; i < slides.length; i++) {
        const element = document.getElementById(`carousel-slide-${i}`)
        if (!element) {
          console.warn(`Slide ${i} not found in DOM`)
          continue
        }

        try {
          // Render with scale: 2 (540px * 2 = 1080x1080px)
          const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: theme.backgroundColor,
            useCORS: true,
            logging: false,
            allowTaint: true,
          })

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob)
                } else {
                  reject(new Error(`Failed to convert slide ${i} to blob`))
                }
              },
              'image/png',
              0.95
            )
          })

          zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob)
          exportedCount++
        } catch (slideError) {
          console.error(`Error exporting slide ${i}:`, slideError)
        }
      }

      if (exportedCount === 0) {
        throw new Error('Keine Slides konnten exportiert werden')
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = `carousel-slides-${slides.length}x.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 100)

      alert(
        `✅ ZIP mit ${exportedCount} Slide${exportedCount !== 1 ? 's' : ''} heruntergeladen! (1080×1080px pro Slide)`
      )
    } catch (error) {
      console.error('PNG export error:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unbekannter Fehler'
      alert(`❌ Fehler beim PNG-Export: ${errorMessage}`)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPPTX = async () => {
    setIsExporting(true)
    try {
      // Prepare request payload
      const exportRequest = {
        slides: slides.map((slide) => ({
          ...slide,
          slideNumber: slide.slideNumber,
          totalSlides: slide.totalSlides,
        })),
        theme: {
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          backgroundColor: theme.backgroundColor,
          textColor: theme.textColor,
          accentColor: theme.accentColor,
          headlineFont: theme.headlineFont,
          bodyFont: theme.bodyFont,
          ctaFont: theme.ctaFont,
        },
        carouselName: 'carousel',
      }

      // Call API endpoint
      const response = await fetch('/api/export-pptx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportRequest),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'PPTX export failed')
      }

      // Get the file blob
      const blob = await response.blob()

      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'carousel.pptx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('✅ PowerPoint erfolgreich heruntergeladen!')
    } catch (error) {
      console.error('PPTX export error:', error)
      alert(
        `❌ Fehler beim PowerPoint-Export: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handleSlideChange = (updatedSlide: SlideData) => {
    const newSlides = [...slides]
    newSlides[currentSlideIndex] = updatedSlide
    setSlides(newSlides)
  }

  const handleSlidesRefine = (refinedSlides: SlideData[]) => {
    setSlides(refinedSlides)
  }

  // STYLES
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '16px',
  }

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  }

  const headerRightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  }

  const backButtonStyle: React.CSSProperties = {
    padding: '10px 16px',
    backgroundColor: '#e5e7eb',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background-color 0.2s ease',
  }

  const exportButtonStyle: React.CSSProperties = {
    padding: '10px 16px',
    backgroundColor: currentPreset.colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: isExporting ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    opacity: isExporting ? 0.6 : 1,
    transition: 'opacity 0.2s ease',
  }

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    } as any,
  }

  const chatColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRight: '1px solid #e5e7eb',
    overflow: 'hidden',
  }

  const previewColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  }

  const previewHeaderStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  }

  const slideNavigationStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
  }

  const navButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
    backgroundColor: isActive ? currentPreset.colors.primary : '#e5e7eb',
    color: isActive ? 'white' : '#1f2937',
    transition: 'all 0.2s ease',
    minWidth: '40px',
  })

  const slideDisplayStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    overflow: 'auto',
  }

  const presetSelectorStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '12px 16px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '12px',
    fontWeight: 'bold',
  }

  const presetButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: isActive ? currentPreset.colors.primary : '#f3f4f6',
    color: isActive ? 'white' : '#1f2937',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  })

  // Media Query für Mobile
  const isResponsive = typeof window !== 'undefined' && window.innerWidth < 768

  const responsiveMainStyle: React.CSSProperties = isResponsive
    ? {
        ...mainContentStyle,
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr auto',
      }
    : mainContentStyle

  const responsiveChatStyle: React.CSSProperties = isResponsive
    ? {
        ...chatColumnStyle,
        borderRight: 'none',
        borderTop: '1px solid #e5e7eb',
        height: '40vh',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }
    : chatColumnStyle

  const responsivePreviewStyle: React.CSSProperties = isResponsive
    ? {
        ...previewColumnStyle,
        marginBottom: '40vh',
      }
    : previewColumnStyle

  return (
    <>
      <Head>
        <title>Carousel Viewer | Instagram Carousel Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Bebas+Neue&family=Inter:wght@300;400;600&family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;600;700&family=Merriweather:wght@300;400;700&family=Cormorant+Garamond:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={containerStyle}>
        {/* HEADER */}
        <div style={headerStyle}>
          <div style={headerLeftStyle}>
            <button
              style={backButtonStyle}
              onClick={() => router.back()}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#d1d5db'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#e5e7eb'
              }}
            >
              ← Zurück
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              📱 Carousel Viewer
            </h1>
          </div>

          <div style={headerRightStyle}>
            <button
              style={exportButtonStyle}
              onClick={handleExportPNG}
              disabled={isExporting}
              onMouseEnter={(e) => {
                if (!isExporting) {
                  (e.target as HTMLElement).style.opacity = '0.9'
                }
              }}
              onMouseLeave={(e) => {
                if (!isExporting) {
                  (e.target as HTMLElement).style.opacity = '1'
                }
              }}
            >
              {isExporting ? '⏳' : '📥'} PNG
            </button>
            <button
              style={exportButtonStyle}
              onClick={handleExportPPTX}
              disabled={isExporting}
              onMouseEnter={(e) => {
                if (!isExporting) {
                  (e.target as HTMLElement).style.opacity = '0.9'
                }
              }}
              onMouseLeave={(e) => {
                if (!isExporting) {
                  (e.target as HTMLElement).style.opacity = '1'
                }
              }}
            >
              {isExporting ? '⏳' : '📊'} PPTX
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={responsiveMainStyle}>
          {/* PREVIEW COLUMN (Right / Top on Mobile) */}
          <div style={responsivePreviewStyle}>
            {/* Design Presets */}
            <div style={presetSelectorStyle}>
              <span style={{ color: '#6b7280' }}>Design:</span>
              {DESIGN_PRESETS.map((preset, idx) => (
                <button
                  key={preset.id}
                  style={presetButtonStyle(presetIndex === idx)}
                  onClick={() => setPresetIndex(idx)}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Preview Header */}
            <div style={previewHeaderStyle}>
              <span style={{ fontWeight: 'bold', color: '#1f2937' }}>
                {slides[currentSlideIndex].type === 'title'
                  ? '📍 Title Slide'
                  : slides[currentSlideIndex].type === 'content'
                  ? '📝 Content Slide'
                  : '🎯 CTA Slide'}
              </span>
            </div>

            {/* Slide Display */}
            <div style={slideDisplayStyle}>
              <div id={`carousel-slide-${currentSlideIndex}`}>
                <EditableSlidePreview
                  slide={slides[currentSlideIndex]}
                  theme={theme}
                  onSlideChange={handleSlideChange}
                  isEditing={true}
                />
              </div>
            </div>

            {/* Navigation */}
            <div style={previewHeaderStyle}>
              <div style={slideNavigationStyle}>
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    style={navButtonStyle(idx === currentSlideIndex)}
                    onClick={() => setCurrentSlideIndex(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    ...navButtonStyle(false),
                    opacity:
                      currentSlideIndex === 0 ? 0.5 : 1,
                    cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() =>
                    currentSlideIndex > 0 &&
                    setCurrentSlideIndex(currentSlideIndex - 1)
                  }
                  disabled={currentSlideIndex === 0}
                >
                  ←
                </button>
                <button
                  style={{
                    ...navButtonStyle(false),
                    opacity:
                      currentSlideIndex === slides.length - 1 ? 0.5 : 1,
                    cursor:
                      currentSlideIndex === slides.length - 1
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                  onClick={() =>
                    currentSlideIndex < slides.length - 1 &&
                    setCurrentSlideIndex(currentSlideIndex + 1)
                  }
                  disabled={currentSlideIndex === slides.length - 1}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* CHAT COLUMN (Left / Bottom on Mobile) */}
          <div style={responsiveChatStyle}>
            <SlideRefinementChat
              slides={slides}
              onSlidesRefine={handleSlidesRefine}
            />
          </div>
        </div>
      </div>

      {/* OFF-SCREEN SLIDE RENDERING FOR PNG EXPORT */}
      {slides.map((slide, idx) => (
        <div
          key={`export-slide-${idx}`}
          id={`carousel-slide-${idx}`}
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            width: '540px',
            height: '540px',
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <EditableSlidePreview
            slide={slide}
            theme={theme}
            onSlideChange={() => {}}
            isEditing={false}
          />
        </div>
      ))}

      <style>{`
        @media (max-width: 768px) {
          * {
            box-sizing: border-box;
          }
        }
      `}</style>
    </>
  )
}
