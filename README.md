# Instagram Carousel Generator

Ein Next.js Projekt zum Generieren von wunderschönen Instagram-Karussellen mit KI-Unterstützung durch Anthropic Claude.

## Features

- 🎨 KI-gestützte Carousel-Generierung
- 📱 Instagram-optimierte Slide-Vorschau (1:1 Aspect Ratio)
- 🎭 Automatische Emoji- und Farb-Generierung
- 📥 Export-Funktionen (HTML, ZIP, PowerPoint)
- ⚡ Responsive Design mit Tailwind CSS

## Installation

### Voraussetzungen
- Node.js 18+ und npm/yarn

### Setup

1. **Abhängigkeiten installieren:**
```bash
npm install
```

2. **Anthropic API Key hinzufügen:**
   - Öffne `.env.local`
   - Ersetze `your_api_key_here` mit deinem echten Anthropic API Key
   - Besorge dir einen Key unter https://console.anthropic.com

3. **Entwicklungsserver starten:**
```bash
npm run dev
```

4. **Browser öffnen:**
   Navigiere zu `http://localhost:3000`

## Verwendung

1. Gib ein Thema in das Eingabefeld ein (z.B. "Produktivitäts-Tipps", "Reise nach Japan")
2. Klick auf "Generieren"
3. Die KI erstellt automatisch 5-7 Folien mit:
   - Titel
   - Beschreibung
   - Passende Emojis
   - Farbschema

## Installierte Pakete

- **@ai-sdk/anthropic** - Anthropic SDK Integration
- **ai** - AI SDK für Streaming und Completion
- **html2canvas** - Canvas-zu-Bild Konvertierung
- **jszip** - ZIP-Datei Erstellung
- **pptxgenjs** - PowerPoint-Datei Generierung

## Projekt-Struktur

```
instagram-carousel-generator/
├── pages/
│   ├── api/
│   │   └── generate.ts        # API-Endpunkt für Generierung
│   ├── _app.tsx              # Next.js App-Wrapper
│   ├── _document.tsx         # HTML-Dokument-Struktur
│   └── index.tsx             # Haupt-Seite
├── components/
│   └── CarouselGenerator.tsx  # Haupt-Komponente
├── styles/
│   └── globals.css           # Globale Stile
├── public/                   # Statische Assets
├── .env.local               # Umgebungsvariablen (gitignored)
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Nächste Schritte

- [ ] Export zu Bildern implementieren (html2canvas)
- [ ] ZIP-Download für mehrere Slides
- [ ] PowerPoint-Export mit pptxgenjs
- [ ] Slide-Bearbeitung und Customization
- [ ] Vorlagen-System
- [ ] Speichern von Favoriten

## Lizenz

MIT
