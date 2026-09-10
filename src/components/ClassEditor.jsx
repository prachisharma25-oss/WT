import { useState } from 'react'
import './ClassEditor.css'

const VISIBILITY_OPTIONS = ['public', 'private', 'protected', 'package']
const JAVA_TYPES = ['void', 'int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short', 'String', 'Object', 'List', 'Map', 'Set', 'Array']

export default function ClassEditor({ cls, onChange, onDelete, onClose }) {
  const [activeTab, setActiveTab] = useState('info')

  const update = (patch) => onChange({ ...cls, ...patch })

  const addField = () => {
    const field = { id: 'f_' + Date.now(), name: 'field', type: 'String', visibility: 'private' }
    update({ fields: [...cls.fields, field] })
  }

  const updateField = (id, patch) => {
    update({ fields: cls.fields.map(f => f.id === id ? { ...f, ...patch } : f) })
  }

  const removeField = (id) => {
    update({ fields: cls.fields.filter(f => f.id !== id) })
  }

  const addMethod = () => {
    const method = {
      id: 'm_' + Date.now(),
      name: 'method',
      returnType: 'void',
      visibility: 'public',
      params: '',
      isAbstract: false,
      isStatic: false,
    }
    update({ methods: [...cls.methods, method] })
  }

  const updateMethod = (id, patch) => {
    update({ methods: cls.methods.map(m => m.id === id ? { ...m, ...patch } : m) })
  }

  const removeMethod = (id) => {
    update({ methods: cls.methods.filter(m => m.id !== id) })
  }

  return (
    <div className="class-editor">
      <div className="editor-header">
        <span className="editor-title">
          {cls.type === 'interface' ? '«interface» ' : cls.isAbstract ? '«abstract» ' : ''}
          {cls.name}
        </span>
        <div className="editor-header-btns">
          <button className="del-btn" onClick={onDelete} title="Delete class">🗑</button>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="editor-tabs">
        {['info', 'fields', 'methods'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'info' ? '⚙ Info' : tab === 'fields' ? '▪ Fields' : '▶ Methods'}
            {tab === 'fields' && ` (${cls.fields.length})`}
            {tab === 'methods' && ` (${cls.methods.length})`}
          </button>
        ))}
      </div>

      <div className="editor-body">
        {activeTab === 'info' && (
          <div className="tab-content">
            <label className="field-row">
              <span>Class Name</span>
              <input
                value={cls.name}
                onChange={e => update({ name: e.target.value })}
                className="text-input"
                placeholder="ClassName"
              />
            </label>
            <label className="field-row">
              <span>Type</span>
              <select
                value={cls.type === 'interface' ? 'interface' : cls.isAbstract ? 'abstract' : 'class'}
                onChange={e => {
                  const v = e.target.value
                  if (v === 'interface') update({ type: 'interface', isAbstract: false })
                  else if (v === 'abstract') update({ type: 'class', isAbstract: true })
                  else update({ type: 'class', isAbstract: false })
                }}
                className="select-input"
              >
                <option value="class">Class</option>
                <option value="abstract">Abstract Class</option>
                <option value="interface">Interface</option>
              </select>
            </label>
            <div className="info-note">
              Click on the canvas to place this class. Drag the class box to reposition it.
            </div>
          </div>
        )}

        {activeTab === 'fields' && (
          <div className="tab-content">
            <button className="add-btn" onClick={addField}>+ Add Field</button>
            {cls.fields.length === 0 && <div className="empty-hint">No fields yet. Click + Add Field.</div>}
            {cls.fields.map(f => (
              <div key={f.id} className="member-row">
                <select
                  value={f.visibility}
                  onChange={e => updateField(f.id, { visibility: e.target.value })}
                  className="vis-select"
                  title="Visibility"
                >
                  {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <input
                  value={f.name}
                  onChange={e => updateField(f.id, { name: e.target.value })}
                  className="name-input"
                  placeholder="fieldName"
                />
                <input
                  value={f.type}
                  onChange={e => updateField(f.id, { type: e.target.value })}
                  className="type-input"
                  placeholder="String"
                  list="java-types"
                />
                <button className="remove-btn" onClick={() => removeField(f.id)}>✕</button>
              </div>
            ))}
            <datalist id="java-types">
              {JAVA_TYPES.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="tab-content">
            <button className="add-btn" onClick={addMethod}>+ Add Method</button>
            {cls.methods.length === 0 && <div className="empty-hint">No methods yet. Click + Add Method.</div>}
            {cls.methods.map(m => (
              <div key={m.id} className="method-card">
                <div className="member-row">
                  <select
                    value={m.visibility}
                    onChange={e => updateMethod(m.id, { visibility: e.target.value })}
                    className="vis-select"
                  >
                    {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <input
                    value={m.name}
                    onChange={e => updateMethod(m.id, { name: e.target.value })}
                    className="name-input"
                    placeholder="methodName"
                  />
                  <input
                    value={m.returnType}
                    onChange={e => updateMethod(m.id, { returnType: e.target.value })}
                    className="type-input"
                    placeholder="void"
                    list="java-types"
                  />
                  <button className="remove-btn" onClick={() => removeMethod(m.id)}>✕</button>
                </div>
                <div className="method-extras">
                  <input
                    value={m.params}
                    onChange={e => updateMethod(m.id, { params: e.target.value })}
                    className="params-input"
                    placeholder="params (e.g. String name, int age)"
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={m.isAbstract}
                      onChange={e => updateMethod(m.id, { isAbstract: e.target.checked })}
                    />
                    abstract
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={m.isStatic}
                      onChange={e => updateMethod(m.id, { isStatic: e.target.checked })}
                    />
                    static
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
