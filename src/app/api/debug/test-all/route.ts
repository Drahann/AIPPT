import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { MOCK_SLIDES } from '@/lib/templates/mock-data'
import { SlideContent, Presentation } from '@/lib/types'
import { calculateOptimalTypo, TYPO_SCALE } from '@/lib/utils/pretext-engine'
import { templateBounds } from '@/lib/layout-specs'
import { DebugSession } from '@/lib/ai/debug-writer'

/**
 * POST /api/debug/test-all
 *
 * Generates a full Presentation using all 32 MOCK_SLIDES,
 * runs pretext typography fitting on each slide,
 * saves debug data, and returns the Presentation JSON.
 *
 * Body: { themeId?: string }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const themeId = body.themeId || 'group-01'
  const presentationId = uuidv4()
  const debug = new DebugSession(true)

  debug.log('test-all.start', {
    totalTemplates: MOCK_SLIDES.length,
    layouts: MOCK_SLIDES.map((s, i) => ({ index: i, layout: s.layout })),
  })

  const TIERS: ('B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6')[] = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6']

  const processedSlides: SlideContent[] = []

  for (let i = 0; i < MOCK_SLIDES.length; i++) {
    const slide = { ...MOCK_SLIDES[i], id: `slide-${uuidv4().slice(0, 8)}`, index: i }
    const bounds = templateBounds[slide.layout]

    if (!bounds) {
      debug.log(`test-all.slide.${i}.no-bounds`, { layout: slide.layout })
      processedSlides.push(slide)
      continue
    }

    // Collect per-field measurement details
    const fieldMeasurements: Array<{
      field: string
      text: string
      bounds: { w: number; h: number }
      result: { level: string; fontSize: number; lineHeight: number; overflow: boolean }
    }> = []

    try {
      // 1. Title measurement
      const titleResult = await calculateOptimalTypo(
        slide.title || '',
        'heading',
        bounds.title.w,
        bounds.title.h,
      )
      fieldMeasurements.push({
        field: 'title',
        text: (slide.title || '').slice(0, 60),
        bounds: { w: bounds.title.w, h: bounds.title.h },
        result: titleResult,
      })

      // 2. Body-level "smallest common fit"
      let maxBodyTierIdx = 0
      const updateMaxTier = (level: string) => {
        const idx = TIERS.indexOf(level as any)
        if (idx > maxBodyTierIdx) maxBodyTierIdx = idx
      }

      // A. Global Body
      if (bounds.body) {
        const bodyText = (slide.body || [])
          .map((b: any) => b.text || b.items?.join('\n') || '')
          .filter(Boolean)
          .join('\n')
        if (bodyText) {
          const res = await calculateOptimalTypo(bodyText, 'body', bounds.body.w, bounds.body.h)
          updateMaxTier(res.level)
          fieldMeasurements.push({
            field: 'body',
            text: bodyText.slice(0, 80),
            bounds: { w: bounds.body.w, h: bounds.body.h },
            result: res,
          })
        }
      }

      // B. Cards Body
      if (bounds.cardBody && slide.cards) {
        for (let ci = 0; ci < slide.cards.length; ci++) {
          const card = slide.cards[ci]
          const cardText = [card.heading, card.body].filter(Boolean).join('\n')
          const res = await calculateOptimalTypo(cardText, 'body', bounds.cardBody.w, bounds.cardBody.h)
          updateMaxTier(res.level)
          fieldMeasurements.push({
            field: `card[${ci}]`,
            text: cardText.slice(0, 60),
            bounds: { w: bounds.cardBody.w, h: bounds.cardBody.h },
            result: res,
          })
        }
      }

      // C. Events
      if (bounds.eventDesc && slide.events) {
        for (let ei = 0; ei < slide.events.length; ei++) {
          const ev = slide.events[ei]
          const evText = [ev.title, ev.description].filter(Boolean).join('\n')
          const res = await calculateOptimalTypo(evText, 'body', bounds.eventDesc.w, bounds.eventDesc.h)
          updateMaxTier(res.level)
          fieldMeasurements.push({
            field: `event[${ei}]`,
            text: evText.slice(0, 60),
            bounds: { w: bounds.eventDesc.w, h: bounds.eventDesc.h },
            result: res,
          })
        }
      }

      // D. Metrics
      if (bounds.metricValue && slide.metrics) {
        for (let mi = 0; mi < slide.metrics.length; mi++) {
          const m = slide.metrics[mi]
          const mText = [m.value, m.label].filter(Boolean).join('\n')
          const mH = (bounds.metricValue.h || 100) + (bounds.metricLabel?.h || 0)
          const res = await calculateOptimalTypo(mText, 'body', bounds.metricValue.w, mH)
          updateMaxTier(res.level)
          fieldMeasurements.push({
            field: `metric[${mi}]`,
            text: mText.slice(0, 40),
            bounds: { w: bounds.metricValue.w, h: mH },
            result: res,
          })
        }
      }

      const finalBodyLevel = TIERS[maxBodyTierIdx]

      slide.typographyParams = {
        headingLevel: titleResult.level as 'H1' | 'H2' | 'H3',
        bodyLevel: finalBodyLevel,
      }

      // Enhanced debug — matches applyTypographyFitting output format
      debug.log(`test-all.slide.${i}.typography.fitting`, {
        layout: slide.layout,
        title: (slide.title || '').slice(0, 50),
        result: {
          headingLevel: titleResult.level,
          headingFontSize: titleResult.fontSize,
          headingLineHeight: titleResult.lineHeight,
          headingOverflow: titleResult.overflow,
          bodyLevel: finalBodyLevel,
          bodyFontSize: TYPO_SCALE.body[finalBodyLevel]?.fontSize,
          bodyLineHeight: TYPO_SCALE.body[finalBodyLevel]?.lineHeight,
          bodyFontWeight: TYPO_SCALE.body[finalBodyLevel]?.fontWeight,
        },
        bounds: {
          title: { w: bounds.title.w, h: bounds.title.h, defaultTier: bounds.title.defaultTier },
          body: bounds.body ? { w: bounds.body.w, h: bounds.body.h, defaultTier: bounds.body.defaultTier } : null,
          cardBody: bounds.cardBody ? { w: bounds.cardBody.w, h: bounds.cardBody.h, defaultTier: bounds.cardBody.defaultTier } : null,
          eventDesc: bounds.eventDesc ? { w: bounds.eventDesc.w, h: bounds.eventDesc.h, defaultTier: bounds.eventDesc.defaultTier } : null,
          metricValue: bounds.metricValue ? { w: bounds.metricValue.w, h: bounds.metricValue.h } : null,
        },
        fieldMeasurements,
        overflowFields: fieldMeasurements.filter(fm => fm.result.overflow).map(fm => fm.field),
      })
    } catch (err) {
      debug.log(`test-all.slide.${i}.typography.error`, { layout: slide.layout, error: String(err) })
    }

    processedSlides.push(slide)
  }

  const presentation: Presentation = {
    id: presentationId,
    title: 'ALL 32 Templates — Debug Test',
    themeId,
    slides: processedSlides,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      debugSessionId: debug.id,
      debugMode: true,
      source: 'test-all',
    },
  }

  debug.log('test-all.summary', {
    slideCount: processedSlides.length,
    layouts: processedSlides.map((s, i) => ({
      index: i,
      layout: s.layout,
      headingLevel: s.typographyParams?.headingLevel,
      bodyLevel: s.typographyParams?.bodyLevel,
    })),
  })

  const debugPath = await debug.flush({
    presentationId,
    themeId,
    slideCount: processedSlides.length,
  })

  return NextResponse.json({
    success: true,
    debugPath,
    debugSessionId: debug.id,
    presentation,
  })
}
