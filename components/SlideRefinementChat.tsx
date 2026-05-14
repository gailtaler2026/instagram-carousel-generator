import { useState, useRef, useEffect } from 'react'
import { SlideData } from './EditableSlidePreview'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SlideRefinementChatProps {
  slides: SlideData[]
  onSlidesRefine: (refinedSlides: SlideData[]) => void
  isLoading?: boolean
}

export default function SlideRefinementChat({
  slides,
  onSlidesRefine,
  isLoading = false,
}: SlideRefinementChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      content:
        '🤖 Hallo! Ich kann deine Slides verfeinern. Gib mir Anweisungen wie: "Mach die Headlines kürzer", "Übersetze alles auf Englisch" oder "Schreib alles in einem lustigen Ton".',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      // Call refinement API
      const response = await fetch('/api/refine-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides,
          refinementPrompt: input,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to refine slides')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Update slides
      onSlidesRefine(data.slides)

      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `✅ Deine Slides wurden aktualisiert! Ich habe ${data.slides.filter((s: SlideData) => s.headline || s.cta).length} Slides angepasst.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `❌ Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  }

  const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#f9fafb',
  }

  const messageStyle = (type: 'user' | 'assistant'): React.CSSProperties => ({
    display: 'flex',
    justifyContent: type === 'user' ? 'flex-end' : 'flex-start',
    gap: '8px',
  })

  const messageBubbleStyle = (
    type: 'user' | 'assistant'
  ): React.CSSProperties => ({
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: type === 'user' ? '#007BFF' : '#e5e7eb',
    color: type === 'user' ? '#ffffff' : '#1f2937',
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  })

  const inputContainerStyle: React.CSSProperties = {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '8px',
    backgroundColor: '#ffffff',
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 14px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  }

  const inputStyleFocused: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#007BFF',
  }

  const [isFocused, setIsFocused] = useState(false)

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: isProcessing || isLoading ? 'not-allowed' : 'pointer',
    opacity: isProcessing || isLoading ? 0.6 : 1,
    transition: 'opacity 0.2s ease',
    fontSize: '14px',
  }

  const timestampStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px',
  }

  const suggestionStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '8px',
    fontStyle: 'italic',
  }

  const suggestionsContainerStyle: React.CSSProperties = {
    padding: '0 16px 12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid #e5e7eb',
  }

  const suggestionButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  }

  const suggestions = [
    'Mach die Headlines kürzer',
    'Übersetze alles auf Englisch',
    'Schreib alles in einem lustigen Ton',
    'Nutze professionellere Sprache',
    'Schreib alles einfacher',
    'Nutze mehr Emojis',
  ]

  return (
    <div style={containerStyle}>
      {/* Messages */}
      <div style={messagesContainerStyle}>
        {messages.map((message) => (
          <div key={message.id} style={messageStyle(message.type)}>
            <div style={messageBubbleStyle(message.type)}>
              <div>{message.content}</div>
              <div style={timestampStyle}>
                {message.timestamp.toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div style={messageStyle('assistant')}>
            <div style={messageBubbleStyle('assistant')}>
              <div>⏳ Verarbeitet deine Anfrage...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 5 && (
        <div style={suggestionsContainerStyle}>
          <div style={suggestionStyle}>💡 Beispiele:</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {suggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                style={suggestionButtonStyle}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#f3f4f6'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Gib eine Anweisung ein..."
          style={isFocused ? inputStyleFocused : inputStyle}
          disabled={isProcessing || isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isProcessing || isLoading || !input.trim()}
          style={buttonStyle}
        >
          {isProcessing ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  )
}
