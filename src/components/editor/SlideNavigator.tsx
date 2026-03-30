'use client'

import { useAppStore } from '@/lib/store'

export function SlideNavigator() {
  const { presentation, currentSlideIndex, setCurrentSlide, deleteSlide } = useAppStore()

  if (!presentation) return null

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index)
    document.getElementById(`slide-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <aside className="ff-sidebar">
      <div className="ff-sidebar__header">
        共 {presentation.slides.length} 页
      </div>

      <div className="ff-sidebar__list">
        {presentation.slides.map((slide, index) => (
          <div
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`ff-sidebar__item ${currentSlideIndex === index ? 'ff-sidebar__item--active' : ''}`}
          >
            <div className="ff-sidebar__item-header">
              <span className="ff-sidebar__item-num">{index + 1}</span>
              <span className="ff-sidebar__item-layout">{slide.layout}</span>
            </div>
            <div className="ff-sidebar__item-title">{slide.title}</div>

            {/* Delete */}
            {presentation.slides.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSlide(index)
                }}
                className="ff-sidebar__item-delete"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
