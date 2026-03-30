const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '../src/app/page.tsx')
let content = fs.readFileSync(file, 'utf8')

// Add state
const stateInsertion = `
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
    // reset input
    e.target.value = ''
  }

  const updateImageDescription = (id: string, description: string) => {
    setUserImages((prev) => prev.map((img) => (img.id === id ? { ...img, description } : img)))
  }

  const removeImage = (id: string) => {
    setUserImages((prev) => prev.filter((img) => img.id !== id))
  }
`
content = content.replace('const [isGenerating, setIsGenerating] = useState(false)', 'const [isGenerating, setIsGenerating] = useState(false)\n' + stateInsertion)

// Update handleGenerate
const newHandleGenerate = `  const handleGenerate = () => {
    if (!file) return
    setIsGenerating(true)
    setGenerateConfig({ 
      file, 
      packId: selectedPack,
      userImages: userImages.map(img => ({ file: img.file, description: img.description }))
    })
    router.push('/generate')
  }`
content = content.replace(/const handleGenerate = \(\) => {[\s\S]*?router\.push\('\/generate'\)\n  }/, newHandleGenerate)

// Add UI BEFORE {/* Options */}
const uiInsertion = `
          {/* User Images Upload */}
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">上传配图图库 <span className="text-sm font-normal text-[var(--color-text-secondary)]">(可选)</span></h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">提供相关图片并附上描述，AI 会自动将它们匹配到最合适的幻灯片中。留空的页面将保持占位符。</p>
              </div>
              <button 
                onClick={() => document.getElementById('image-input')?.click()}
                className="px-4 py-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                + 添加图片
              </button>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {userImages.length > 0 && (
              <div className="space-y-3 mt-4">
                {userImages.map((img) => (
                  <div key={img.id} className="flex gap-4 items-center p-3 rounded-xl border border-[var(--color-border)] bg-gray-50/50">
                    <img src={img.preview} className="w-16 h-16 object-cover rounded-lg border border-[var(--color-border)]" alt="preview" />
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="一句话描述这首图片的内容或意图（例：应用主界面截图）"
                        value={img.description}
                        onChange={(e) => updateImageDescription(img.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="移除图片"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
`
content = content.replace('{/* Options */}', uiInsertion + '\n          {/* Options */}')

fs.writeFileSync(file, content, 'utf8')
console.log('page.tsx patched successfully')
