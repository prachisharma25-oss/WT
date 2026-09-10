import { useState } from 'react'

const CLASS_WIDTH = 220

function getCenter(cls) {
  // Rough height calculation
  const headerH = cls.type === 'interface' || cls.isAbstract ? 58 : 44
  const fieldsH = cls.fields.length * 20 + 28
  const methodsH = cls.methods.length * 20 + 28
  const h = headerH + fieldsH + methodsH
  return {
    x: cls.x + CLASS_WIDTH / 2,
    y: cls.y + h / 2,
    w: CLASS_WIDTH,
    h,
    left: cls.x,
    right: cls.x + CLASS_WIDTH,
    top: cls.y,
    bottom: cls.y + h,
  }
}

function getEdgePoint(from, to) {
  // Find intersection of line from center(from) to center(to) with from's bounding box
  const cx = from.x, cy = from.y
  const tx = to.x, ty = to.y
  const dx = tx - cx, dy = ty - cy

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return { x: cx, y: cy }

  const hw = from.w / 2 + 4
  const hh = from.h / 2 + 4

  const tRight = hw / Math.abs(dx)
  const tTop = hh / Math.abs(dy)
  const t = Math.min(tRight, tTop)

  return {
    x: cx + dx * t,
    y: cy + dy * t,
  }
}

const REL_STYLES = {
  inheritance:  { stroke: '#7c6af7', dash: '', markerEnd: 'url(#arrow-inherit)', markerStart: '' },
  implementation: { stroke: '#4ecdc4', dash: '8,4', markerEnd: 'url(#arrow-implement)', markerStart: '' },
  association:  { stroke: '#f7c94a', dash: '', markerEnd: 'url(#arrow-association)', markerStart: '' },
  dependency:   { stroke: '#ff6b6b', dash: '6,3', markerEnd: 'url(#arrow-dependency)', markerStart: '' },
  aggregation:  { stroke: '#a8e6cf', dash: '', markerEnd: 'url(#arrow-association)', markerStart: 'url(#diamond-agg)' },
  composition:  { stroke: '#ffaaa5', dash: '', markerEnd: 'url(#arrow-association)', markerStart: 'url(#diamond-comp)' },
}

export default function RelationshipLine({ relationship, fromClass, toClass, onDelete }) {
  const [hovered, setHovered] = useState(false)

  const from = getCenter(fromClass)
  const to = getCenter(toClass)
  const p1 = getEdgePoint(from, to)
  const p2 = getEdgePoint(to, from)

  const style = REL_STYLES[relationship.type] || REL_STYLES.association

  // Midpoint for label
  const mx = (p1.x + p2.x) / 2
  const my = (p1.y + p2.y) / 2

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onDelete(relationship.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Wide invisible hit area */}
      <line
        x1={p1.x} y1={p1.y}
        x2={p2.x} y2={p2.y}
        stroke="transparent"
        strokeWidth="16"
      />

      {/* Actual line */}
      <line
        x1={p1.x} y1={p1.y}
        x2={p2.x} y2={p2.y}
        stroke={hovered ? '#fff' : style.stroke}
        strokeWidth={hovered ? 2.5 : 1.8}
        strokeDasharray={style.dash}
        markerEnd={style.markerEnd}
        markerStart={style.markerStart}
        opacity={hovered ? 1 : 0.85}
      />

      {/* Relationship type badge */}
      <rect
        x={mx - 30} y={my - 10}
        width="60" height="18"
        rx="4"
        fill={hovered ? '#3a1a1a' : '#1a1a2e'}
        stroke={hovered ? '#ff6b6b' : style.stroke}
        strokeWidth="1"
        opacity="0.9"
      />
      <text
        x={mx} y={my + 4}
        textAnchor="middle"
        fontSize="10"
        fill={hovered ? '#ff9999' : style.stroke}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {hovered ? '✕ delete' : (relationship.label || relationship.type)}
      </text>
    </g>
  )
}
