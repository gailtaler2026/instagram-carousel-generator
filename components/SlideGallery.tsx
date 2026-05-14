import { useRef } from 'react'
import SlidePreview, { SlideData, SlideTheme } from './SlidePreview'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

interface SlideGalleryProps {
  slides: SlideData[]
  theme: SlideTheme
  title?: string
}

export default function SlideGallery({
  slides,
  theme,
  title = 'Carousel Preview',
}: SlideGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null)

  const handleExportPNG = async (slideIndex: number) => {
    const slideElement = document.getElementById(`slide-${slideIndex}`)
    if (!slideElement) return

    try {
      const canvas = await html2canvas(slideElement, {
        scale: 2,
        backgroundColor: theme.backgroundColor,
        useCORS: true,
        logging: false,
      })

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `slide-${slideIndex + 1}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting slide:', error)
      alert('Fehler beim Exportieren des Slides')
    }
  }

  const handleExportAllPNG = async () => {
    const zip = new JSZip()

    try {
      for (let i = 0; i < slides.length; i++) {
        const slideElement = document.getElementById(`slide-${i}`)
        if (!slideElement) continue

        const canvas = await html2canvas(slideElement, {
          scale: 2,
          backgroundColor: theme.backgroundColor,
          useCORS: true,
          logging: false,
        })

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob as Blob)
          }, 'image/png')
        })

        zip.file(`slide-${i + 1}.png`, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = 'carousel-slides.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting carousel:', error)
      alert('Fehler beim Exportieren des Carousels')
    }
  }

  const handleExportJSON = () => {
    const data = {
      title,
      theme,
      slides,
      exportedAt: new Date().toISOString(),
    }

    const link = document.createElement('a')
    link.href = `data:application/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`
    link.download = 'carousel-data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const containerStyle: React.CSSProperties = {
    width: '100%',
    padding: '24px',
  }

  const headerStyle: React.CSSProperties = {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  }

  const buttonsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
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

  const galleryGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  }

  const slideContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
  }

  const slideWrapperStyle: React.CSSProperties = {
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  }

  const slideActionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    width: '100%',
  }

  const actionButtonStyle: React.CSSProperties = {
    ...secondaryButtonStyle,
    flex: 1,
    fontSize: '12px',
    padding: '8px 12px',
  }

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    padding: '16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  }

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  }

  const statValueStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: theme.primaryColor,
  }

  const statLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <div style={buttonsContainerStyle}>
          <button style={primaryButtonStyle} onClick={handleExportAllPNG}>
            📥 Alle als ZIP
          </button>
          <button style={primaryButtonStyle} onClick={handleExportJSON}>
            📋 JSON Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statItemStyle}>
          <div style={statValueStyle}>{slides.length}</div>
          <div style={statLabelStyle}>Slides</div>
        </div>
        <div style={statItemStyle}>
          <div style={statValueStyle}>540×540</div>
          <div style={statLabelStyle}>Größe</div>
        </div>
        <div style={statItemStyle}>
          <div style={statValueStyle}>
            {slides.filter((s) => s.type === 'title').length}
          </div>
          <div style={statLabelStyle}>Titel-Slides</div>
        </div>
        <div style={statItemStyle}>
          <div style={statValueStyle}>
            {slides.filter((s) => s.type === 'content').length}
          </div>
          <div style={statLabelStyle}>Content-Slides</div>
        </div>
        <div style={statItemStyle}>
          <div style={statValueStyle}>
            {slides.filter((s) => s.type === 'cta').length}
          </div>
          <div style={statLabelStyle}>CTA-Slides</div>
        </div>
      </div>

      {/* Gallery */}
      <div ref={galleryRef} style={galleryGridStyle}>
        {slides.map((slide, index) => (
          <div key={index} style={slideContainerStyle}>
            <div style={slideWrapperStyle} id={`slide-${index}`}>
              <SlidePreview
                slide={{
                  ...slide,
                  slideNumber: index + 1,
                  totalSlides: slides.length,
                }}
                theme={theme}
              />
            </div>
            <div style={slideActionsStyle}>
              <button
                style={actionButtonStyle}
                onClick={() => handleExportPNG(index)}
              >
                📥 PNG
              </button>
              <button style={actionButtonStyle}>
                ✏️ Bearbeiten
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
