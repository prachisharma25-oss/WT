import './Toolbar.css'

export default function Toolbar({ onAddClass }) {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <span className="toolbar-label">ADD</span>
        <button className="tb-btn class-btn" onClick={() => onAddClass('class')} title="Add Class">
          <span className="tb-icon">C</span>
          Class
        </button>
        <button className="tb-btn abstract-btn" onClick={() => onAddClass('abstract')} title="Add Abstract Class">
          <span className="tb-icon italic">A</span>
          Abstract
        </button>
        <button className="tb-btn interface-btn" onClick={() => onAddClass('interface')} title="Add Interface">
          <span className="tb-icon">I</span>
          Interface
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <span className="toolbar-label">LEGEND</span>
        <div className="legend-item">
          <svg width="36" height="12"><line x1="2" y1="6" x2="30" y2="6" stroke="#7c6af7" strokeWidth="2" markerEnd="url(#arr)"/><defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c6af7"/></marker></defs></svg>
          <span>Inheritance</span>
        </div>
        <div className="legend-item">
          <svg width="36" height="12"><line x1="2" y1="6" x2="30" y2="6" stroke="#4ecdc4" strokeWidth="2" strokeDasharray="4,2"/></svg>
          <span>Implements</span>
        </div>
        <div className="legend-item">
          <svg width="36" height="12"><line x1="2" y1="6" x2="30" y2="6" stroke="#f7c94a" strokeWidth="2"/></svg>
          <span>Association</span>
        </div>
        <div className="legend-item">
          <svg width="36" height="12"><line x1="2" y1="6" x2="30" y2="6" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="4,2"/></svg>
          <span>Dependency</span>
        </div>
        <div className="legend-item">
          <svg width="36" height="12"><line x1="2" y1="6" x2="30" y2="6" stroke="#a8e6cf" strokeWidth="2"/></svg>
          <span>Aggregation</span>
        </div>
        <div className="legend-item">
          <svg width="36" height="12"><line x1="2" y1="6" x2="30" y2="6" stroke="#ffaaa5" strokeWidth="2"/></svg>
          <span>Composition</span>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <span className="toolbar-label">HELP</span>
        <div className="help-text">• Drag classes to move</div>
        <div className="help-text">• Click class to edit</div>
        <div className="help-text">• ↔ Add Relation button</div>
        <div className="help-text">• Click rel line to delete</div>
      </div>
    </div>
  )
}
