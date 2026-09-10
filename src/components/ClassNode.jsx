import { useCallback, useState } from 'react'

const VISIBILITY_SYMBOLS = { public: '+', private: '-', protected: '#', package: '~' }
const CLASS_WIDTH = 220

function measureHeight(cls) {
  const headerH = cls.type === 'interface' || cls.isAbstract ? 58 : 44
  const fieldH = Math.max(cls.fields.length, 0) * 20 + (cls.fields.length > 0 ? 28 : 14)
  const methodH = Math.max(cls.methods.length, 0) * 20 + (cls.methods.length > 0 ? 28 : 14)
  return headerH + fieldH + methodH
}

export default function ClassNode({ cls, isSelected, isRelSource, onClick, onDragStart }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    let moved = false

    onDragStart(cls.id, CLASS_WIDTH / 2, measureHeight(cls) / 2)
    setIsDragging(true)

    const onMove = (me) => {
      if (Math.abs(me.clientX - startX) > 4 || Math.abs(me.clientY - startY) > 4) {
        moved = true
      }
    }

    const onUp = (ue) => {
      setIsDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      if (!moved) {
        // It was a click, not a drag
        onClick(ue)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [cls.id, onClick, onDragStart])

  const height = measureHeight(cls)

  // Colors by type
  const headerColor = cls.type === 'interface'
    ? '#1a3a30'
    : cls.isAbstract
    ? '#2a1a4a'
    : '#1a1a3a'

  const headerBorder = cls.type === 'interface'
    ? '#4ecdc4'
    : cls.isAbstract
    ? '#b47aff'
    : '#7c6af7'

  const strokeColor = isSelected
    ? '#fff'
    : isRelSource
    ? '#f7c94a'
    : headerBorder

  const strokeWidth = isSelected || isRelSource ? 2.5 : 1.5

  let y = 0

  // Header height
  const headerH = cls.type === 'interface' || cls.isAbstract ? 58 : 44

  // Fields section
  const fieldsH = cls.fields.length * 20 + 28
  // Methods section
  const methodsH = cls.methods.length * 20 + 28

  return (
    <g
      transform={`translate(${cls.x}, ${cls.y})`}
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'pointer', userSelect: 'none' }}
    >
      {/* Shadow */}
      <rect
        x="4" y="4"
        width={CLASS_WIDTH}
        height={height}
        rx="6"
        fill="rgba(0,0,0,0.4)"
      />

      {/* Main box */}
      <rect
        x="0" y="0"
        width={CLASS_WIDTH}
        height={height}
        rx="6"
        fill="#13132a"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Header background */}
      <rect
        x="0" y="0"
        width={CLASS_WIDTH}
        height={headerH}
        rx="6"
        fill={headerColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <rect
        x="0" y={headerH - 6}
        width={CLASS_WIDTH}
        height={6}
        fill={headerColor}
      />

      {/* Stereotype label */}
      {(cls.type === 'interface') && (
        <text
          x={CLASS_WIDTH / 2} y="18"
          textAnchor="middle"
          fontSize="11"
          fill="#4ecdc4"
          fontFamily="monospace"
        >
          «interface»
        </text>
      )}
      {cls.isAbstract && cls.type !== 'interface' && (
        <text
          x={CLASS_WIDTH / 2} y="18"
          textAnchor="middle"
          fontSize="11"
          fill="#b47aff"
          fontFamily="monospace"
        >
          «abstract»
        </text>
      )}

      {/* Class name */}
      <text
        x={CLASS_WIDTH / 2}
        y={cls.type === 'interface' || cls.isAbstract ? 38 : 26}
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill={cls.type === 'interface' ? '#4ecdc4' : cls.isAbstract ? '#c49aff' : '#e0e0ff'}
        fontFamily="'Segoe UI', sans-serif"
        fontStyle={cls.isAbstract ? 'italic' : 'normal'}
      >
        {cls.name}
      </text>

      {/* Fields separator */}
      <line
        x1="0" y1={headerH}
        x2={CLASS_WIDTH} y2={headerH}
        stroke={strokeColor} strokeWidth="1" opacity="0.5"
      />

      {/* Fields label */}
      <text
        x="8" y={headerH + 16}
        fontSize="10" fill="#555"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="0.5"
      >
        FIELDS
      </text>

      {/* Fields */}
      {cls.fields.map((f, i) => (
        <text
          key={f.id}
          x="10"
          y={headerH + 28 + i * 20}
          fontSize="12"
          fill="#c0c0e0"
          fontFamily="monospace"
        >
          <tspan fill={f.visibility === 'private' ? '#ff8888' : f.visibility === 'protected' ? '#ffaa44' : '#88ff88'}>
            {VISIBILITY_SYMBOLS[f.visibility] || '+'}
          </tspan>
          {` ${f.name}: ${f.type}`}
        </text>
      ))}

      {/* Methods separator */}
      <line
        x1="0" y1={headerH + fieldsH}
        x2={CLASS_WIDTH} y2={headerH + fieldsH}
        stroke={strokeColor} strokeWidth="1" opacity="0.5"
      />

      {/* Methods label */}
      <text
        x="8" y={headerH + fieldsH + 16}
        fontSize="10" fill="#555"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="0.5"
      >
        METHODS
      </text>

      {/* Methods */}
      {cls.methods.map((m, i) => (
        <text
          key={m.id}
          x="10"
          y={headerH + fieldsH + 28 + i * 20}
          fontSize="12"
          fill={m.isAbstract ? '#c49aff' : '#c0e0ff'}
          fontFamily="monospace"
          fontStyle={m.isAbstract ? 'italic' : 'normal'}
          textDecoration={m.isStatic ? 'underline' : 'none'}
        >
          <tspan fill={m.visibility === 'private' ? '#ff8888' : m.visibility === 'protected' ? '#ffaa44' : '#88ff88'}>
            {VISIBILITY_SYMBOLS[m.visibility] || '+'}
          </tspan>
          {` ${m.name}(${m.params || ''}): ${m.returnType}`}
        </text>
      ))}

      {/* Selected glow effect */}
      {isSelected && (
        <rect
          x="-2" y="-2"
          width={CLASS_WIDTH + 4}
          height={height + 4}
          rx="8"
          fill="none"
          stroke="#7c6af7"
          strokeWidth="1"
          opacity="0.4"
          strokeDasharray="6,3"
        />
      )}
    </g>
  )
}
