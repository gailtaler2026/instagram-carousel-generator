import { CSSProperties } from 'react'

export interface SlideData {
  slideNumber: number
  totalSlides: number
  type: 'title' | 'content' | 'cta'
  headline?: string
  subtitle?: string
  bullets?: string[]
  cta?: string
  buttonText?: string
}

export interface SlideTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  headlineFont?: string
  bodyFont?: string
  ctaFont?: string
}

interface SlidePreviewProps {
  slide: SlideData
  theme: SlideTheme
}

export default function SlidePreview({ slide, theme }: SlidePreviewProps) {
  const containerStyle: CSSProperties = {
    width: '540px',
    height: '540px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: theme.bodyFont || 'sans-serif',
    boxSizing: 'border-box',
  }

  const slideCounterStyle: CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: theme.textColor,
    opacity: 0.6,
    fontFamily: theme.bodyFont || 'sans-serif',
    zIndex: 10,
  }

  // TITLE SLIDE
  if (slide.type === 'title') {
    const colorBarStyle: CSSProperties = {
      width: '100%',
      height: '60px',
      background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor})`,
      flexShrink: 0,
    }

    const contentStyle: CSSProperties = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      textAlign: 'center',
      gap: '16px',
    }

    const headlineStyle: CSSProperties = {
      fontSize: '48px',
      fontWeight: 'bold',
      margin: 0,
      color: theme.primaryColor,
      fontFamily: theme.headlineFont || theme.bodyFont || 'sans-serif',
      lineHeight: '1.2',
      wordBreak: 'break-word',
    }

    const subtitleStyle: CSSProperties = {
      fontSize: '24px',
      margin: 0,
      color: theme.textColor,
      opacity: 0.8,
      fontFamily: theme.bodyFont || 'sans-serif',
      lineHeight: '1.4',
      wordBreak: 'break-word',
    }

    return (
      <div style={containerStyle}>
        <div style={colorBarStyle} />
        <div style={contentStyle}>
          <h1 style={headlineStyle}>{slide.headline}</h1>
          <p style={subtitleStyle}>{slide.subtitle}</p>
        </div>
        <div style={slideCounterStyle}>
          {slide.slideNumber} / {slide.totalSlides}
        </div>
      </div>
    )
  }

  // CONTENT SLIDE
  if (slide.type === 'content') {
    const headerStyle: CSSProperties = {
      padding: '32px 32px 24px 32px',
      borderBottom: `3px solid ${theme.primaryColor}`,
    }

    const headlineStyle: CSSProperties = {
      fontSize: '36px',
      fontWeight: 'bold',
      margin: '0 0 16px 0',
      color: theme.primaryColor,
      fontFamily: theme.headlineFont || theme.bodyFont || 'sans-serif',
      wordBreak: 'break-word',
    }

    const bulletListStyle: CSSProperties = {
      flex: 1,
      padding: '24px 32px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: '16px',
      overflow: 'hidden',
    }

    const bulletItemStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      fontSize: '18px',
      fontFamily: theme.bodyFont || 'sans-serif',
      lineHeight: '1.4',
      margin: 0,
      wordBreak: 'break-word',
    }

    const bulletPointStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: theme.accentColor,
      color: theme.backgroundColor,
      fontSize: '14px',
      fontWeight: 'bold',
      flexShrink: 0,
    }

    const bulletTextStyle: CSSProperties = {
      color: theme.textColor,
      margin: 0,
    }

    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={headlineStyle}>{slide.headline}</h2>
        </div>

        <div style={bulletListStyle}>
          {slide.bullets?.map((bullet, idx) => (
            <div key={idx} style={bulletItemStyle}>
              <div style={bulletPointStyle}>✓</div>
              <p style={bulletTextStyle}>{bullet}</p>
            </div>
          ))}
        </div>

        <div style={slideCounterStyle}>
          {slide.slideNumber} / {slide.totalSlides}
        </div>
      </div>
    )
  }

  // CTA SLIDE
  if (slide.type === 'cta') {
    const contentStyle: CSSProperties = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      textAlign: 'center',
      gap: '32px',
      backgroundColor: theme.accentColor,
    }

    const ctaTextStyle: CSSProperties = {
      fontSize: '32px',
      fontWeight: 'bold',
      margin: 0,
      color: theme.backgroundColor,
      fontFamily: theme.headlineFont || theme.bodyFont || 'sans-serif',
      lineHeight: '1.4',
      wordBreak: 'break-word',
    }

    const buttonStyle: CSSProperties = {
      backgroundColor: theme.backgroundColor,
      color: theme.accentColor,
      padding: '16px 40px',
      fontSize: '20px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontFamily: theme.ctaFont || theme.bodyFont || 'sans-serif',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      transition: 'transform 0.2s ease',
    }

    const handleStyle: CSSProperties = {
      marginTop: '24px',
      fontSize: '18px',
      color: theme.backgroundColor,
      opacity: 0.9,
      fontFamily: theme.bodyFont || 'sans-serif',
      fontWeight: '500',
    }

    return (
      <div
        style={{
          ...containerStyle,
          backgroundColor: theme.accentColor,
        }}
      >
        <div style={contentStyle}>
          <h2 style={ctaTextStyle}>{slide.cta}</h2>

          <button style={buttonStyle}>{slide.buttonText}</button>

          <p style={handleStyle}>@yourhandle</p>
        </div>

        <div
          style={{
            ...slideCounterStyle,
            color: theme.backgroundColor,
            opacity: 0.8,
          }}
        >
          {slide.slideNumber} / {slide.totalSlides}
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={slideCounterStyle}>
        {slide.slideNumber} / {slide.totalSlides}
      </div>
    </div>
  )
}
