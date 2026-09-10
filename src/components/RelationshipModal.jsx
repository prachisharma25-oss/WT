import { useState } from 'react'
import './RelationshipModal.css'

const RELATIONSHIP_TYPES = [
  {
    value: 'inheritance',
    label: 'Inheritance',
    icon: '▷',
    desc: 'extends — "is-a" relationship',
    color: '#7c6af7',
  },
  {
    value: 'implementation',
    label: 'Implementation',
    icon: '▷',
    desc: 'implements — class fulfills interface contract',
    color: '#4ecdc4',
    dashed: true,
  },
  {
    value: 'association',
    label: 'Association',
    icon: '→',
    desc: '"uses-a" relationship between classes',
    color: '#f7c94a',
  },
  {
    value: 'dependency',
    label: 'Dependency',
    icon: '⇢',
    desc: 'Weak usage — parameter or local variable',
    color: '#ff6b6b',
    dashed: true,
  },
  {
    value: 'aggregation',
    label: 'Aggregation',
    icon: '◇→',
    desc: '"has-a" — parts can exist independently',
    color: '#a8e6cf',
  },
  {
    value: 'composition',
    label: 'Composition',
    icon: '◆→',
    desc: 'Strong "has-a" — parts cannot exist alone',
    color: '#ffaaa5',
  },
]

export default function RelationshipModal({ onConfirm, onCancel }) {
  const [selected, setSelected] = useState('inheritance')
  const [label, setLabel] = useState('')

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>Choose Relationship Type</span>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="rel-options">
          {RELATIONSHIP_TYPES.map(rt => (
            <button
              key={rt.value}
              className={`rel-option ${selected === rt.value ? 'selected' : ''}`}
              style={{ '--rel-color': rt.color }}
              onClick={() => setSelected(rt.value)}
            >
              <span className="rel-icon" style={{ color: rt.color }}>{rt.icon}</span>
              <div className="rel-info">
                <span className="rel-label">{rt.label}</span>
                <span className="rel-desc">{rt.desc}</span>
              </div>
              {selected === rt.value && <span className="rel-check">✓</span>}
            </button>
          ))}
        </div>

        <div className="modal-footer">
          <input
            className="label-input"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Optional label (e.g. 1..* owns)"
          />
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            <button className="confirm-btn" onClick={() => onConfirm(selected, label)}>
              Add Relationship
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
