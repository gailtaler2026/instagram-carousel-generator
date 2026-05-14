import { useState } from 'react'

export default function CarouselGenerator() {
  const [topic, setTopic] = useState('')
  const [slides, setSlides] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: topic }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      setSlides(data.slides || [])
    } catch (error) {
      console.error('Error generating carousel:', error)
      alert('Fehler beim Generieren des Carousels')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Instagram Carousel Generator
          </h1>
          <p className="text-gray-600 mb-6">
            Erstelle wunderschöne Instagram-Karusselle mit KI
          </p>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Gib ein Thema ein..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              disabled={isGenerating}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="px-8 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:bg-gray-400 transition"
            >
              {isGenerating ? 'Generiert...' : 'Generieren'}
            </button>
          </div>
        </div>

        {slides.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div
                  className="aspect-square flex items-center justify-center p-6"
                  style={{
                    background: slide.background || '#f3f4f6',
                  }}
                >
                  <div className="text-center">
                    {slide.emoji && (
                      <div className="text-6xl mb-4">{slide.emoji}</div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {slide.title}
                    </h3>
                    <p className="text-gray-600">{slide.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-500">Folie {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
