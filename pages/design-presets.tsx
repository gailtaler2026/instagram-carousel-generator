import { useState } from 'react'
import Head from 'next/head'
import { DESIGN_PRESETS, DesignPreset } from '@/types/preset'

export default function DesignPresets() {
  const [selectedPreset, setSelectedPreset] = useState<DesignPreset>(
    DESIGN_PRESETS[0]
  )
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <Head>
        <title>Design Presets | Instagram Carousel Generator</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Bebas+Neue&family=Inter:wght@300;400;600&family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;600;700&family=Merriweather:wght@300;400;700&family=Cormorant+Garamond:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              Design Presets
            </h1>
            <p className="text-lg text-gray-600">
              Wähle einen vorgefertigten Design-Stil für dein Carousel
            </p>
          </div>

          {/* Preset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {DESIGN_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset)
                  setShowDetails(true)
                }}
                className={`cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedPreset.id === preset.id ? 'ring-4 ring-blue-500' : ''
                }`}
              >
                {/* Preview */}
                <div
                  className="h-48 flex flex-col items-center justify-center p-8 relative overflow-hidden"
                  style={{
                    backgroundColor: preset.preview.bgColor,
                  }}
                >
                  {/* Decorative Elements */}
                  <div
                    className="absolute top-4 left-4 w-12 h-12 rounded-full opacity-30"
                    style={{ backgroundColor: preset.preview.accentColor }}
                  />
                  <div
                    className="absolute bottom-4 right-4 w-8 h-8 rounded opacity-30"
                    style={{ backgroundColor: preset.preview.accentColor }}
                  />

                  {/* Content */}
                  <div className="text-center z-10">
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{
                        color: preset.preview.textColor,
                        fontFamily: preset.fonts.headline,
                      }}
                    >
                      {preset.name}
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: preset.preview.textColor,
                        fontFamily: preset.fonts.body,
                        opacity: 0.8,
                      }}
                    >
                      {preset.description}
                    </p>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="p-4 bg-white">
                  <div className="flex gap-2 justify-center">
                    {[
                      preset.colors.primary,
                      preset.colors.secondary,
                      preset.colors.background,
                      preset.colors.accent,
                    ].map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Details Section */}
          {showDetails && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div
                className="h-48 flex items-end p-8 relative"
                style={{
                  backgroundColor: selectedPreset.preview.bgColor,
                }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${selectedPreset.colors.accent}, ${selectedPreset.colors.accent} 10px, transparent 10px, transparent 20px)`,
                  }}
                />
                <div className="relative z-10">
                  <h2
                    className="text-5xl font-bold mb-2"
                    style={{
                      color: selectedPreset.preview.textColor,
                      fontFamily: selectedPreset.fonts.headline,
                    }}
                  >
                    {selectedPreset.name}
                  </h2>
                  <p
                    className="text-lg"
                    style={{
                      color: selectedPreset.preview.textColor,
                      fontFamily: selectedPreset.fonts.body,
                    }}
                  >
                    {selectedPreset.description}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Colors */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      🎨 Farben
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(selectedPreset.colors).map(
                        ([key, value]) => (
                          <div key={key} className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                              style={{ backgroundColor: value }}
                            />
                            <div>
                              <p className="text-sm text-gray-500 capitalize">
                                {key === 'primary'
                                  ? 'Primär'
                                  : key === 'secondary'
                                  ? 'Sekundär'
                                  : key === 'background'
                                  ? 'Hintergrund'
                                  : key === 'text'
                                  ? 'Text'
                                  : 'Akzent'}
                              </p>
                              <p className="font-mono text-sm font-bold text-gray-700">
                                {value}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Fonts */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      ✏️ Schriftarten
                    </h3>
                    <div className="space-y-6">
                      {Object.entries(selectedPreset.fonts).map(
                        ([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-gray-500 capitalize mb-2">
                              {key === 'headline'
                                ? 'Überschrift'
                                : key === 'body'
                                ? 'Text'
                                : 'Call-to-Action'}
                            </p>
                            <p
                              className="text-xl font-bold"
                              style={{ fontFamily: value }}
                            >
                              The quick brown fox
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Spacing & Whitespace */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      📏 Abstände
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Padding</p>
                        <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-sm font-mono text-gray-700">
                            {selectedPreset.spacing.padding}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Gap (Abstand)</p>
                        <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-sm font-mono text-gray-700">
                            {selectedPreset.spacing.gap}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Zeilenhöhe
                        </p>
                        <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-sm font-mono text-gray-700">
                            {selectedPreset.spacing.lineHeight}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-12 pt-12 border-t-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8">
                    👀 Vorschau
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Title Slide */}
                    <div
                      className="aspect-square rounded-xl flex flex-col items-center justify-center p-8"
                      style={{
                        backgroundColor: selectedPreset.colors.background,
                      }}
                    >
                      <h2
                        className="text-3xl font-bold text-center mb-4"
                        style={{
                          color: selectedPreset.colors.text,
                          fontFamily: selectedPreset.fonts.headline,
                        }}
                      >
                        Instagram Carousel
                      </h2>
                      <p
                        className="text-lg text-center"
                        style={{
                          color: selectedPreset.colors.text,
                          fontFamily: selectedPreset.fonts.body,
                          opacity: 0.7,
                        }}
                      >
                        Mit diesem Design Preset
                      </p>
                    </div>

                    {/* Content Slide */}
                    <div
                      className="aspect-square rounded-xl flex flex-col justify-center p-8"
                      style={{
                        backgroundColor: selectedPreset.colors.background,
                      }}
                    >
                      <h2
                        className="text-2xl font-bold mb-6"
                        style={{
                          color: selectedPreset.colors.text,
                          fontFamily: selectedPreset.fonts.headline,
                        }}
                      >
                        Design Highlights
                      </h2>
                      <ul
                        className="space-y-3"
                        style={{
                          fontFamily: selectedPreset.fonts.body,
                          lineHeight: selectedPreset.spacing.lineHeight,
                        }}
                      >
                        <li
                          style={{
                            color: selectedPreset.colors.text,
                          }}
                        >
                          ✓ Moderne Ästhetik
                        </li>
                        <li
                          style={{
                            color: selectedPreset.colors.text,
                          }}
                        >
                          ✓ Sorgfältig ausgewählte Farben
                        </li>
                        <li
                          style={{
                            color: selectedPreset.colors.text,
                          }}
                        >
                          ✓ Professionelle Schriftarten
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-12 text-center">
                  <button
                    onClick={() => {
                      // Save to localStorage for use in carousel
                      localStorage.setItem(
                        'selectedPreset',
                        JSON.stringify(selectedPreset)
                      )
                      alert(
                        `"${selectedPreset.name}" Preset gespeichert! Gehe zu den Carousel-Seiten um ihn zu nutzen.`
                      )
                    }}
                    style={{
                      backgroundColor: selectedPreset.colors.primary,
                      color: selectedPreset.colors.background,
                    }}
                    className="px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"
                  >
                    Diesen Preset verwenden
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
