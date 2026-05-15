import { useState } from 'react'
import Head from 'next/head'
import CorporateIdentityBuilder, {
  CorporateColors,
} from '@/components/CorporateIdentityBuilder'
import { GOOGLE_FONTS_LIBRARY, FontKey, loadGoogleFonts } from '@/utils/googleFonts'

interface CustomIdentity {
  name: string
  colors: CorporateColors
  fonts: {
    headline: FontKey
    body: FontKey
    cta: FontKey
  }
  description: string
}

export default function CorporateIdentityPage() {
  const [customIdentity, setCustomIdentity] = useState<CustomIdentity | null>(
    null
  )
  const [selectedHeadlineFont, setSelectedHeadlineFont] = useState<FontKey>(
    'raleway'
  )
  const [selectedBodyFont, setSelectedBodyFont] = useState<FontKey>('raleway')
  const [selectedCtaFont, setSelectedCtaFont] = useState<FontKey>('raleway')
  const [extractionSource, setExtractionSource] = useState('')

  const handleColorsExtracted = (colors: CorporateColors, source: string) => {
    setCustomIdentity({
      name: `Custom CI - ${new Date().toLocaleString('de-DE')}`,
      colors,
      fonts: {
        headline: selectedHeadlineFont,
        body: selectedBodyFont,
        cta: selectedCtaFont,
      },
      description: source,
    })
    setExtractionSource(source)
  }

  const updateFonts = (
    headline: FontKey,
    body: FontKey,
    cta: FontKey
  ) => {
    if (customIdentity) {
      setCustomIdentity({
        ...customIdentity,
        fonts: { headline, body, cta },
      })
    }
    setSelectedHeadlineFont(headline)
    setSelectedBodyFont(body)
    setSelectedCtaFont(cta)
  }

  const saveToCorporateIdentity = () => {
    if (customIdentity) {
      localStorage.setItem('corporateIdentity', JSON.stringify(customIdentity))
      alert('Corporate Identity gespeichert! Du kannst sie jetzt in deinen Carousels verwenden.')
    }
  }

  return (
    <>
      <Head>
        <title>Corporate Identity Builder | Instagram Carousel Generator</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Bebas+Neue&family=Inter:wght@300;400;600&family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;600;700&family=Merriweather:wght@300;400;700&family=Cormorant+Garamond:wght@400;600;700&family=Poppins:wght@300;400;600;700&family=Open+Sans:wght@300;400;600;700&family=Roboto:wght@300;400;500;700&family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              🎨 Corporate Identity Builder
            </h1>
            <p className="text-xl text-gray-600">
              4 Wege um deine Unternehmensfarben zu definieren
            </p>
          </div>

          {/* Main Builder */}
          <div className="mb-12">
            <CorporateIdentityBuilder
              onColorsExtracted={handleColorsExtracted}
            />
          </div>

          {/* Fonts Selection (if colors extracted) */}
          {customIdentity && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                ✏️ Schriftarten wählen
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Headline Font */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Überschriften
                  </h3>
                  <div className="space-y-3">
                    {(
                      Object.entries(GOOGLE_FONTS_LIBRARY) as [
                        FontKey,
                        (typeof GOOGLE_FONTS_LIBRARY)[FontKey],
                      ][]
                    ).map(([key, font]) => (
                      <button
                        key={key}
                        onClick={() =>
                          updateFonts(key, selectedBodyFont, selectedCtaFont)
                        }
                        className={`w-full text-left px-4 py-3 rounded-lg transition ${
                          selectedHeadlineFont === key
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          fontFamily: `'${font.name}', ${font.category}`,
                        }}
                      >
                        <p className="font-bold text-lg">{font.name}</p>
                        <p className="text-xs opacity-70">
                          {font.category}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Font */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Körpertext
                  </h3>
                  <div className="space-y-3">
                    {(
                      Object.entries(GOOGLE_FONTS_LIBRARY) as [
                        FontKey,
                        (typeof GOOGLE_FONTS_LIBRARY)[FontKey],
                      ][]
                    ).map(([key, font]) => (
                      <button
                        key={key}
                        onClick={() =>
                          updateFonts(selectedHeadlineFont, key, selectedCtaFont)
                        }
                        className={`w-full text-left px-4 py-3 rounded-lg transition ${
                          selectedBodyFont === key
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          fontFamily: `'${font.name}', ${font.category}`,
                        }}
                      >
                        <p className="font-bold text-base">{font.name}</p>
                        <p className="text-xs opacity-70">
                          The quick brown fox
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Font */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Call-to-Action
                  </h3>
                  <div className="space-y-3">
                    {(
                      Object.entries(GOOGLE_FONTS_LIBRARY) as [
                        FontKey,
                        (typeof GOOGLE_FONTS_LIBRARY)[FontKey],
                      ][]
                    ).map(([key, font]) => (
                      <button
                        key={key}
                        onClick={() =>
                          updateFonts(selectedHeadlineFont, selectedBodyFont, key)
                        }
                        className={`w-full text-left px-4 py-3 rounded-lg transition ${
                          selectedCtaFont === key
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          fontFamily: `'${font.name}', ${font.category}`,
                        }}
                      >
                        <p className="font-bold text-lg">{font.name}</p>
                        <p className="text-xs opacity-70">CLICK ME</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview & Save */}
          {customIdentity && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Preview */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div
                  className="p-12 min-h-96 flex flex-col justify-center items-center"
                  style={{
                    backgroundColor: customIdentity.colors.background,
                    color: customIdentity.colors.text,
                  }}
                >
                  <h1
                    className="text-4xl font-bold text-center mb-4"
                    style={{
                      fontFamily: `'${GOOGLE_FONTS_LIBRARY[customIdentity.fonts.headline].name}', ${GOOGLE_FONTS_LIBRARY[customIdentity.fonts.headline].category}`,
                      color: customIdentity.colors.primary,
                    }}
                  >
                    Instagram Carousel
                  </h1>
                  <p
                    className="text-lg text-center"
                    style={{
                      fontFamily: `'${GOOGLE_FONTS_LIBRARY[customIdentity.fonts.body].name}', ${GOOGLE_FONTS_LIBRARY[customIdentity.fonts.body].category}`,
                    }}
                  >
                    Mit deiner Custom Corporate Identity
                  </p>

                  <div className="mt-8 space-y-3">
                    {['✓ Professionell', '✓ Konsistent', '✓ Einzigartig'].map(
                      (item) => (
                        <p
                          key={item}
                          style={{
                            fontFamily: `'${GOOGLE_FONTS_LIBRARY[customIdentity.fonts.body].name}', ${GOOGLE_FONTS_LIBRARY[customIdentity.fonts.body].category}`,
                          }}
                        >
                          {item}
                        </p>
                      )
                    )}
                  </div>

                  <button
                    style={{
                      backgroundColor: customIdentity.colors.primary,
                      color: customIdentity.colors.background,
                      fontFamily: `'${GOOGLE_FONTS_LIBRARY[customIdentity.fonts.cta].name}', ${GOOGLE_FONTS_LIBRARY[customIdentity.fonts.cta].category}`,
                    }}
                    className="mt-8 px-8 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition"
                  >
                    Loslegen
                  </button>
                </div>
              </div>

              {/* Details & Save */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  📋 Zusammenfassung
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Quelle
                    </h3>
                    <p className="text-gray-600">{extractionSource}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-4">
                      Farben
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(customIdentity.colors).map(
                        ([key, color]) => (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div
                              className="w-8 h-8 rounded border-2 border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                            <div>
                              <p className="text-xs text-gray-500 uppercase">
                                {key}
                              </p>
                              <p className="font-mono text-sm font-bold">
                                {color}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-4">
                      Schriftarten
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Überschriften:</strong>{' '}
                        {GOOGLE_FONTS_LIBRARY[customIdentity.fonts.headline].name}
                      </p>
                      <p className="text-sm">
                        <strong>Körpertext:</strong>{' '}
                        {GOOGLE_FONTS_LIBRARY[customIdentity.fonts.body].name}
                      </p>
                      <p className="text-sm">
                        <strong>CTA:</strong>{' '}
                        {GOOGLE_FONTS_LIBRARY[customIdentity.fonts.cta].name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={saveToCorporateIdentity}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition"
                  >
                    💾 Corporate Identity speichern
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Diese Corporate Identity wird in deinem Browser gespeichert
                    und kann für alle Carousels verwendet werden
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {!customIdentity && (
            <div className="text-center bg-white rounded-xl shadow-lg p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Los geht&apos;s! 🚀
              </h2>
              <p className="text-xl text-gray-600">
                Wähle eine der 4 Methoden oben um deine Corporate Identity zu
                definieren
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
