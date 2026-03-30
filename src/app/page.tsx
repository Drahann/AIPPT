'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { templatePacks } from '@/lib/templates/registry'
import { useAppStore } from '@/lib/store'

export default function HomePage() {
  const router = useRouter()
  const { setGenerateConfig } = useAppStore()
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedPack, setSelectedPack] = useState('group-01')
  const [isGenerating, setIsGenerating] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [userImages, setUserImages] = useState<{ id: string; file: File; description: string; preview: string }[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((f) => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        description: '',
        preview: URL.createObjectURL(f),
      }))
      setUserImages((prev) => [...prev, ...newImages])
    }
    e.target.value = ''
  }

  const updateImageDescription = (id: string, description: string) => {
    setUserImages((prev) => prev.map((img) => (img.id === id ? { ...img, description } : img)))
  }

  const removeImage = (id: string) => {
    setUserImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      const f = e.dataTransfer.files[0]
      if (f.name.endsWith('.docx') || f.name.endsWith('.md') || f.name.endsWith('.txt')) {
        setFile(f)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleGenerate = () => {
    if (!file) return
    setIsGenerating(true)
    setGenerateConfig({
      file,
      packId: selectedPack,
      debugMode,
      userImages: userImages.map((img) => ({ file: img.file, description: img.description })),
    })
    router.push('/generate')
  }

  return (
    <div className="ff-page" style={{ minHeight: '100vh' }}>
      <nav className="ff-nav">
        <div className="ff-container ff-nav__inner">
          <span className="ff-nav__brand">HIT</span>
          <div className="ff-nav__links">
            <button onClick={() => router.push('/demo')} className="ff-nav__link">
              演示 Demo
            </button>
          </div>
        </div>
      </nav>

      <main className="ff-container">
        <section className="ff-hero">
          <h1 className="ff-hero__title">AIPPT</h1>
          <p className="ff-hero__sub">上传 Word / Markdown 文档，自动生成可编辑并可导出的 PPTX。</p>
        </section>

        <hr className="ff-divider" />

        <section className="ff-section">
          <div className="ff-section__grid">
            <div>
              <p className="ff-section__label">文档上传</p>
            </div>

            <div className="ff-upload-area">
              <div
                className={`ff-upload-drop ${dragActive ? 'ff-upload-drop--active' : ''} ${file ? 'ff-upload-drop--done' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input id="file-input" type="file" accept=".docx,.md,.txt" onChange={handleFileChange} className="ff-sr-only" />

                {file ? (
                  <div className="ff-upload-drop__done">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="ff-upload-drop__name">{file.name}</span>
                    <span className="ff-upload-drop__size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="ff-upload-drop__idle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    <span>点击或拖拽上传 .docx / .md / .txt</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <hr className="ff-divider" />

        <section className="ff-section">
          <div className="ff-section__grid">
            <div>
              <p className="ff-section__label">补充图片</p>
              <p className="ff-section__hint">可选：上传参考图，AI 会优先用于相关页面。</p>
            </div>

            <div>
              <button onClick={() => document.getElementById('image-input')?.click()} className="ff-btn ff-btn--outline">
                + 添加图片
              </button>
              <input id="image-input" type="file" accept="image/*" multiple onChange={handleImageUpload} className="ff-sr-only" />

              {userImages.length > 0 && (
                <div className="ff-images-list">
                  {userImages.map((img) => (
                    <div key={img.id} className="ff-image-row">
                      <img src={img.preview} className="ff-image-row__thumb" alt="preview" />
                      <input
                        type="text"
                        placeholder="输入图片说明（可选）"
                        value={img.description}
                        onChange={(e) => updateImageDescription(img.id, e.target.value)}
                        className="ff-image-row__input"
                      />
                      <button onClick={() => removeImage(img.id)} className="ff-image-row__remove" title="删除">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <hr className="ff-divider" />

        <section className="ff-section">
          <div className="ff-section__grid">
            <div>
              <p className="ff-section__label">主题选择</p>
            </div>

            <div className="ff-themes">
              {templatePacks.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  className={`ff-theme-btn ${selectedPack === pack.id ? 'ff-theme-btn--active' : ''}`}
                  title={pack.name}
                >
                  <div
                    className="ff-theme-btn__swatch"
                    style={{
                      background: `linear-gradient(135deg, ${pack.colors.primary} 50%, ${pack.colors.secondary || pack.colors.accent} 50%)`,
                    }}
                  />
                  <span className="ff-theme-btn__name">{pack.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <hr className="ff-divider" />

        <section className="ff-section ff-section--action">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13, color: '#666' }}>
            <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} />
            开启 Debug 模式（保存全链路数据到 debug-data/）
          </label>
          <button onClick={handleGenerate} disabled={!file || isGenerating} className="ff-btn ff-btn--primary">
            {isGenerating ? (
              <span className="ff-btn__loading">
                <svg className="ff-spin" width="20" height="20" viewBox="0 0 24 24">
                  <circle className="ff-spin__track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path className="ff-spin__arc" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                生成中…
              </span>
            ) : (
              '开始生成 →'
            )}
          </button>
        </section>

        <footer className="ff-footer">
          <hr className="ff-divider" />
          <div className="ff-footer__inner">
            <span className="ff-footer__copy">AIPPT by HIT</span>
            <button onClick={() => router.push('/demo')} className="ff-footer__link">
              查看演示 Demo →
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}
