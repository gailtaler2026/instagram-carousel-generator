import { useState } from 'react'
import Head from 'next/head'

interface Slide {
  slideNumber: number
  type: 'title' | 'content' | 'cta'
  headline?: string
  subtitle?: string
  bullets?: string[]
  cta?: string
  buttonText?: string
}

export default function CarouselFromBlog() {
  const [blogPost, setBlogPost] = useState('')
  const [slideCount, setSlideCount] = useState(5)
  const [slides, setSlides] = useState<Slide[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [refinePrompt, setRefinePrompt] = useState('')
  const [showRefineMode, setShowRefineMode] = useState(false)

  const handleGenerate = async () => {
    if (!blogPost.trim()) {
      setError('Bitte gib einen Blog-Post ein')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blogPost, slideCount }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API request failed')
      }

      const data = await response.json()
      setSlides(data.slides || [])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error generating carousel'
      setError(message)
      console.error('Error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefine = async () => {
    if (!refinePrompt.trim()) {
      setError('Bitte gib eine Verbesserungsanweisung ein')
      return
    }

    if (slides.length === 0) {
      setError('Bitte generiere zuerst ein Carousel')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refinePrompt,
          currentSlides: slides
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API request failed')
      }

      const data = await response.json()
      setSlides(data.slides || [])
      setRefinePrompt('')
      setShowRefineMode(false)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error refining carousel'
      setError(message)
      console.error('Error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Head>
        <title>Blog zu Carousel | Instagram Generator</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Blog zu Instagram Carousel
            </h1>
            <p className="text-gray-600 mb-6">
              Verwandle deinen Blog-Post in ein fertiges Instagram-Karussell
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog-Post Text:
                </label>
                <textarea
                  value={blogPost}
                  onChange={(e) => setBlogPost(e.target.value)}
                  placeholder="Gib deinen Blog-Post hier ein..."
                  className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 font-mono text-sm"
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {blogPost.length} Zeichen
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Anzahl der Slides:
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={slideCount}
                    onChange={(e) =>
                      setSlideCount(Math.max(3, Math.min(10, parseInt(e.target.value))))
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    (Minimum 3, Maximum 10)
                  </p>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !blogPost.trim()}
                    className="w-full px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 transition"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">⏳</span>
                        Generiert...
                      </span>
                    ) : (
                      'Carousel generieren'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {slides.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Dein Carousel ({slides.length} Slides)
                </h2>
                <button
                  onClick={() => setShowRefineMode(!showRefineMode)}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  {showRefineMode ? '✖ Abbrechen' : '✏️ Verfeinern'}
                </button>
              </div>

              {showRefineMode && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Refine Mode - Carousel anpassen
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Anweisung:
                      </label>
                      <input
                        type="text"
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleRefine()
                        }
                        placeholder="z.B. 'Übersetze auf Englisch' oder 'Hintergrund grün' oder 'Mach es lustiger'"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                        disabled={isGenerating}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleRefine}
                        disabled={isGenerating || !refinePrompt.trim()}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 transition"
                      >
                        {isGenerating ? (
                          <span className="flex items-center justify-center">
                            <span className="animate-spin mr-2">⏳</span>
                            Verfeinert...
                          </span>
                        ) : (
                          'Verfeinern'
                        )}
                      </button>
                      <button
                        onClick={() => setShowRefineMode(false)}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
                      >
                        Abbrechen
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                      <p className="font-semibold mb-2">Beispiele:</p>
                      <ul className="space-y-1">
                        <li>• &quot;Übersetze alles auf Englisch&quot;</li>
                        <li>• &quot;Mach die Hintergrundfarben grün (#00AA00)&quot;</li>
                        <li>• &quot;Mach den Text größer und fetter&quot;</li>
                        <li>• &quot;Füge Emojis hinzu&quot;</li>
                        <li>• &quot;Schreib es in einem lustigen Ton&quot;</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide) => (
                  <div
                    key={slide.slideNumber}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
                  >
                    <div
                      className="aspect-square flex flex-col items-center justify-center p-6"
                      style={{
                        backgroundColor:
                          slide.backgroundColor ||
                          slide.background ||
                          '#f3f4f6',
                        color: slide.textColor || '#1f2937',
                      }}
                    >
                      {/* Slide Badge */}
                      <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Slide {slide.slideNumber}
                      </div>

                      {slide.type === 'title' && (
                        <div className="text-center space-y-4">
                          <h3 className="text-3xl font-bold text-gray-800">
                            {slide.headline}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {slide.subtitle}
                          </p>
                        </div>
                      )}

                      {slide.type === 'content' && (
                        <div className="w-full space-y-4">
                          <h3 className="text-2xl font-bold text-gray-800 text-center">
                            {slide.headline}
                          </h3>
                          <ul className="space-y-2">
                            {slide.bullets?.map((bullet, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm text-gray-700"
                              >
                                <span className="mr-2 font-bold text-pink-500">
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
                          <p className="text-lg text-gray-800 font-semibold">
                            {slide.cta}
                          </p>
                          <button className="px-6 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition">
                            {slide.buttonText}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Info Footer */}
                    <div className="p-4 bg-gray-50 border-t">
                      <p className="text-xs text-gray-600 font-semibold mb-2">
                        {slide.type.toUpperCase()} • Slide {slide.slideNumber}
                      </p>
                      {(slide.backgroundColor ||
                        slide.textColor ||
                        slide.accentColor) && (
                        <div className="flex gap-2 flex-wrap">
                          {slide.backgroundColor && (
                            <div className="flex items-center gap-1 text-xs">
                              <div
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: slide.backgroundColor }}
                              />
                              <span className="text-gray-600">
                                {slide.backgroundColor}
                              </span>
                            </div>
                          )}
                          {slide.textColor && (
                            <div className="flex items-center gap-1 text-xs">
                              <div
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: slide.textColor }}
                              />
                              <span className="text-gray-600">
                                Text: {slide.textColor}
                              </span>
                            </div>
                          )}
                          {slide.accentColor && (
                            <div className="flex items-center gap-1 text-xs">
                              <div
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: slide.accentColor }}
                              />
                              <span className="text-gray-600">
                                Accent: {slide.accentColor}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* JSON Export */}
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  JSON Export:
                </h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                  {JSON.stringify(slides, null, 2)}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(slides, null, 2))
                    alert('JSON in Zwischenablage kopiert!')
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                >
                  In Zwischenablage kopieren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
