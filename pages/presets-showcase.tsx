import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { DESIGN_PRESETS } from '@/types/preset'

interface SampleSlide {
  slideNumber: number
  type: 'title' | 'content' | 'cta'
  headline?: string
  subtitle?: string
  bullets?: string[]
  cta?: string
  buttonText?: string
}

const SAMPLE_SLIDES: SampleSlide[] = [
  {
    slideNumber: 1,
    type: 'title',
    headline: 'Instagram Carousel',
    subtitle: 'Mit Design Presets',
  },
  {
    slideNumber: 2,
    type: 'content',
    headline: 'Feature 1',
    bullets: [
      'Professionelle Designs',
      'Schnell anwendbar',
      'Voll anpassbar',
    ],
  },
  {
    slideNumber: 3,
    type: 'content',
    headline: 'Feature 2',
    bullets: [
      'Modern und elegant',
      'Mobile optimiert',
      'Ready to use',
    ],
  },
  {
    slideNumber: 4,
    type: 'cta',
    cta: 'Starte jetzt mit einem Preset!',
    buttonText: 'Loslegen',
  },
]

export default function PresetsShowcase() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <Head>
        <title>Presets Showcase | Instagram Carousel Generator</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Bebas+Neue&family=Inter:wght@300;400;600&family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;600;700&family=Merriweather:wght@300;400;700&family=Cormorant+Garamond:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Design Presets Showcase
            </h1>
            <p className="text-xl text-gray-600">
              Siehe alle 6 Presets in Aktion mit Sample-Slides
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {DESIGN_PRESETS.map((preset, idx) => (
              <button
                key={preset.id}
                onClick={() => setActiveTab(idx)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === idx
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Carousel Display */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {DESIGN_PRESETS[activeTab].name} - {DESIGN_PRESETS[activeTab].description}
            </h2>

            {/* Sample Carousel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SAMPLE_SLIDES.map((slide) => {
                const preset = DESIGN_PRESETS[activeTab]
                return (
                  <div
                    key={slide.slideNumber}
                    className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
                  >
                    <div
                      className="aspect-square flex flex-col items-center justify-center p-6"
                      style={{
                        backgroundColor: preset.colors.background,
                        color: preset.colors.text,
                        fontFamily: preset.fonts.body,
                      }}
                    >
                      {/* Badge */}
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: preset.colors.accent,
                          color: preset.colors.background,
                        }}
                      >
                        Slide {slide.slideNumber}
                      </div>

                      {slide.type === 'title' && (
                        <div className="text-center space-y-4">
                          <h3
                            className="text-3xl font-bold"
                            style={{
                              fontFamily: preset.fonts.headline,
                            }}
                          >
                            {slide.headline}
                          </h3>
                          <p
                            style={{
                              fontFamily: preset.fonts.body,
                              fontSize: '16px',
                              opacity: 0.8,
                            }}
                          >
                            {slide.subtitle}
                          </p>
                        </div>
                      )}

                      {slide.type === 'content' && (
                        <div className="w-full space-y-4">
                          <h3
                            className="text-2xl font-bold text-center"
                            style={{
                              fontFamily: preset.fonts.headline,
                            }}
                          >
                            {slide.headline}
                          </h3>
                          <ul className="space-y-2">
                            {slide.bullets?.map((bullet, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm"
                                style={{
                                  fontFamily: preset.fonts.body,
                                }}
                              >
                                <span
                                  className="mr-2 font-bold"
                                  style={{
                                    color: preset.colors.accent,
                                  }}
                                >
                                  ✓
                                </span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {slide.type === 'cta' && (
                        <div className="text-center space-y-6">
                          <p
                            className="text-lg font-semibold"
                            style={{
                              fontFamily: preset.fonts.headline,
                            }}
                          >
                            {slide.cta}
                          </p>
                          <button
                            style={{
                              backgroundColor: preset.colors.accent,
                              color: preset.colors.background,
                              fontFamily: preset.fonts.cta,
                            }}
                            className="px-6 py-3 rounded-lg font-bold hover:opacity-90 transition"
                          >
                            {slide.buttonText}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Preset Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Colors */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">🎨 Farben</h3>
              <div className="space-y-4">
                {Object.entries(DESIGN_PRESETS[activeTab].colors).map(
                  ([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded border-2 border-gray-200"
                        style={{ backgroundColor: value }}
                      />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {key}
                        </p>
                        <p className="font-mono font-bold text-gray-700">
                          {value}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Fonts */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">✏️ Schriftarten</h3>
              <div className="space-y-6">
                {Object.entries(DESIGN_PRESETS[activeTab].fonts).map(
                  ([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {key}
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{ fontFamily: value }}
                      >
                        Sample Text
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {value}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Spacing */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">📏 Abstände</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Padding
                  </p>
                  <div className="bg-gray-100 p-4 rounded border-2 border-dashed border-gray-300">
                    <p className="font-mono font-bold text-gray-700">
                      {DESIGN_PRESETS[activeTab].spacing.padding}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Gap
                  </p>
                  <div className="bg-gray-100 p-4 rounded border-2 border-dashed border-gray-300">
                    <p className="font-mono font-bold text-gray-700">
                      {DESIGN_PRESETS[activeTab].spacing.gap}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Zeilenhöhe
                  </p>
                  <div className="bg-gray-100 p-4 rounded border-2 border-dashed border-gray-300">
                    <p className="font-mono font-bold text-gray-700">
                      {DESIGN_PRESETS[activeTab].spacing.lineHeight}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Bereit, einen Preset zu verwenden?
            </h3>
            <p className="text-lg mb-6">
              Gehe zu Design Presets um {DESIGN_PRESETS[activeTab].name} zu verwenden!
            </p>
            <Link
              href="/design-presets"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Zu den Design Presets →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
