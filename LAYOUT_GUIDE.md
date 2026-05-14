# Carousel Viewer Layout Guide

Responsives Two-Column Layout mit adaptiver Mobile-Ansicht (Chat wie WhatsApp unten).

## 🎬 Neue Seite: `/carousel-viewer`

Professionelle Vorschau-Umgebung mit allen Features.

```
http://localhost:3000/carousel-viewer
```

---

## 📐 Desktop Layout (>768px)

```
┌────────────────────────────────────────────────────────────┐
│ ← Zurück  📱 Carousel Viewer         📥 PNG  📊 PPTX       │
├────────────────────────┬────────────────────────────────────┤
│                        │                                    │
│  💬 Chat               │  Design: [Soft&Clean] [Bold...] │
│  (Refinements)         │                                    │
│                        │  ┌──────────────────────────────┐  │
│                        │  │                              │  │
│  📝 Message 1          │  │                              │  │
│                        │  │   540×540px Slide Preview    │  │
│  🤖 Assistant 1        │  │   (Editierbar)               │  │
│                        │  │                              │  │
│  💡 Suggestions        │  │                              │  │
│                        │  └──────────────────────────────┘  │
│  [Input Box]           │                                    │
│  [📤 Send]             │  [1][2][3][4][5] ← →              │
│                        │                                    │
└────────────────────────┴────────────────────────────────────┘
```

**Spalten:** 50% / 50%
**Chat Breite:** ~500px
**Preview Breite:** ~700px (incl. padding)

---

## 📱 Mobile Layout (<768px)

```
┌──────────────────────────────────────┐
│ ← Zurück  📱 Carousel Viewer         │
│          📥 PNG  📊 PPTX             │
├──────────────────────────────────────┤
│                                      │
│  Design: [Soft] [Bold] [Pastel]    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │    540×540px Slide Preview     │  │
│  │    (Editierbar)                │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  [1][2][3][4][5] ← →                │
│                                      │
│ ════════════════════════════════════ │ ← WhatsApp-style Chat
│ 💬 Message 1                         │
│ 🤖 Assistant Message 1               │
│ 💡 [Suggestions]                     │
│ ════════════════════════════════════ │
│ [Input Box               ] [📤 Send] │
└──────────────────────────────────────┘
```

**Spalten:** 1 Column
**Chat Höhe:** 40% viewport height (bei Focus expandierbar)
**Chat Position:** Fixed bottom (wie WhatsApp)
**Preview:** Scrollbar wenn nötig

---

## 🎯 Komponenten & Sections

### 1. Header (oben)
**Höhe:** 64px
**Inhalt:**
- Links: Zurück-Button + Titel
- Rechts: Export-Buttons (PNG, PPTX)
- Flex mit wrap für Mobile

```typescript
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
```

### 2. Chat Column (links / unten mobil)

**Desktop:**
- Breite: 50%
- Höhe: 100% - Header
- Border-Right: 1px solid
- Scroll wenn zu lang

**Mobile:**
- Breite: 100%
- Höhe: 40vh
- Position: Fixed bottom
- Border-Top: 1px solid
- WhatsApp-ähnlich

```typescript
const responsiveChatStyle: React.CSSProperties = isResponsive
  ? {
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
```

### 3. Preview Column (rechts / oben mobil)

**Desktop:**
- Breite: 50%
- Höhe: 100% - Header
- Flexbox mit Sub-Sections

**Mobile:**
- Breite: 100%
- Höhe: 60vh (minus Chat)
- marginBottom: 40vh (Platz für Chat)
- Scrollbar für lange Carousels

**Sub-Sections:**
1. **Design Presets** (12px padding)
   - Horizontal scrollbar
   - 6 Buttons zum Wechseln

2. **Slide Info** (12px padding)
   - Type Badge (Title/Content/CTA)

3. **Slide Display** (flex: 1)
   - Zentriert
   - 540×540px Slide
   - Padding: 20px
   - Scrollbar wenn größer

4. **Navigation** (12px padding)
   - Slide-Nummern [1][2][3]...
   - Vorherige/Nächste Buttons (←→)
   - Slide-Counter

---

## 🔘 Button Styles

### Back Button
```typescript
padding: '10px 16px'
backgroundColor: '#e5e7eb'
border: 'none'
borderRadius: '6px'
cursor: 'pointer'
```

### Export Buttons (PNG, PPTX)
```typescript
padding: '10px 16px'
backgroundColor: theme.primaryColor  // ← Dynamisch!
color: 'white'
border: 'none'
borderRadius: '6px'
cursor: 'pointer'
opacity: isExporting ? 0.6 : 1
```

### Design Preset Buttons
```typescript
padding: '6px 12px'
backgroundColor: isActive ? theme.primaryColor : '#f3f4f6'
color: isActive ? 'white' : '#1f2937'
fontSize: '12px'
fontWeight: 'bold'
whiteSpace: 'nowrap'
```

### Navigation Buttons [1][2][3]
```typescript
padding: '8px 12px'
backgroundColor: isActive ? theme.primaryColor : '#e5e7eb'
color: isActive ? 'white' : '#1f2937'
minWidth: '40px'
fontSize: '12px'
fontWeight: 'bold'
```

---

## 📊 Responsive Breakpoints

| Screen | Layout | Chat | Preview |
|--------|--------|------|---------|
| >768px | 2-Col  | Left | Right   |
| <768px | 1-Col  | Bottom (Fixed 40vh) | Top (60vh) |

```typescript
const isResponsive = typeof window !== 'undefined' && 
                    window.innerWidth < 768
```

---

## 💾 Exports

### PNG Export
- **Format:** ZIP mit allen PNGs
- **Größe:** 540×540px pro Slide
- **Scale:** 2x (hochauflösend)
- **Dateiname:** carousel-slides.zip

```typescript
handleExportPNG = async () => {
  // 1. Konvertiere jeden Slide zu Canvas
  // 2. Speichere als PNG
  // 3. Packe alle in ZIP
  // 4. Download als "carousel-slides.zip"
}
```

### PPTX Export
- **Format:** Microsoft PowerPoint
- **Größe:** 7.5x7.5 Inches (quadratisch)
- **Layout:** Ein Slide pro Folie
- **Dateiname:** carousel.pptx

```typescript
handleExportPPTX = async () => {
  // 1. Erstelle neue Presentation
  // 2. Layout: 7.5x7.5 (1:1 ratio)
  // 3. Konvertiere jeden Slide zu Folie
  // 4. Styles: Farben, Fonts, Content
  // 5. Download als "carousel.pptx"
}
```

---

## ⌨️ Tastatur-Navigation

| Taste | Aktion |
|-------|--------|
| ← | Vorherige Slide |
| → | Nächste Slide |
| 1-5 | Zur Slide springen |
| Enter | Chat-Nachricht senden |
| Esc | Chat Fokus verlassen |

---

## 🎨 Design-Konsistenz

### Farben (dynamisch vom Preset)
```typescript
primaryColor: theme.primaryColor      // Hauptfarbe
backgroundColor: theme.backgroundColor // Hintergrund
textColor: theme.textColor            // Text
```

### Spacing
- **Padding:** 16px (sections), 20px (containers)
- **Gap:** 12-16px (buttons)
- **Border-Radius:** 6px (buttons), 8px (containers)

### Shadows
```typescript
boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
```

---

## 📱 Mobile UX (WhatsApp-style Chat)

### Benefits der Bottom-Chat Position:
1. ✅ Vertraut (wie WhatsApp/Telegram)
2. ✅ Ergonomisch (Daumen-bedienbar)
3. ✅ Full-Screen Preview oben
4. ✅ Automatisch wenn Keyboard offen
5. ✅ Swipe-up möglich zum Expandieren

### CSS für Position:
```typescript
position: 'fixed'
bottom: 0
left: 0
right: 0
height: '40vh'
zIndex: 100        // ← Über Preview!
```

### Preview Adjustment:
```typescript
marginBottom: '40vh'  // ← Platz machen für Chat
```

---

## 🔧 Responsive Implementation

```typescript
// Erkenne Mobile
const isResponsive = typeof window !== 'undefined' && 
                    window.innerWidth < 768

// Passe Styles an
const responsiveMainStyle: React.CSSProperties = isResponsive
  ? {
      gridTemplateColumns: '1fr',      // ← 1 column
      gridTemplateRows: '1fr auto',    // ← Stack vertikal
    }
  : mainContentStyle

// Chat neu positionieren
const responsiveChatStyle: React.CSSProperties = isResponsive
  ? {
      borderRight: 'none',
      borderTop: '1px solid #e5e7eb',
      height: '40vh',
      position: 'fixed',
      bottom: 0,
      zIndex: 100,
    }
  : chatColumnStyle
```

---

## 🚀 Performance-Tipps

1. **Lazy Load Images** - Nur sichtbare Slides laden
2. **Virtualisieren** - Bei >10 Slides
3. **Memoize Preview** - ChatInput ändert nicht Preview
4. **Debounce Resize** - Window-resize Handler
5. **Optimize Exports** - Async mit Progress-Feedback

---

## 📋 Browser-Kompatibilität

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ 100% | ✅ 100% |
| Firefox | ✅ 100% | ✅ 100% |
| Safari | ✅ 100% | ✅ 100% |
| Edge | ✅ 100% | ✅ 100% |

**Wichtig:** contentEditable auf Mobile kann zögerlich sein. Desktop ist optimal.

---

## 🎯 Accessibility

- ✅ Semantic HTML (buttons, sections, etc.)
- ✅ ARIA-Labels wo nötig
- ✅ Keyboard Navigation (←→ für Slides)
- ✅ Focus Indicators
- ✅ High Contrast Text

---

## 📚 Verwendungsbeispiel

```typescript
// Route: /carousel-viewer
// Layout ist automatisch responsive

// Desktop:
// [Header mit Buttons]
// [Chat | Preview mit Navigation]

// Mobile:
// [Header mit Buttons]
// [Preview mit Design-Selector]
// [Navigation Buttons]
// [Chat-Bar unten (fixed)]

// Export funktioniert überall:
// PNG: ZIP mit allen Slides
// PPTX: PowerPoint mit Styling
```

---

Viel Spaß mit dem neuen Layout! 🎨✨
