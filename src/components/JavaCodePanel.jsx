import { useState } from 'react'
import './JavaCodePanel.css'

export default function JavaCodePanel({ code, classes, onClose }) {
  const [selectedFile, setSelectedFile] = useState(classes[0]?.name || null)
  const [copied, setCopied] = useState(false)

  const fileCode = code[selectedFile] || ''

  const copyAll = () => {
    const allCode = Object.entries(code)
      .map(([name, c]) => `// ===== ${name}.java =====\n${c}`)
      .join('\n\n')
    navigator.clipboard.writeText(allCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const copyFile = () => {
    navigator.clipboard.writeText(fileCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const downloadFile = () => {
    const blob = new Blob([fileCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedFile}.java`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    Object.entries(code).forEach(([name, c]) => {
      const blob = new Blob([c], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name}.java`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  const fileNames = Object.keys(code)

  return (
    <div className="code-panel">
      <div className="code-panel-header">
        <span className="code-panel-title">☕ Generated Java Code</span>
        <div className="code-panel-actions">
          <button className="action-btn" onClick={copyAll} title="Copy all files">
            {copied ? '✓ Copied!' : '⎘ Copy All'}
          </button>
          <button className="action-btn download" onClick={downloadAll} title="Download all .java files">
            ↓ Download All
          </button>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="code-panel-body">
        <div className="file-tabs">
          {fileNames.map(name => (
            <button
              key={name}
              className={`file-tab ${selectedFile === name ? 'active' : ''}`}
              onClick={() => setSelectedFile(name)}
            >
              📄 {name}.java
            </button>
          ))}
        </div>

        <div className="code-area-wrapper">
          <div className="code-area-actions">
            <span className="file-badge">{selectedFile}.java</span>
            <button className="sm-btn" onClick={copyFile}>⎘ Copy</button>
            <button className="sm-btn" onClick={downloadFile}>↓ Download</button>
          </div>
          <pre className="code-area">
            <code>{fileCode}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
