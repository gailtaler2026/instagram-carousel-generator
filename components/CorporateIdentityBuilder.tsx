import { useState } from 'react'
import { DesignPreset } from '@/types/preset'

export interface CorporateColors {
  primary: string
  secondary: string
  background: string
  text: string
  accent: string
}

interface CorporateIdentityBuilderProps {
  onColorsExtracted: (colors: CorporateColors, name: string) => void
  isLoading?: boolean
}

export default function CorporateIdentityBuilder({
  onColorsExtracted,
  isLoading = false,
}: CorporateIdentityBuilderProps) {
  const [mode, setMode] = useState<'url' | 'manual' | 'description' | 'logo'>(
    'manual'
  )
  const [colors, setColors] = useState<CorporateColors>({
    primary: '#7C5CE6',
    secondary: '#E8E0FF',
    background: '#F8F7FF',
    text: '#2D2D3D',
    accent: '#7C5CE6',
  })

  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // URL Mode
  const handleExtractFromUrl = async () => {
    if (!url.trim()) {
      setError('Bitte gib eine URL ein')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/extract-colors-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to extract colors')
      }

      const data = await response.json()
      setColors(data.colors)
      onColorsExtracted(data.colors, `Website: ${url}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error extracting colors')
    } finally {
      setIsProcessing(false)
    }
  }

  // Description Mode
  const handleExtractFromDescription = async () => {
    if (!description.trim()) {
      setError('Bitte beschreibe deine Corporate Identity')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/colors-from-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to extract colors')
      }

      const data = await response.json()
      setColors(data.colors)
      onColorsExtracted(data.colors, `CI: ${description}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error extracting colors')
    } finally {
      setIsProcessing(false)
    }
  }

  // Logo Mode
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Bitte wähle eine Bilddatei')
      return
    }

    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setError('')
  }

  const handleExtractFromLogo = async () => {
    if (!logoFile) {
      setError('Bitte lade ein Logo hoch')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1]
        const mimeType = logoFile.type

        try {
          const response = await fetch('/api/colors-from-logo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              imageMimeType: mimeType,
            }),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to extract colors')
          }

          const data = await response.json()
          setColors(data.colors)
          onColorsExtracted(data.colors, `Logo: ${logoFile.name}`)
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Error extracting colors'
          )
        } finally {
          setIsProcessing(false)
        }
      }
      reader.readAsDataURL(logoFile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing logo')
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        🎨 Corporate Identity Builder
      </h2>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { id: 'manual', label: '✋ Manuell', icon: '🎨' },
          { id: 'url', label: '🌐 Website', icon: '🌍' },
          { id: 'description', label: '📝 Text', icon: '✍️' },
          { id: 'logo', label: '🖼️ Logo', icon: '📸' },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => setMode(option.id as any)}
            className={`py-4 px-4 rounded-lg font-semibold transition ${
              mode === option.id
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-2xl mb-2">{option.icon}</div>
            <div className="text-sm">{option.label}</div>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Mode Content */}
      <div className="mb-8 min-h-32">
        {mode === 'manual' && (
          <div className="space-y-6">
            <p className="text-gray-600 mb-4">
              Wähle deine Unternehmensfarben manuell mit den Color-Pickern
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {key === 'primary'
                      ? 'Primär'
                      : key === 'secondary'
                      ? 'Sekundär'
                      : key === 'background'
                      ? 'Hintergrund'
                      : key === 'text'
                      ? 'Text'
                      : 'Akzent'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        setColors({ ...colors, [key]: e.target.value })
                      }
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setColors({ ...colors, [key]: e.target.value })
                      }
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => onColorsExtracted(colors, 'Manuell erstellt')}
              className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
            >
              Farben speichern
            </button>
          </div>
        )}

        {mode === 'url' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Gib eine Website-URL ein und wir extrahieren die Farben automatisch
            </p>
            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                disabled={isProcessing}
              />
              <button
                onClick={handleExtractFromUrl}
                disabled={isProcessing || !url.trim()}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:bg-gray-400 transition"
              >
                {isProcessing ? '⏳' : '🔍'} Extrahieren
              </button>
            </div>
          </div>
        )}

        {mode === 'description' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Beschreibe deine Corporate Identity und Claude generiert passende Farben
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="z.B. 'Lila, weißer Hintergrund, modern, Gold-Akzente, technisch'"
              className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              disabled={isProcessing}
            />
            <button
              onClick={handleExtractFromDescription}
              disabled={isProcessing || !description.trim()}
              className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:bg-gray-400 transition"
            >
              {isProcessing ? '⏳ Generiert...' : '✨ Farben generieren'}
            </button>
          </div>
        )}

        {mode === 'logo' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Lade dein Logo hoch und wir extrahieren die Hauptfarben
            </p>
            <div className="border-4 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {logoPreview ? (
                <div>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-32 mx-auto mb-4"
                  />
                  <p className="text-sm text-gray-600 mb-4">{logoFile?.name}</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl mb-2">📸</p>
                  <p className="text-gray-600">
                    Klick zum Hochladen oder ziehe die Datei hierher
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-input"
                disabled={isProcessing}
              />
              <label
                htmlFor="logo-input"
                className="block mt-4 cursor-pointer text-pink-500 font-semibold hover:text-pink-600"
              >
                {logoPreview ? 'Anderes Logo wählen' : 'Logo auswählen'}
              </label>
            </div>
            {logoFile && (
              <button
                onClick={handleExtractFromLogo}
                disabled={isProcessing}
                className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:bg-gray-400 transition"
              >
                {isProcessing ? '⏳ Analysiert...' : '🎨 Farben extrahieren'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Color Preview */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Vorschau</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="w-full h-20 rounded-lg border-2 border-gray-200 mb-2 shadow-sm"
                style={{ backgroundColor: value }}
              />
              <p className="text-xs font-semibold text-gray-700 capitalize">
                {key === 'primary'
                  ? 'Primär'
                  : key === 'secondary'
                  ? 'Sekundär'
                  : key === 'background'
                  ? 'BG'
                  : key === 'text'
                  ? 'Text'
                  : 'Akzent'}
              </p>
              <p className="text-xs font-mono text-gray-600">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
