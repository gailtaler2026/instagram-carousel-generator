import { DESIGN_PRESETS, DesignPreset } from '@/types/preset'
import { useState } from 'react'

interface PresetSelectorProps {
  onPresetSelect: (preset: DesignPreset) => void
  selectedPreset?: DesignPreset
}

export default function PresetSelector({
  onPresetSelect,
  selectedPreset,
}: PresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentPreset =
    selectedPreset || DESIGN_PRESETS[0]

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-pink-500 transition flex items-center justify-between font-semibold text-gray-700"
      >
        <span>
          🎨 {currentPreset.name}
        </span>
        <span className="text-xl">{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-2xl border-2 border-pink-500 overflow-hidden z-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 max-h-96 overflow-y-auto">
          {DESIGN_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onPresetSelect(preset)
                setIsOpen(false)
              }}
              className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                currentPreset.id === preset.id
                  ? 'ring-2 ring-blue-500'
                  : 'hover:shadow-lg'
              }`}
            >
              {/* Mini Preview */}
              <div
                className="h-24 flex flex-col items-center justify-center p-3 relative"
                style={{
                  backgroundColor: preset.preview.bgColor,
                }}
              >
                <h4
                  className="text-sm font-bold text-center"
                  style={{
                    color: preset.preview.textColor,
                    fontFamily: preset.fonts.headline,
                  }}
                >
                  {preset.name}
                </h4>
                <p
                  className="text-xs mt-1"
                  style={{
                    color: preset.preview.textColor,
                    opacity: 0.7,
                  }}
                >
                  {preset.description}
                </p>
              </div>

              {/* Color Dots */}
              <div className="bg-white p-2 flex gap-2 justify-center">
                {[
                  preset.colors.primary,
                  preset.colors.secondary,
                  preset.colors.accent,
                ].map((color, idx) => (
                  <div
                    key={idx}
                    className="w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
