'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, DynamicIcon } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function TeamMembersSlide({ slide, editable, onUpdate }: Props) {
  // Constrain members to 2-8 as per requirements
  const members = (slide.cards || []).slice(0, 8)
  
  return (
    <div className="slide-card-inner team-members-shell">
      <div className="team-members-container">
        {/* 表头 */}
        <div className="team-members-header">
          <div className="team-members-header-label">Working group</div>
          <div className="team-members-header-label">Role</div>
        </div>

        {/* 成员行 */}
        <div className="team-members-list">
          {members.map((member, i) => (
            <div key={i} className="team-member-row">
              <div className="team-member-info">
                <div className="team-member-avatar">
                  {member.icon ? (
                    <DynamicIcon name={member.icon} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-30">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </div>
                <EditableText
                  value={member.heading}
                  tag="div"
                  className="team-member-name"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    next[i] = { ...next[i], heading: v }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
              </div>
              <EditableText
                value={member.body}
                tag="div"
                className="team-member-role"
                editable={editable}
                onChange={(v) => {
                  const next = [...(slide.cards || [])]
                  next[i] = { ...next[i], body: v }
                  onUpdate?.({ ...slide, cards: next })
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="team-members-footer">
        <div className="team-members-footer-brand">
          <div className="team-members-footer-brand-rect"></div>
          <span className="capitalize">{slide.title || "Project Name"}</span>
        </div>
        <span className="capitalize">by {slide.subtitle || "Author Name"}</span>
      </div>
    </div>
  )
}
