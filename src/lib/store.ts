import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { Presentation, SlideContent, GenerationTask } from './types'

interface GenerateConfig {
  file?: File // Note: File objects are not serializable in localStorage
  slideCount?: number
  packId: string
  debugMode?: boolean
  userImages?: { file: File; description: string }[]
}

interface AppState {
  presentation: Presentation | null
  generationTask: GenerationTask | null
  generateConfig: GenerateConfig | null
  currentSlideIndex: number
  isEditing: boolean
  isPresentMode: boolean

  setPresentation: (p: Presentation | null) => void
  updateSlide: (index: number, slide: SlideContent) => void
  setGenerationTask: (task: GenerationTask | null) => void
  setGenerateConfig: (config: GenerateConfig | null) => void
  setCurrentSlide: (index: number) => void
  setEditing: (editing: boolean) => void
  setPresentMode: (mode: boolean) => void
  moveSlide: (from: number, to: number) => void
  deleteSlide: (index: number) => void
  addSlide: (afterIndex: number, slide: SlideContent) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      presentation: null,
      generationTask: null,
      generateConfig: null,
      currentSlideIndex: 0,
      isEditing: true,
      isPresentMode: false,

      setPresentation: (p) => set({ presentation: p }),

      updateSlide: (index, slide) => {
        const { presentation } = get()
        if (!presentation) return
        const slides = [...presentation.slides]
        slides[index] = slide
        set({ presentation: { ...presentation, slides, updatedAt: new Date().toISOString() } })
      },

      setGenerationTask: (task) => set({ generationTask: task }),
      setGenerateConfig: (config) => set({ generateConfig: config }),
      setCurrentSlide: (index) => set({ currentSlideIndex: index }),
      setEditing: (editing) => set({ isEditing: editing }),
      setPresentMode: (mode) => set({ isPresentMode: mode }),

      moveSlide: (from, to) => {
        const { presentation } = get()
        if (!presentation) return
        const slides = [...presentation.slides]
        const [moved] = slides.splice(from, 1)
        slides.splice(to, 0, moved)
        set({ presentation: { ...presentation, slides, updatedAt: new Date().toISOString() } })
      },

      deleteSlide: (index) => {
        const { presentation, currentSlideIndex } = get()
        if (!presentation || presentation.slides.length <= 1) return
        const slides = presentation.slides.filter((_, i) => i !== index)
        const newIndex = currentSlideIndex >= slides.length ? slides.length - 1 : currentSlideIndex
        set({
          presentation: { ...presentation, slides, updatedAt: new Date().toISOString() },
          currentSlideIndex: newIndex,
        })
      },

      addSlide: (afterIndex, slide) => {
        const { presentation } = get()
        if (!presentation) return
        const withId = { ...slide, id: slide.id || `slide-${uuidv4().slice(0, 8)}` }
        const slides = [...presentation.slides]
        slides.splice(afterIndex + 1, 0, withId)
        set({
          presentation: { ...presentation, slides, updatedAt: new Date().toISOString() },
          currentSlideIndex: afterIndex + 1,
        })
      },
    }),
    {
      name: 'ai-ppt-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist presentation and config (config might lose File objects, which is fine)
      partialize: (state) => ({ 
        presentation: state.presentation,
        generateConfig: state.generateConfig,
        currentSlideIndex: state.currentSlideIndex,
        isEditing: state.isEditing
      }),
    }
  )
)
