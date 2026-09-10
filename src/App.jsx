import { useState, useCallback } from 'react'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import ClassEditor from './components/ClassEditor'
import JavaCodePanel from './components/JavaCodePanel'
import RelationshipModal from './components/RelationshipModal'
import { generateJavaCode } from './utils/javaCodeGenerator'
import './App.css'

const initialClasses = [
  {
    id: 'cls_1',
    name: 'Animal',
    type: 'class',
    isAbstract: false,
    x: 80,
    y: 100,
    fields: [
      { id: 'f1', name: 'name', type: 'String', visibility: 'private' },
      { id: 'f2', name: 'age', type: 'int', visibility: 'protected' },
    ],
    methods: [
      { id: 'm1', name: 'speak', returnType: 'void', visibility: 'public', params: '', isAbstract: false, isStatic: false },
      { id: 'm2', name: 'getName', returnType: 'String', visibility: 'public', params: '', isAbstract: false, isStatic: false },
    ],
  },
  {
    id: 'cls_2',
    name: 'Dog',
    type: 'class',
    isAbstract: false,
    x: 340,
    y: 320,
    fields: [
      { id: 'f3', name: 'breed', type: 'String', visibility: 'private' },
    ],
    methods: [
      { id: 'm3', name: 'speak', returnType: 'void', visibility: 'public', params: '', isAbstract: false, isStatic: false },
      { id: 'm4', name: 'fetch', returnType: 'void', visibility: 'public', params: 'String item', isAbstract: false, isStatic: false },
    ],
  },
]

const initialRelationships = [
  {
    id: 'rel_1',
    fromId: 'cls_2',
    toId: 'cls_1',
    type: 'inheritance',
    label: '',
  },
]

export default function App() {
  const [classes, setClasses] = useState(initialClasses)
  const [relationships, setRelationships] = useState(initialRelationships)
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [showCodePanel, setShowCodePanel] = useState(false)
  const [showRelModal, setShowRelModal] = useState(false)
  const [relFrom, setRelFrom] = useState(null)
  const [tool, setTool] = useState('select') // select | addRelation

  const selectedClass = classes.find(c => c.id === selectedClassId) || null

  const addClass = useCallback((type = 'class') => {
    const id = 'cls_' + Date.now()
    const newClass = {
      id,
      name: type === 'interface' ? 'NewInterface' : type === 'abstract' ? 'AbstractClass' : 'NewClass',
      type: type === 'interface' ? 'interface' : 'class',
      isAbstract: type === 'abstract',
      x: 150 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      fields: [],
      methods: [],
    }
    setClasses(prev => [...prev, newClass])
    setSelectedClassId(id)
  }, [])

  const updateClass = useCallback((updated) => {
    setClasses(prev => prev.map(c => c.id === updated.id ? updated : c))
  }, [])

  const deleteClass = useCallback((id) => {
    setClasses(prev => prev.filter(c => c.id !== id))
    setRelationships(prev => prev.filter(r => r.fromId !== id && r.toId !== id))
    setSelectedClassId(null)
  }, [])

  const moveClass = useCallback((id, x, y) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, x, y } : c))
  }, [])

  const handleCanvasClick = useCallback((e) => {
    if (tool === 'select') {
      setSelectedClassId(null)
    }
  }, [tool])

  const handleClassClick = useCallback((id, e) => {
    e.stopPropagation()
    if (tool === 'addRelation') {
      if (!relFrom) {
        setRelFrom(id)
      } else if (relFrom !== id) {
        setShowRelModal(true)
        // relFrom already set, toId will be id
        setRelFrom(prev => ({ from: prev, to: id }))
      }
      return
    }
    setSelectedClassId(id)
  }, [tool, relFrom])

  const handleAddRelationship = useCallback((type, label) => {
    if (relFrom && relFrom.from && relFrom.to) {
      const rel = {
        id: 'rel_' + Date.now(),
        fromId: relFrom.from,
        toId: relFrom.to,
        type,
        label,
      }
      setRelationships(prev => [...prev, rel])
    }
    setRelFrom(null)
    setShowRelModal(false)
    setTool('select')
  }, [relFrom])

  const deleteRelationship = useCallback((id) => {
    setRelationships(prev => prev.filter(r => r.id !== id))
  }, [])

  const javaCode = generateJavaCode(classes, relationships)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">⬡ UML Studio</span>
          <span className="subtitle">Visual Class Diagram Generator</span>
        </div>
        <div className="header-right">
          <button
            className={`tool-btn ${tool === 'addRelation' ? 'active' : ''}`}
            onClick={() => { setTool(t => t === 'addRelation' ? 'select' : 'addRelation'); setRelFrom(null) }}
            title="Add Relationship (click two classes)"
          >
            ↔ Add Relation
          </button>
          <button className="code-btn" onClick={() => setShowCodePanel(v => !v)}>
            {showCodePanel ? '✕ Hide Code' : '{ } Generate Java'}
          </button>
        </div>
      </header>

      <div className="app-body">
        <Toolbar onAddClass={addClass} />

        <div className="canvas-area">
          {tool === 'addRelation' && (
            <div className="relation-hint">
              {!relFrom || typeof relFrom === 'string'
                ? (relFrom ? '✓ Source selected — now click the TARGET class' : '🎯 Click SOURCE class to start relationship')
                : ''}
            </div>
          )}
          <Canvas
            classes={classes}
            relationships={relationships}
            selectedClassId={selectedClassId}
            onCanvasClick={handleCanvasClick}
            onClassClick={handleClassClick}
            onMove={moveClass}
            onDeleteRelationship={deleteRelationship}
            tool={tool}
            relFrom={typeof relFrom === 'string' ? relFrom : relFrom?.from}
          />
        </div>

        {selectedClass && (
          <ClassEditor
            cls={selectedClass}
            onChange={updateClass}
            onDelete={() => deleteClass(selectedClass.id)}
            onClose={() => setSelectedClassId(null)}
          />
        )}

        {showCodePanel && (
          <JavaCodePanel
            code={javaCode}
            classes={classes}
            onClose={() => setShowCodePanel(false)}
          />
        )}
      </div>

      {showRelModal && (
        <RelationshipModal
          onConfirm={handleAddRelationship}
          onCancel={() => { setShowRelModal(false); setRelFrom(null); setTool('select') }}
        />
      )}
    </div>
  )
}
