# Design Presets für Instagram Carousel Generator

Das Projekt enthält 6 vorgefertigte Design-Presets mit jeweils eigenen:
- 🎨 Farbpaletten
- ✏️ Schriftartenkombinationen
- 📏 Abstände und Spacing
- 🎯 Design-Philosophie

## Die 6 Presets

### 1. **Soft & Clean** 
**Ruhig und modern**
- **Hauptfarbe:** Lila (#7C5CE6)
- **Hintergrund:** Helles Lila (#F8F7FF)
- **Schriftarten:** Raleway (alle)
- **Vibe:** Minimalistisch, professionell, ruhig
- **Perfekt für:** SaaS, Tech, Bildung, Wellness

### 2. **Bold & Dark**
**Kontrast und Kraft**
- **Hauptfarbe:** Gelb (#FFD700) auf Schwarz (#1A1A1A)
- **Hintergrund:** Dunkelgrau/Schwarz
- **Schriftarten:** Bebas Neue (Headlines) + Inter (Body)
- **Vibe:** Modern, stark, energisch
- **Perfekt für:** Startups, Events, Marketing, Musik

### 3. **Pastel**
**Weich und verspielt**
- **Hauptfarbe:** Rosa (#FF69B4)
- **Hintergrund:** Zartes Rosa (#FFF5FB)
- **Schriftarten:** Playfair Display (Headlines) + Lato (Body)
- **Vibe:** Verspielt, feminin, freundlich
- **Perfekt für:** Beauty, Mode, Lifestyle, Creator

### 4. **Vibrant**
**Energisch und dynamisch**
- **Hauptfarbe:** Kräftiges Lila (#9D4EDD)
- **Hintergrund:** Tiefes Lila (#3C096C)
- **Schriftarten:** Montserrat (alle)
- **Vibe:** Jung, dynamisch, trendy
- **Perfekt für:** Entertainment, TikTok, Gaming, Creator

### 5. **Nature**
**Natürlich und organisch**
- **Hauptfarbe:** Grün (#2D6A4F)
- **Hintergrund:** Helles Beige (#F1FAEE)
- **Schriftarten:** Merriweather (alle, serif)
- **Vibe:** Nachhaltig, authentisch, natürlich
- **Perfekt für:** Umwelt, Bio, Wellness, Coaching

### 6. **Elegant**
**Luxuriös und zeitlos**
- **Hauptfarbe:** Gold-Braun (#A0826D)
- **Hintergrund:** Creme (#F5F1E8)
- **Schriftarten:** Cormorant Garamond (Headlines) + Raleway (Body)
- **Vibe:** Premium, klassisch, elegant
- **Perfekt für:** Luxury, Fashion, Events, Consulting

## Wie man die Presets verwendet

### 1. **Design Presets Seite** (`/design-presets`)
- Klicke auf eine Kachel um den Preset auszuwählen
- Sehe die vollständigen Details (Farben, Fonts, Abstände)
- Klick "Diesen Preset verwenden" um ihn zu speichern

### 2. **Showcase Seite** (`/presets-showcase`)
- Interaktive Vorschau aller 6 Presets
- Sehe Sample-Slides mit jedem Preset
- Detaillierte Farb- und Schriftart-Informationen

### 3. **Im Code verwenden**
```typescript
import { DESIGN_PRESETS } from '@/types/preset'
import { applyPresetToSlides } from '@/utils/applyPreset'

// Preset auf Slides anwenden
const styledSlides = applyPresetToSlides(slides, DESIGN_PRESETS[0])

// CSS-Variablen generieren
const css = getPresetCSS(DESIGN_PRESETS[0])
```

## Preset-Eigenschaften

### Colors
```typescript
{
  primary: string      // Primärfarbe
  secondary: string    // Sekundärfarbe
  background: string   // Hintergrundfarbe
  text: string        // Textfarbe
  accent: string      // Akzentfarbe
}
```

### Fonts
```typescript
{
  headline: string    // Überschriften-Schrift
  body: string       // Body-Text-Schrift
  cta: string       // Call-to-Action-Schrift
}
```

### Spacing
```typescript
{
  padding: string     // z.B. "32px"
  gap: string        // z.B. "24px"
  lineHeight: number // z.B. 1.6
}
```

## Tipps zur Verwendung

1. **Wähle den Preset zu deinem Thema:**
   - Startup? → Bold & Dark oder Vibrant
   - Coaching? → Nature oder Elegant
   - Fashion? → Pastel oder Elegant
   - Tech? → Soft & Clean oder Bold & Dark

2. **Kombiniere mit Refine-Mode:**
   - Nutze den gewählten Preset als Basis
   - Verfeinere mit Refine-Prompts (z.B. "Übersetze auf Englisch")
   - Passe Farben nach Bedarf an

3. **Farb-HEX-Codes kopieren:**
   - Alle Farben sind als HEX-Codes verfügbar
   - Verwende sie in deinen eigenen Tools
   - Erstelle Konsistenz über mehrere Carousels

## Dateistruktur

```
instagram-carousel-generator/
├── types/
│   └── preset.ts              # Preset Interface & Definitionen
├── components/
│   └── PresetSelector.tsx     # Preset-Auswahl-Komponente
├── pages/
│   ├── design-presets.tsx     # Design Presets Hauptseite
│   └── presets-showcase.tsx   # Showcase mit Beispielen
├── utils/
│   └── applyPreset.ts         # Funktionen zum Anwenden von Presets
└── PRESETS.md                 # Diese Datei
```

## Erweiterung

Du kannst eigene Presets hinzufügen:

```typescript
// In types/preset.ts
const MY_CUSTOM_PRESET: DesignPreset = {
  id: 'my-preset',
  name: 'Mein Preset',
  description: 'Meine Custom-Beschreibung',
  colors: {
    primary: '#...',
    secondary: '#...',
    background: '#...',
    text: '#...',
    accent: '#...',
  },
  fonts: {
    headline: '"MyFont", serif',
    body: '"MyFont2", sans-serif',
    cta: '"MyFont3", sans-serif',
  },
  spacing: {
    padding: '32px',
    gap: '24px',
    lineHeight: 1.6,
  },
  preview: {
    bgColor: '#...',
    textColor: '#...',
    accentColor: '#...',
  },
}

// Dann zu DESIGN_PRESETS hinzufügen
DESIGN_PRESETS.push(MY_CUSTOM_PRESET)
```

## Best Practices

✅ **Tue das:**
- Nutze die Presets als Starting Point
- Kombiniere mit Custom Refine-Prompts
- Verwende konsistente Farben über alle Slides
- Teste auf Mobilgeräten

❌ **Vermeide das:**
- Mische zu viele verschiedene Schriftarten
- Nutze zu helle Texte auf hellen Backgrounds
- Ignoriere den Preview beim Auswählen
- Ändere viele Parameter hintereinander

---

**Viel Spaß beim Design deiner Instagram Carousels!** 🎨✨
