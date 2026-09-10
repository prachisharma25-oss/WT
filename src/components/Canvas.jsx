import { useRef, useState, useCallback, useEffect } from 'react'
import ClassNode from './ClassNode'
import RelationshipLine from './RelationshipLine'
import './Canvas.css'

export default function Canvas({
  classes,
  relationships,
  selectedClassId,
  onCanvasClick,
  onClassClick,
  onMove,
  onDeleteRelationship,
  tool,
  relFrom,
}) {
  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(null) // { id, offsetX, offsetY }
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [panStart, setPanStart] = useState(null)
  const [zoom, setZoom] = useState(1)

  const getSVGPoint = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    }
  }, [pan, zoom])

  const handleMouseDown = useCallback((e) => {
    if (e.target === svgRef.current || e.target.classList.contains('canvas-bg')) {
      if (tool === 'select') {
        const rect = svgRef.current.getBoundingClientRect()
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      }
      onCanvasClick(e)
    }
  }, [tool, pan, onCanvasClick])

  const handleMouseMove = useCallback((e) => {
    if (dragging) {
      const pt = getSVGPoint(e)
      onMove(dragging.id, pt.x - dragging.offsetX, pt.y - dragging.offsetY)
    } else if (panStart) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y })
    }
  }, [dragging, panStart, getSVGPoint, onMove])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
    setPanStart(null)
  }, [])

  const handleNodeDragStart = useCallback((id, offsetX, offsetY) => {
    // offsetX/Y is in local node coords (half of node size)
    // We need to translate the pointer into SVG space to get the drag start point
    // The actual drag happens in handleMouseMove where we set position to svgPoint - offset
    setDragging({ id, offsetX, offsetY })
  }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(z => Math.min(Math.max(z * delta, 0.3), 3))
  }, [])

  useEffect(() => {
    const el = svgRef.current
    if (el) el.addEventListener('wheel', handleWheel, { passive: false })
    return () => { if (el) el.removeEventListener('wheel', handleWheel) }
  }, [handleWheel])

  return (
    <svg
      ref={svgRef}
      className={`canvas-svg ${tool === 'addRelation' ? 'cursor-crosshair' : panStart ? 'cursor-grabbing' : 'cursor-grab'}`}
      width="100%"
      height="100%"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid background */}
      <defs>
        <pattern id="grid" width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse"
          patternTransform={`translate(${pan.x % (20 * zoom)},${pan.y % (20 * zoom)})`}>
          <path d={`M ${20 * zoom} 0 L 0 0 0 ${20 * zoom}`} fill="none" stroke="#1e1e3a" strokeWidth="0.5"/>
        </pattern>
        <pattern id="grid-major" width={100 * zoom} height={100 * zoom} patternUnits="userSpaceOnUse"
          patternTransform={`translate(${pan.x % (100 * zoom)},${pan.y % (100 * zoom)})`}>
          <rect width={100 * zoom} height={100 * zoom} fill="none" stroke="#252545" strokeWidth="1"/>
        </pattern>

        {/* Arrow markers */}
        <marker id="arrow-inherit" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <path d="M2,2 L10,6 L2,10 Z" fill="none" stroke="#7c6af7" strokeWidth="1.5"/>
        </marker>
        <marker id="arrow-implement" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <path d="M2,2 L10,6 L2,10 Z" fill="none" stroke="#4ecdc4" strokeWidth="1.5"/>
        </marker>
        <marker id="arrow-association" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M1,1 L9,5 L1,9" fill="none" stroke="#f7c94a" strokeWidth="1.5"/>
        </marker>
        <marker id="arrow-dependency" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M1,1 L9,5 L1,9" fill="none" stroke="#ff6b6b" strokeWidth="1.5"/>
        </marker>
        <marker id="diamond-agg" markerWidth="12" markerHeight="12" refX="2" refY="6" orient="auto">
          <path d="M2,6 L6,3 L10,6 L6,9 Z" fill="none" stroke="#a8e6cf" strokeWidth="1.5"/>
        </marker>
        <marker id="diamond-comp" markerWidth="12" markerHeight="12" refX="2" refY="6" orient="auto">
          <path d="M2,6 L6,3 L10,6 L6,9 Z" fill="#ffaaa5" stroke="#ffaaa5" strokeWidth="1"/>
        </marker>
      </defs>

      <rect className="canvas-bg" width="100%" height="100%" fill="url(#grid)" />
      <rect className="canvas-bg" width="100%" height="100%" fill="url(#grid-major)" />

      <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
        {/* Relationships */}
        {relationships.map(rel => {
          const fromClass = classes.find(c => c.id === rel.fromId)
          const toClass = classes.find(c => c.id === rel.toId)
          if (!fromClass || !toClass) return null
          return (
            <RelationshipLine
              key={rel.id}
              relationship={rel}
              fromClass={fromClass}
              toClass={toClass}
              onDelete={onDeleteRelationship}
            />
          )
        })}

        {/* Classes */}
        {classes.map(cls => (
          <ClassNode
            key={cls.id}
            cls={cls}
            isSelected={selectedClassId === cls.id}
            isRelSource={relFrom === cls.id}
            onClick={(e) => onClassClick(cls.id, e)}
            onDragStart={handleNodeDragStart}
          />
        ))}
      </g>

      {/* Zoom indicator */}
      <text x="12" y="calc(100% - 12px)" fill="#333" fontSize="11" fontFamily="monospace">
        {Math.round(zoom * 100)}%  |  scroll to zoom  |  drag canvas to pan
      </text>
    </svg>
  )
}
