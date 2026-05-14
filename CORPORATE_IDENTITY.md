# Corporate Identity Builder

Die neue **Corporate Identity Builder** Seite ermöglicht es dir, deine Unternehmensfarben auf 4 verschiedene Wege zu definieren und automatisch Schriftarten auszuwählen.

## 🎨 4 Methoden zur Farbextraktion

### 1️⃣ **Website-URL eingeben** 🌐
**Wie es funktioniert:**
- Gib die URL deiner Website ein
- Claude analysiert automatisch die HTML-Struktur und CSS
- Extrahiert die Primärfarbe, Sekundärfarbe, Hintergrund, Text und Akzent
- Liefert alle Farben als HEX-Codes

**API-Route:** `/api/extract-colors-from-url`

**Beispiel:**
```
Input: https://www.example.com
Output:
{
  "primary": "#007BFF",
  "secondary": "#E8F4F8",
  "background": "#FFFFFF",
  "text": "#333333",
  "accent": "#007BFF"
}
```

**Best für:** Bestehende Websites, Competitor-Analyse

---

### 2️⃣ **Manuell mit Color-Pickern** 🎨
**Wie es funktioniert:**
- 5 Color-Picker für jede Farbe (Primär, Sekundär, BG, Text, Akzent)
- Live Vorschau
- HEX-Codes direkt eingeben oder mit dem Picker wählen
- Sofort speichern

**Best für:** Wenn du genau weißt, welche Farben du magst

---

### 3️⃣ **Text-Beschreibung** ✍️
**Wie es funktioniert:**
- Beschreibe deine Corporate Identity in Worten
- Claude analysiert die Beschreibung und generiert passende Farben
- Berücksichtigt Farbpsychologie und Harmonie
- Stellt hohen Kontrast sicher

**API-Route:** `/api/colors-from-description`

**Beispiele für Beschreibungen:**
```
"Lila, weißer Hintergrund, modern, technisch"
"Dunkelgrün, erdig, Natur, Bio-Produkte"
"Gold-Braun, elegant, Luxus, Qualität"
"Leuchtend Rot, dynamisch, trendy, jung"
```

**Best für:** Brainstorming, schnelle Konzeptentwicklung

---

### 4️⃣ **Logo hochladen** 📸
**Wie es funktioniert:**
- Lade dein Logo-Bild hoch (JPEG, PNG, GIF, WebP)
- Claude analysiert das Bild mit Computer Vision
- Extrahiert Hauptfarben aus dem Logo
- Generiert komplementäre Farben für BG, Text, Akzente
- Stellt Kontrast und Harmonie sicher

**API-Route:** `/api/colors-from-logo`

**Best für:** Bestehende Logos, Brand-Refresh

---

## 📚 Google Fonts Integration

### Automatische Font-Auswahl
Nach der Farbextraktion kannst du aus **12+ professionellen Google Fonts** wählen:

**Serif-Fonts (klassisch/elegant):**
- Cormorant Garamond - Premium, elegant
- Merriweather - Warm, traditionell
- Playfair Display - Luxus, Kontrast
- Lora - Lesbar, klassisch

**Sans-Serif Fonts (modern/clean):**
- Raleway - Elegant, minimal
- Inter - Modern, technisch
- Montserrat - Bold, trendy
- Lato - Freundlich, lesbar
- Open Sans - Universell, sicher
- Poppins - Verspielt, modern
- Bebas Neue - Bold, Schlagzeilen
- Roboto - Google Standard
- DM Sans - Geometrisch, modern

### 3 Schriftarten Pro Preset
Jede Corporate Identity nutzt:
1. **Headline-Font** - Für Überschriften
2. **Body-Font** - Für Körpertext
3. **CTA-Font** - Für Call-to-Action Buttons

### Dynamisches Laden
Google Fonts werden automatisch in den `<head>` geladen:
```html
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
```

---

## 💾 Speichern & Verwendung

### Corporate Identity speichern
```javascript
const identity = {
  name: "Mein Unternehmen",
  colors: {
    primary: "#7C5CE6",
    secondary: "#E8E0FF",
    background: "#F8F7FF",
    text: "#2D2D3D",
    accent: "#7C5CE6"
  },
  fonts: {
    headline: "raleway",
    body: "inter",
    cta: "raleway"
  },
  description: "Website: example.com"
}

// In localStorage speichern
localStorage.setItem('corporateIdentity', JSON.stringify(identity))
```

### In Carousels verwenden
```typescript
// Im Carousel laden
const identity = JSON.parse(
  localStorage.getItem('corporateIdentity') || '{}'
)

// Farben auf Slides anwenden
const styledSlides = slides.map(slide => ({
  ...slide,
  backgroundColor: identity.colors.background,
  textColor: identity.colors.text,
  headlineFont: identity.fonts.headline,
  bodyFont: identity.fonts.body
}))
```

---

## 🔧 API-Referenz

### POST /api/extract-colors-from-url
Extrahiere Farben von einer Website.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "colors": {
    "primary": "#007BFF",
    "secondary": "#E8F4F8",
    "background": "#FFFFFF",
    "text": "#333333",
    "accent": "#007BFF"
  }
}
```

---

### POST /api/colors-from-description
Generiere Farben aus einer Text-Beschreibung.

**Request:**
```json
{
  "description": "Lila, weißer Hintergrund, modern, technisch"
}
```

**Response:**
```json
{
  "colors": {
    "primary": "#7C5CE6",
    "secondary": "#E8E0FF",
    "background": "#F8F7FF",
    "text": "#2D2D3D",
    "accent": "#7C5CE6"
  }
}
```

---

### POST /api/colors-from-logo
Extrahiere Farben aus einem Logo-Image.

**Request:**
```json
{
  "imageBase64": "data:image/png;base64,...",
  "imageMimeType": "image/png"
}
```

**Response:**
```json
{
  "colors": {
    "primary": "#FF0000",
    "secondary": "#FFCCCC",
    "background": "#FFFFFF",
    "text": "#333333",
    "accent": "#FF0000"
  }
}
```

---

## 📊 Farb-Standards

### HEX-Format
Alle Farben werden als HEX-Codes zurückgegeben:
- Format: `#RRGGBB`
- Beispiele: `#FF0000`, `#007BFF`, `#FFFFFF`

### Kontrast-Anforderungen
- Text auf Background: Mindestens 4.5:1 Kontrast (WCAG AA)
- Buttons: Mindestens 3:1 Kontrast

### Farb-Harmonie
Claude benutzt Farbtheorie zur Auswahl:
- **Komplementär:** Gegensätzliche Farben
- **Analog:** Ähnliche Farben
- **Triadic:** 3 Farben mit gleichen Abständen

---

## 💡 Best Practices

✅ **Tue das:**
- Teste die extrahierten Farben auf mehreren Elementen
- Nutze ähnliche Schriftarten für Headline und Body
- Speichere deine CI regelmäßig
- Verwende konsistente Farben in allen Carousels

❌ **Vermeide das:**
- Zu viele verschiedene Farben
- Schlecht lesbare Text/Background Kombinationen
- Zu viele verschiedene Schriftarten
- Ignoriere Kontrast-Anforderungen

---

## 📁 Dateistruktur

```
pages/
├── corporate-identity.tsx        # Hauptseite
├── api/
│   ├── extract-colors-from-url.ts    # Website-Analyse
│   ├── colors-from-description.ts    # Text → Farben
│   └── colors-from-logo.ts           # Logo-Analyse

components/
└── CorporateIdentityBuilder.tsx   # UI-Komponente

utils/
└── googleFonts.ts                 # Font-Management

CORPORATE_IDENTITY.md              # Diese Datei
```

---

## 🚀 Nächste Schritte

1. Gehe zu `/corporate-identity`
2. Wähle eine Methode zur Farbextraktion
3. Passe die Schriftarten an
4. Speichere deine Corporate Identity
5. Verwende sie in deinen Carousels!

---

**Viel Spaß beim Erstellen deiner einzigartigen Corporate Identity!** 🎨✨
