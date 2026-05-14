# Slide Preview Komponenten

Professionelle Instagram-Carousel Slide-Vorschau mit exportfähigen Layouts. Alle Komponenten verwenden **100% inline CSS-Styles** für perfekten Export mit html2canvas.

## 🎬 Komponenten

### SlidePreview
Die Basis-Komponente für einzelne Slides.

**Größe:** 540×540px (Instagram-Standard)
**Typen:** title, content, cta
**Styles:** 100% Inline (style={{}})

```typescript
import SlidePreview from '@/components/SlidePreview'

<SlidePreview
  slide={{
    slideNumber: 1,
    totalSlides: 7,
    type: 'title',
    headline: 'Instagram Carousel',
    subtitle: 'Erstelle professionelle Carousels',
  }}
  theme={{
    primaryColor: '#7C5CE6',
    secondaryColor: '#E8E0FF',
    backgroundColor: '#F8F7FF',
    textColor: '#2D2D3D',
    accentColor: '#7C5CE6',
    headlineFont: '"Raleway", sans-serif',
    bodyFont: '"Raleway", sans-serif',
    ctaFont: '"Raleway", sans-serif',
  }}
/>
```

---

### SlideGallery
Zeigt mehrere Slides in einer Gallery an mit Export-Funktionen.

**Features:**
- Grid-Layout mit responsiven Spalten
- PNG-Export pro Slide
- ZIP-Download aller Slides
- JSON-Export der Daten
- Statistik-Info
- Einzelne Slide-Aktionen

```typescript
import SlideGallery from '@/components/SlideGallery'

<SlideGallery
  slides={[
    { slideNumber: 1, totalSlides: 7, type: 'title', ... },
    { slideNumber: 2, totalSlides: 7, type: 'content', ... },
  ]}
  theme={theme}
  title="Mein Carousel"
/>
```

---

## 📐 Slide-Typen

### 1. Title Slide
**Verwendung:** Erste Slide mit Hook

**Layout:**
```
┌──────────────────────┐
│ Farbstreifen-Header  │ (60px)
├──────────────────────┤
│                      │
│   Große Headline     │
│   (48px, bold)       │
│                      │
│   Untertitel         │
│   (24px, regular)    │
│                      │
└──────────────────────┘
```

**Props:**
```typescript
{
  type: 'title',
  headline: string      // max 40 Zeichen empfohlen
  subtitle: string      // max 60 Zeichen empfohlen
}
```

**Styles:**
- Header mit Gradient: primary → accent → secondary
- Große fette Headline in Primärfarbe
- Untertitel in halbtransparenter Textfarbe

---

### 2. Content Slide
**Verwendung:** Mehrere Slides für Inhalte

**Layout:**
```
┌──────────────────────┐
│ ═ Headline (36px)    │
├──────────────────────┤
│ ✓ Bullet Point 1     │
│ ✓ Bullet Point 2     │
│ ✓ Bullet Point 3     │
│                      │
│                      │
└──────────────────────┘
```

**Props:**
```typescript
{
  type: 'content',
  headline: string      // max 30 Zeichen
  bullets: string[]     // max 3 Bullets à max 40 Zeichen
}
```

**Styles:**
- Headline mit Primärfarbe
- Farbige Bullet-Punkte (Akzentfarbe mit ✓)
- Flexibles Spacing für verschiedene Textlängen
- Border unter Headline

---

### 3. CTA Slide
**Verwendung:** Letzte Slide mit Call-to-Action

**Layout:**
```
┌──────────────────────┐
│ CTA Text             │
│ (32px, bold)         │
│                      │
│  [ Button ]          │
│                      │
│  @yourhandle         │
│                      │
└──────────────────────┘
```

**Props:**
```typescript
{
  type: 'cta',
  cta: string           // max 80 Zeichen
  buttonText: string    // max 20 Zeichen
}
```

**Styles:**
- Voller Hintergrund in Akzentfarbe
- Weißer Text auf Akzent
- Weißer Button mit Akzentfarbe-Text
- Instagram Handle optional

---

## 🎨 Theme System

Alle Komponenten nutzen ein einheitliches Theme:

```typescript
interface SlideTheme {
  primaryColor: string      // Hauptmarkenfarbe (#RRGGBB)
  secondaryColor: string    // Zusatzfarbe
  backgroundColor: string   // Hintergrundfarbe
  textColor: string        // Standard-Textfarbe
  accentColor: string      // Hervorhebungsfarbe
  headlineFont?: string    // CSS font-family String
  bodyFont?: string        // CSS font-family String
  ctaFont?: string         // CSS font-family String
}
```

**Beispiel Theme:**
```typescript
const theme = {
  primaryColor: '#7C5CE6',
  secondaryColor: '#E8E0FF',
  backgroundColor: '#F8F7FF',
  textColor: '#2D2D3D',
  accentColor: '#7C5CE6',
  headlineFont: '"Raleway", sans-serif',
  bodyFont: '"Raleway", sans-serif',
  ctaFont: '"Raleway", sans-serif',
}
```

---

## 📊 Slide Counter

Jeder Slide zeigt einen Counter in der Top-Right:
```
"3 / 7"  ← Slide 3 von insgesamt 7
```

**Position:** Top-Right, 16px vom Rand
**Größe:** 14px, semi-transparent
**Farbe:** Textfarbe mit 0.6 Opacity (CTA: 0.8)

---

## 💾 Export-Funktionen

### PNG Export (Single Slide)
```typescript
// Wird automatisch ausgelöst beim Klick auf "📥 PNG"
// html2canvas konvertiert den DOM zu PNG
// Dateiname: slide-1.png, slide-2.png, etc.
```

**Einstellungen:**
- Scale: 2x (hochauflösend)
- Format: PNG
- Größe: 540×540px (auf dem Slide)
- Hintergrund: Theme-Hintergrundfarbe

### ZIP Export (All Slides)
```typescript
// Alle Slides werden als ZIP heruntergeladen
// Dateiname: carousel-slides.zip
```

**Inhalt:**
```
carousel-slides.zip
├── slide-1.png
├── slide-2.png
├── slide-3.png
...
└── slide-7.png
```

### JSON Export
```json
{
  "title": "Mein Carousel",
  "theme": {
    "primaryColor": "#7C5CE6",
    ...
  },
  "slides": [
    {
      "slideNumber": 1,
      "totalSlides": 7,
      "type": "title",
      "headline": "...",
      ...
    },
    ...
  ],
  "exportedAt": "2026-05-15T12:34:56.789Z"
}
```

---

## 🔧 Inline CSS Wichtig!

### ⚠️ KRITISCH FÜR EXPORT

Alle Styles MÜSSEN inline sein (style={{}}):
```typescript
// ✅ RICHTIG
const titleStyle: CSSProperties = {
  fontSize: '48px',
  fontWeight: 'bold',
  color: theme.primaryColor,
}

<h1 style={titleStyle}>{slide.headline}</h1>

// ❌ FALSCH - Funktioniert nicht!
<h1 className="slide-headline">{slide.headline}</h1>
```

**Warum?** html2canvas kann nur Inline-Styles rendern, nicht Tailwind oder externe Klassen!

---

## 📱 Responsive Verhalten

SlidePreview ist immer **exakt 540×540px**, aber die Gallery passt sich Bildschirm-Größe an:

```
Desktop (>1200px):   3 Spalten
Tablet (>768px):    2 Spalten  
Mobile (<768px):    1 Spalte
```

---

## 🚀 Demo-Seite

Teste die Komponenten auf:
```
http://localhost:3000/slide-preview-demo
```

**Demo-Features:**
- 7 Sample-Slides mit allen Typen
- 6 verschiedene Design-Presets zum Wechseln
- Live PNG-Export
- ZIP-Download aller Slides
- JSON-Export zum Analysieren

---

## 💡 Best Practices

### Texte
✅ **Headline:** 20-50 Zeichen
✅ **Subtitle:** 30-80 Zeichen
✅ **Bullets:** max 3 pro Slide, je max 40 Zeichen
✅ **CTA:** 20-80 Zeichen

### Design
✅ **Kontrast:** Mindestens 4.5:1
✅ **Farben:** Max 5 verschiedene
✅ **Fonts:** Max 3 verschiedene
✅ **Spacing:** Konsistent halten

### Export
✅ **Format:** PNG für Social Media
✅ **Größe:** 540×540px optimal für Instagram
✅ **Namenspräfixe:** slide-, carousel-, etc.
✅ **Zip-Organization:** Alle Dateien miteinander

---

## 🎯 Häufig gestellte Fragen

**F: Kann ich Bilder in Slides einfügen?**
A: Ja, als URL in ein Image-Element, aber nur mit CORS-Unterstützung.

**F: Funktioniert der Export mit Tailwind-Klassen?**
A: Nein! Nur Inline-Styles funktionieren mit html2canvas.

**F: Wie ändere ich die Slide-Größe?**
A: Ändere width/height in SlidePreview containerStyle.

**F: Kann ich Custom Slide-Typen hinzufügen?**
A: Ja! Kopiere einen bestehenden Typ und modifiziere das Layout.

**F: Wie exportiere ich mit besserer Qualität?**
A: Erhöhe die `scale` Option in html2canvas (z.B. scale: 3).

---

## 📦 Abhängigkeiten

- `html2canvas` - DOM zu Canvas/PNG
- `jszip` - ZIP-Dateien erstellen
- React 18+ - Komponenten-Framework

---

## 📄 Beispiel-Verwendung

```typescript
import { useState } from 'react'
import SlideGallery from '@/components/SlideGallery'
import { DESIGN_PRESETS } from '@/types/preset'

export default function MyCarousel() {
  const [slides] = useState([
    {
      slideNumber: 1,
      totalSlides: 3,
      type: 'title',
      headline: 'Mein Carousel',
      subtitle: 'Mit Slide Preview',
    },
    {
      slideNumber: 2,
      totalSlides: 3,
      type: 'content',
      headline: 'Content',
      bullets: ['Punkt 1', 'Punkt 2', 'Punkt 3'],
    },
    {
      slideNumber: 3,
      totalSlides: 3,
      type: 'cta',
      cta: 'Jetzt starten!',
      buttonText: 'Klick mich',
    },
  ])

  const theme = {
    primaryColor: DESIGN_PRESETS[0].colors.primary,
    secondaryColor: DESIGN_PRESETS[0].colors.secondary,
    backgroundColor: DESIGN_PRESETS[0].colors.background,
    textColor: DESIGN_PRESETS[0].colors.text,
    accentColor: DESIGN_PRESETS[0].colors.accent,
    headlineFont: DESIGN_PRESETS[0].fonts.headline,
    bodyFont: DESIGN_PRESETS[0].fonts.body,
    ctaFont: DESIGN_PRESETS[0].fonts.cta,
  }

  return (
    <SlideGallery
      slides={slides}
      theme={theme}
      title="Mein Carousel Preview"
    />
  )
}
```

---

Viel Spaß mit den Slide-Vorschau-Komponenten! 🎬✨
