# Slide Editing & AI Refinement

Interaktive Slide-Bearbeitung mit direkter Textbearbeitung und KI-gestütztem Refinement durch Prompts.

## 🎬 Komponenten

### EditableSlidePreview
Vollständig editierbare Slides mit `contentEditable`.

**Features:**
- ✏️ Direkte Textbearbeitung (contentEditable)
- 💾 Auto-Save beim Verlassen (onBlur)
- 🎨 Live-Styling während der Bearbeitung
- 📍 Visual Feedback (Edit-Badge, Hintergrund-Highlight)

```typescript
import EditableSlidePreview from '@/components/EditableSlidePreview'

<EditableSlidePreview
  slide={slide}
  theme={theme}
  onSlideChange={(updated) => console.log(updated)}
  isEditing={true}
/>
```

---

### SlideRefinementChat
Chat-Interface für AI-gestützte Slide-Refinement.

**Features:**
- 💬 Einfacher Chat-Input
- 🤖 Claude-basierte Verarbeitung
- ⚡ Sofortige Updates aller Slides
- 💡 Intelligente Suggestions

```typescript
import SlideRefinementChat from '@/components/SlideRefinementChat'

<SlideRefinementChat
  slides={slides}
  onSlidesRefine={(refined) => setSides(refined)}
/>
```

---

## ✏️ Direkte Bearbeitung

### Wie es funktioniert:

1. **Click auf Text** → Text wird editierbar
2. **Tippen** → Text ändert sich direkt
3. **Click weg oder Tab** (onBlur) → Änderung wird gespeichert

### Unterstützte Texte:

| Element | Edit | Save |
|---------|------|------|
| Headline (Title) | ✅ | ✅ |
| Subtitle | ✅ | ✅ |
| Headline (Content) | ✅ | ✅ |
| Bullets | ✅ | ✅ |
| CTA Text | ✅ | ✅ |
| Button Text | ✅ | ✅ |

### Code-Beispiel:

```typescript
// Edit-Badge anzeigen
{isEditing && <div style={editableBadgeStyle}>✏️ EDIT</div>}

// Headline mit contentEditable
<h1
  style={headlineStyle}
  contentEditable={isEditing}
  onInput={(e) => handleHeadlineChange(e.currentTarget.textContent || '')}
  onBlur={handleBlur}
  suppressContentEditableWarning
>
  {localSlide.headline}
</h1>

// onBlur speichert Änderung
const handleBlur = () => {
  onSlideChange(localSlide)
}
```

---

## 🤖 KI-Refinement via Chat

### Wie es funktioniert:

1. **Schreib Anweisung** im Chat
2. **Claude analysiert** alle Slides
3. **Alle Slides werden angepasst** (basierend auf Prompt)
4. **Änderungen sind sofort sichtbar**

### Beispiel-Prompts:

```
"Mach alle Headlines kürzer"
"Übersetze alles auf Englisch"
"Schreib alles in einem lustigeren Ton"
"Nutze professionellere Sprache"
"Vereinfache alle Bullets"
"Nutze mehr Emojis"
"Schreib prägnanter"
"Mach es informativer"
```

### API-Route: `/api/refine-slides`

**Request:**
```json
{
  "slides": [
    {
      "slideNumber": 1,
      "totalSlides": 5,
      "type": "title",
      "headline": "Original Headline",
      "subtitle": "Original Subtitle"
    },
    ...
  ],
  "refinementPrompt": "Mach die Headlines kürzer"
}
```

**Response:**
```json
{
  "slides": [
    {
      "slideNumber": 1,
      "totalSlides": 5,
      "type": "title",
      "headline": "Kürzere Headline",
      "subtitle": "Angepasster Untertitel"
    },
    ...
  ]
}
```

---

## 💻 Slide Editor Seite

Vollständige Editing-Umgebung mit zwei Spalten:

```
http://localhost:3000/slide-editor
```

### Layout:

```
┌─────────────────────────────────────────┐
│  ✏️ Slide Editor                        │
├──────────────────────────┬──────────────┤
│                          │              │
│  📍 Slide Preview        │  💬 Chat    │
│  (Editierbar)            │  Refinement  │
│                          │              │
│  🎨 Controls             │  💾 Auto-   │
│  (Vorher/Nächster)       │     Save    │
│                          │              │
│  💡 Tips                 │  💡 Tips    │
│                          │              │
└──────────────────────────┴──────────────┘
```

### Features:

- ✏️ **Direkte Bearbeitung** - Alle Texte editierbar
- 💬 **Chat-Refinement** - Multiple Prompts gleichzeitig
- 🎨 **Design Presets** - 6 Designs zum Wechseln
- ⬅️➡️ **Navigation** - Durch alle Slides
- 💾 **Auto-Save** - Änderungen bei onBlur
- 🤖 **AI-Powered** - Claude-basierte Anpassungen

---

## 🔄 Editing-Workflow

### Direkter Workflow:
```
1. Öffne Slide-Editor
2. Navigiere zum gewünschten Slide
3. Klick auf Text zum Bearbeiten
4. Tippe den neuen Text
5. Click weg oder Tab → Auto-Save
```

### Chat-Workflow:
```
1. Öffne Slide-Editor
2. Gib Anweisung im Chat ein
  z.B. "Alle Headlines auf Englisch"
3. Claude bearbeitet alle Slides
4. Sehe Live-Updates rechts
5. Weitere Anpassungen möglich
```

### Kombinierter Workflow:
```
1. Nutze Chat für große Änderungen
   z.B. "Verkürze alles"
2. Fine-tune mit direkter Bearbeitung
   z.B. Click-Edit einzelner Texte
3. Nächste Chat-Verbesserung
   z.B. "Nutze mehr Emojis"
4. Repeat bis perfekt
```

---

## 📊 Editing-Features

### Visual Feedback:

**Edit Badge:** "✏️ EDIT"
```typescript
{isEditing && <div style={editableBadgeStyle}>✏️ EDIT</div>}
```

**Highlight on Focus:**
```typescript
backgroundColor: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
```

**Live Preview:**
- Änderungen sichtbar während des Tippens
- Keine Verzögerung
- WYSIWYG (What You See Is What You Get)

---

## 💾 Speichern

### Auto-Save (onBlur):
```typescript
onBlur={handleBlur}

const handleBlur = () => {
  onSlideChange(localSlide)
}
```

Wird ausgelöst wenn:
- ✅ Click außerhalb des Elements
- ✅ Tab zu anderem Element
- ✅ Enter gedrückt (bei Textarea)
- ✅ Slide zu anderem Slide

### Manuelles Speichern:
```typescript
<button onClick={() => saveSlides(slides)}>
  💾 Speichern
</button>
```

---

## 🎯 Best Practices

### Direktes Editing:
✅ **Tue das:**
- Ein Wort/Satz gleichzeitig ändern
- Direkt auf Slide klicken
- Text-Länge überprüfen
- Design-konsistenz bewahren

❌ **Vermeide das:**
- Zu viele gleichzeitige Änderungen
- Komplette Umschreibung ohne Chat
- Text länger als Original
- Bedeutung verlieren

### Chat-Refinement:
✅ **Tue das:**
- Klare, konkrete Anweisungen
- Eine große Änderung pro Prompt
- Mehrere kleine Prompts statt ein großer
- Regelmäßig Vorschau aktualisieren

❌ **Vermeide das:**
- Zu vage ("Besser machen")
- Mehrere Ziele gleichzeitig
- Zu lange Prompts
- Ignorieren der Ergebnisse

---

## 🔧 API-Details

### POST /api/refine-slides

**Headers:**
```
Content-Type: application/json
```

**Body:**
```typescript
{
  slides: SlideData[],          // Array aller Slides
  refinementPrompt: string      // User-Anweisung
}
```

**Response:**
```typescript
{
  slides?: SlideData[],         // Angepasste Slides
  error?: string                // Fehler falls vorhanden
}
```

**Error Codes:**
- 400 - Slides oder Prompt fehlend
- 405 - Nur POST erlaubt
- 500 - Server-Fehler

---

## 🎨 Styling

### Editierbarer Text:

```typescript
const bulletTextStyle: CSSProperties = {
  outline: 'none',
  padding: '4px',
  borderRadius: '4px',
  cursor: isEditing ? 'text' : 'default',
  backgroundColor: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  transition: 'background-color 0.2s ease',
}
```

### contentEditable Eigenschaften:
- ✅ Entfernt outline (outline: none)
- ✅ Zeigt Edit-Hintergrund
- ✅ Cursor wechsel
- ✅ Smooth Transition

---

## 📱 Mobile-Unterstützung

Editing funktioniert auch auf mobile:
- ✅ Touch zum Aktivieren
- ✅ Mobile Keyboard
- ✅ Text-Selection
- ✅ Copy/Paste

**Tipp:** On-Screen Keyboard ist etwas zögerlich, Desktop ist besser zum Bearbeiten.

---

## 🚀 Erweiterte Szenarien

### Batch-Editing via Chat:
```
"Mach alle 5 Slides kürzer (max 20 Zeichen Headlines)"
→ Claude bearbeitet alle Slides automatisch
```

### Tone-Änderungen:
```
"Schreib alles im Tone von Gary Vee (direkt, energisch)"
→ Alle Texte werden im neuen Tone umgeschrieben
```

### Format-Änderungen:
```
"Strukturiere Bullets mit Nummern statt Punkte"
→ "1. Punkt" statt "✓ Punkt"
```

### Sprach-Wechsel:
```
"Übersetze alles auf Französisch"
→ Komplettes Carousel auf Französisch
```

---

## ⚠️ Wichtig

### contentEditable Warnung:
React warnt vor contentEditable mit Kindern:
```typescript
suppressContentEditableWarning // ← Dieses Flag unterdrückt die Warnung
```

Das ist OK weil wir controlled Updates nutzen (onInput → State Update).

### Undo/Redo:
Browser-natives Undo/Redo funktioniert mit contentEditable:
- Ctrl+Z / Cmd+Z → Undo
- Ctrl+Y / Cmd+Y → Redo

---

## 💡 Häufig gestellte Fragen

**F: Kann ich mehrfach Edit machen hintereinander?**
A: Ja! Unlimited Edits möglich. Jeder Klick speichert die vorherige Änderung.

**F: Was ist mit Undo/Redo?**
A: Browser-natives Undo funktioniert (Ctrl+Z). Wir speichern im State.

**F: Funktioniert Formatting (Bold, Italic)?**
A: contentEditable unterstützt das, aber wir entfernen es. Nur Plain-Text.

**F: Kann ich den Chat-Verlauf speichern?**
A: Momentan nur die Slides. Chat ist transient, aber Slides werden gespeichert.

**F: Funktioniert Copy/Paste?**
A: Ja! Du kannst Text aus anderen Apps copy/pasten.

---

## 📄 Verwendungsbeispiel

```typescript
import { useState } from 'react'
import EditableSlidePreview from '@/components/EditableSlidePreview'
import SlideRefinementChat from '@/components/SlideRefinementChat'

export default function MyEditor() {
  const [slides, setSlides] = useState(INITIAL_SLIDES)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Editor Seite */}
      <EditableSlidePreview
        slide={slides[0]}
        theme={theme}
        onSlideChange={(updated) => {
          const newSlides = [...slides]
          newSlides[0] = updated
          setSlides(newSlides)
        }}
        isEditing={true}
      />

      {/* Chat Seite */}
      <SlideRefinementChat
        slides={slides}
        onSlidesRefine={setSlides}
      />
    </div>
  )
}
```

---

Viel Spaß beim Bearbeiten! 🎨✨
