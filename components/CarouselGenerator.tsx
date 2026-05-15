import { useState, useRef } from 'react'
import { DESIGN_PRESETS } from '@/types/preset'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

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

export default function CarouselGenerator() {
  const [topic, setTopic] = useState('')
  const [slideCount, setSlideCount] = useState(5)
  const [presetIndex, setPresetIndex] = useState(0)
  const [slides, setSlides] = useState<SlideData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState('')
  const [refinePrompt, setRefinePrompt] = useState('')
  const [isRefining, setIsRefining] = useState(false)

  const preset = DESIGN_PRESETS[presetIndex]

  // Inline-Editing: aktualisiert ein Feld eines Slides beim Verlassen (onBlur)
  const updateSlideField = (
    index: number,
    field: 'headline' | 'subtitle' | 'cta' | 'buttonText',
    value: string
  ) => {
    setSlides((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const updateBullet = (slideIndex: number, bulletIndex: number, value: string) => {
    setSlides((prev) => {
      const next = [...prev]
      const bullets = [...(next[slideIndex].bullets || [])]
      bullets[bulletIndex] = value
      next[slideIndex] = { ...next[slideIndex], bullets }
      return next
    })
  }

  const editableProps = (onSave: (val: string) => void) => ({
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const text = e.currentTarget.textContent || ''
      onSave(text)
    },
    style: { outline: 'none', cursor: 'text' } as React.CSSProperties,
    title: 'Klicken zum Bearbeiten',
  })

  const handleRefine = async () => {
    if (!refinePrompt.trim() || slides.length === 0) return
    setIsRefining(true)
    try {
      const response = await fetch('/api/refine-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, refinementPrompt: refinePrompt }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Refine fehlgeschlagen')
      }
      const data = await response.json()
      if (data.slides && data.slides.length > 0) {
        setSlides(data.slides)
        setRefinePrompt('')
      }
    } catch (err) {
      console.error('Refine error:', err)
      alert(
        `❌ Fehler beim Überarbeiten: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
      )
    } finally {
      setIsRefining(false)
    }
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic, slideCount }),
      })
      if (!response.ok) throw new Error('API request failed')
      const data = await response.json()
      setSlides(data.slides || [])
      // Scroll to results
      setTimeout(() => {
        document.getElementById('carousel-result')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Error:', error)
      alert('Fehler beim Generieren des Carousels')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPNG = async () => {
    setIsExporting(true)
    setExportProgress('Bereite Export vor...')
    try {
      const zip = new JSZip()
      let count = 0

      for (let i = 0; i < slides.length; i++) {
        setExportProgress(`Exportiere Slide ${i + 1} von ${slides.length}...`)
        const el = document.getElementById(`gen-slide-${i}`)
        if (!el) continue

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: preset.colors.background,
          width: 540,
          height: 540,
        })

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png', 0.95)
        })

        const num = String(i + 1).padStart(2, '0')
        zip.file(`slide-${num}.png`, blob)
        count++
      }

      setExportProgress('Erstelle ZIP...')
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `carousel-${topic.slice(0, 20).replace(/\s+/g, '-')}.zip`
      a.click()
      URL.revokeObjectURL(url)
      setExportProgress(`✅ ${count} Slides exportiert!`)
      setTimeout(() => setExportProgress(''), 3000)
    } catch (err) {
      console.error(err)
      alert('Export fehlgeschlagen')
      setExportProgress('')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPPTX = async () => {
    setIsExporting(true)
    setExportProgress('Erstelle PowerPoint...')
    try {
      const exportRequest = {
        slides: slides.map((slide) => ({
          ...slide,
          slideNumber: slide.slideNumber,
          totalSlides: slide.totalSlides,
        })),
        theme: {
          primaryColor: preset.colors.primary,
          secondaryColor: preset.colors.secondary,
          backgroundColor: preset.colors.background,
          textColor: preset.colors.text,
          accentColor: preset.colors.accent,
          headlineFont: preset.fonts.headline,
          bodyFont: preset.fonts.body,
          ctaFont: preset.fonts.cta,
        },
        carouselName: topic.slice(0, 30) || 'carousel',
      }

      const response = await fetch('/api/export-pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportRequest),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'PPTX export failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `carousel-${topic.slice(0, 20).replace(/\s+/g, '-') || 'export'}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportProgress('✅ PowerPoint heruntergeladen!')
      setTimeout(() => setExportProgress(''), 3000)
    } catch (err) {
      console.error('PPTX export error:', err)
      alert(
        `❌ Fehler beim PowerPoint-Export: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
      )
      setExportProgress('')
    } finally {
      setIsExporting(false)
    }
  }

  const renderSlide = (slide: SlideData, index: number) => {
    const bgColor = preset.colors.background
    const textColor = preset.colors.text
    const primaryColor = preset.colors.primary
    const accentColor = preset.colors.accent

    return (
      <div
        id={`gen-slide-${index}`}
        key={index}
        style={{
          width: '270px',
          height: '270px',
          backgroundColor: bgColor,
          color: textColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          position: 'relative',
          fontFamily: preset.fonts.body,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Slide Number Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: accentColor,
          color: bgColor,
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 'bold',
        }}>
          {index + 1}
        </div>

        {slide.type === 'title' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: primaryColor,
              fontFamily: preset.fonts.headline,
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}
            {...editableProps((v) => updateSlideField(index, 'headline', v))}
            >
              {slide.headline}
            </h2>
            <p
              style={{ fontSize: '12px', opacity: 0.8, margin: 0, lineHeight: 1.5 }}
              {...editableProps((v) => updateSlideField(index, 'subtitle', v))}
            >
              {slide.subtitle}
            </p>
          </div>
        )}

        {slide.type === 'content' && (
          <div style={{ width: '100%' }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 'bold',
              color: primaryColor,
              fontFamily: preset.fonts.headline,
              margin: '0 0 10px 0',
              textAlign: 'center',
            }}
            {...editableProps((v) => updateSlideField(index, 'headline', v))}
            >
              {slide.headline}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {(slide.bullets || []).map((b, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  fontSize: '11px',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                }}>
                  <span style={{ color: accentColor, marginRight: '6px', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                  <span {...editableProps((v) => updateBullet(index, i, v))}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {slide.type === 'cta' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: preset.fonts.headline,
              margin: '0 0 14px 0',
              lineHeight: 1.4,
            }}
            {...editableProps((v) => updateSlideField(index, 'cta', v))}
            >
              {slide.cta}
            </p>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: primaryColor,
                color: bgColor,
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: preset.fonts.cta,
              }}
              {...editableProps((v) => updateSlideField(index, 'buttonText', v))}
            >
              {slide.buttonText}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ec4899 0%, #ef4444 50%, #eab308 100%)', padding: '32px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Input Card */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            Instagram Carousel Generator
          </h1>
          <p style={{ color: '#6b7280', margin: '0 0 28px 0' }}>
            Erstelle wunderschöne Instagram-Karusselle mit KI
          </p>

          {/* Thema Eingabe */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>
              📝 Thema oder Blog-Post Text
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="z.B. 'Tipps für besseren Schlaf' oder füge deinen Blog-Post-Text ein..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#ec4899'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              disabled={isGenerating}
            />
          </div>

          {/* Slide Anzahl */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '12px', fontSize: '14px' }}>
              🎯 Anzahl Slides: <span style={{ color: '#ec4899', fontSize: '18px', fontWeight: 'bold' }}>{slideCount}</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>3</span>
              <input
                type="range"
                min={3}
                max={10}
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#ec4899', cursor: 'pointer', height: '6px' }}
                disabled={isGenerating}
              />
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>10</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              {[3,4,5,6,7,8,9,10].map(n => (
                <button
                  key={n}
                  onClick={() => setSlideCount(n)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: slideCount === n ? '#ec4899' : '#f3f4f6',
                    color: slideCount === n ? 'white' : '#6b7280',
                    transition: 'all 0.15s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Design Presets */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '12px', fontSize: '14px' }}>
              🎨 Design & Farben
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {DESIGN_PRESETS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPresetIndex(i)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '10px',
                    border: presetIndex === i ? `3px solid ${p.colors.primary}` : '3px solid transparent',
                    cursor: 'pointer',
                    backgroundColor: p.colors.background,
                    boxShadow: presetIndex === i ? `0 0 0 3px ${p.colors.primary}40` : '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: p.colors.primary }} />
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: p.colors.accent }} />
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: p.colors.secondary }} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: p.colors.text }}>{p.name}</div>
                  <div style={{ fontSize: '10px', color: p.colors.text, opacity: 0.7 }}>{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generieren Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            style={{
              width: '100%',
              padding: '16px',
              background: isGenerating || !topic.trim() ? '#d1d5db' : 'linear-gradient(135deg, #ec4899, #ef4444)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isGenerating || !topic.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: isGenerating || !topic.trim() ? 'none' : '0 4px 15px rgba(236,72,153,0.4)',
            }}
          >
            {isGenerating ? '⏳ Erstelle dein Carousel...' : '✨ Carousel generieren'}
          </button>
        </div>

        {/* Ergebnis */}
        {slides.length > 0 && (
          <div id="carousel-result">
            {/* Download Bar */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px 28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                  🎉 Dein Carousel ist fertig!
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                  {slides.length} Slides · Design: {preset.name}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                {exportProgress && (
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{exportProgress}</span>
                )}
                <button
                  onClick={handleExportPNG}
                  disabled={isExporting}
                  style={{
                    padding: '12px 24px',
                    background: isExporting ? '#d1d5db' : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: isExporting ? 'not-allowed' : 'pointer',
                    boxShadow: isExporting ? 'none' : '0 4px 12px rgba(124,58,237,0.4)',
                    transition: 'all 0.2s',
                  }}
                >
                  {isExporting ? '⏳ Exportiert...' : '📥 PNG (ZIP)'}
                </button>
                <button
                  onClick={handleExportPPTX}
                  disabled={isExporting}
                  style={{
                    padding: '12px 24px',
                    background: isExporting ? '#d1d5db' : 'linear-gradient(135deg, #ea580c, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: isExporting ? 'not-allowed' : 'pointer',
                    boxShadow: isExporting ? 'none' : '0 4px 12px rgba(234,88,12,0.4)',
                    transition: 'all 0.2s',
                  }}
                >
                  {isExporting ? '⏳ Exportiert...' : '📊 PPTX (PowerPoint)'}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  🔄 Neu generieren
                </button>
              </div>
            </div>

            {/* Refine Chat Bar */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px 28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              marginBottom: '20px',
            }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                🤖 KI-Überarbeitung
              </h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6b7280' }}>
                Ändere alle Slides per Anweisung – oder klicke direkt auf einen Text um ihn manuell zu bearbeiten.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isRefining && handleRefine()}
                  placeholder='z.B. "Mach die Headlines kürzer" oder "Schreib lockerer" oder "Übersetze auf Englisch"'
                  disabled={isRefining}
                  style={{
                    flex: 1,
                    minWidth: '240px',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
                <button
                  onClick={handleRefine}
                  disabled={isRefining || !refinePrompt.trim()}
                  style={{
                    padding: '12px 24px',
                    background: isRefining || !refinePrompt.trim() ? '#d1d5db' : 'linear-gradient(135deg, #7c3aed, #6366f1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: isRefining || !refinePrompt.trim() ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {isRefining ? '⏳ Überarbeitet...' : '✨ Überarbeiten'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                {['Mach die Headlines kürzer', 'Schreib lockerer & jünger', 'Übersetze auf Englisch', 'Mehr Emojis'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setRefinePrompt(suggestion)}
                    disabled={isRefining}
                    style={{
                      padding: '6px 12px',
                      background: '#f3f4f6',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: isRefining ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Slides Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '16px',
            }}>
              {slides.map((slide, i) => (
                <div
                  key={i}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                >
                  {renderSlide(slide, i)}
                  <div style={{ padding: '8px 12px', backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' }}>
                      {slide.type} · Slide {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
