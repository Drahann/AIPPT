'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'
import { getSeriesColorPalette } from '@/lib/utils/chart-utils'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function ChartSlide({ slide, editable, onUpdate }: Props) {
  const chart = slide.chart
  
  if (!chart || !chart.series || chart.series.length === 0) {
    return (
      <div className="slide-card-inner flex flex-col h-full bg-cyan-900/10">
        <h2 className="slide-title">{slide.title}</h2>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          暂无图表数据
        </div>
      </div>
    )
  }

  // Pre-calculate max value for scaling bar/line charts
  let maxVal = 0;
  chart.series.forEach(s => {
    (s.values || []).forEach(v => {
      const numV = Number(v) || 0;
      if (numV > maxVal) maxVal = numV;
    })
  });
  if (maxVal === 0) maxVal = 100;

  // Shared colors from our utility
  const colorCount = chart.type === 'pie' ? chart.categories.length : chart.series.length;
  // Use stable Hex colors as fallback for better snapshot consistency
  const seriesColors = getSeriesColorPalette(
    { primary: '#3b82f6', secondary: '#10b981', accent: '#f59e0b' },
    colorCount,
    ['#ffffff', '#f8fafc'] // Avoid background colors
  );

  const paragraphBlocks = (slide.body || []).filter((block) => block.type === 'paragraph' && block.text?.trim())
  const displayParagraphs =
    paragraphBlocks.length > 0
      ? paragraphBlocks.slice(0, 2).map((block) => block.text as string)
      : []

  const updateParagraphAt = (index: number, value: string) => {
    const nextBody = [...(slide.body || [])]
    const paragraphIndexes = nextBody
      .map((block, i) => (block.type === 'paragraph' ? i : -1))
      .filter((i) => i >= 0)

    const target = paragraphIndexes[index]
    if (target !== undefined) {
      nextBody[target] = { ...nextBody[target], text: value }
    } else {
      nextBody.push({ type: 'paragraph', text: value })
    }
    onUpdate?.({ ...slide, body: nextBody })
  }

  // Render left-text right-bar layout
  const renderBarChart = () => {
    const series = chart.series[0]
    if (!series) return null

    const points = chart.categories.map((category, i) => ({
      category,
      value: Math.max(0, Number(series.values[i]) || 0),
    }))

    const niceMax = (() => {
      const localMax = Math.max(...points.map((p) => p.value), 0)
      if (localMax <= 5) return 5
      const magnitude = Math.pow(10, Math.floor(Math.log10(localMax)))
      return Math.ceil(localMax / magnitude) * magnitude
    })()

    const yTicks = Array.from({ length: 5 }, (_, index) => {
      const ratio = (4 - index) / 4
      const value = ratio * niceMax
      const formatted = niceMax <= 10 ? value.toFixed(1) : Math.round(value).toString()
      return { value, formatted }
    })

    const yLabel = chart.title?.trim() || series.name || 'Value'
    const xLabel = series.name || 'Category'
    const projectName = slide.subtitle?.trim() || ''

    return (
      <div className="chart-aether-frame">
        <div className="chart-aether-left">
          {projectName ? (
            <EditableText
              value={projectName}
              tag="p"
              className="chart-aether-kicker"
              editable={editable}
              onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
            />
          ) : null}
          <EditableText
            value={slide.title}
            tag="h2"
            className="chart-aether-title"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, title: v })}
          />

          <div className="chart-aether-copy">
            {displayParagraphs.map((text, idx) => (
              <EditableText
                key={idx}
                value={text}
                tag="p"
                className="chart-aether-paragraph"
                editable={editable}
                onChange={(v) => updateParagraphAt(idx, v)}
              />
            ))}
          </div>
        </div>

        <div className="chart-aether-right">
          <span className="chart-aether-index">23</span>
          <span className="chart-aether-y-label">{yLabel}</span>

          <div className="chart-aether-plot">
            <div className="chart-aether-y-ticks">
              {yTicks.map((tick, i) => (
                <div key={`${tick.formatted}-${i}`} className="chart-aether-y-tick">
                  <span className="chart-aether-y-tick-label">{tick.formatted}</span>
                  <span className="chart-aether-y-tick-line" />
                </div>
              ))}
            </div>
            <div className="chart-aether-bars">
              {points.map(({ category, value }, i) => {
                const val = value
                const heightPct = Math.max(4, (val / niceMax) * 100)
                return (
                  <div key={i} className="chart-aether-bar-group" title={`${category}: ${val}`}>
                    <div className="chart-aether-bar" style={{ height: `${heightPct}%` }} />
                    <span className="chart-aether-x-tick">{category}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <span className="chart-aether-x-label">{xLabel}</span>
        </div>
      </div>
    )
  }

  // Render grouped comparison bar layout (2 series)
  const renderCompareBarChart = () => {
    const seriesA = chart.series[0]
    const seriesB = chart.series[1]
    if (!seriesA) return null

    const points = chart.categories.map((category, index) => ({
      category,
      valueA: Math.max(0, Number(seriesA.values[index]) || 0),
      valueB: Math.max(0, Number(seriesB?.values[index]) || 0),
    }))

    const niceMax = (() => {
      const localMax = Math.max(...points.map((point) => Math.max(point.valueA, point.valueB)), 0)
      if (localMax <= 5) return 5
      const magnitude = Math.pow(10, Math.floor(Math.log10(localMax)))
      return Math.ceil(localMax / magnitude) * magnitude
    })()

    const yTicks = Array.from({ length: 6 }, (_, index) => {
      const ratio = (5 - index) / 5
      const value = ratio * niceMax
      const formatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)
      return { value, formatted }
    })

    const seriesLabelA = seriesA.name?.trim() || 'Baseline'
    const seriesLabelB = seriesB?.name?.trim() || 'Current'

    return (
      <div className="chart-compare-shell">
        <EditableText
          value={slide.title}
          tag="h2"
          className="chart-compare-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />

        <div className="chart-compare-main">
          <div className="chart-compare-plot">
            <div className="chart-compare-grid">
              {yTicks.map((tick, index) => (
                <div key={`${tick.formatted}-${index}`} className="chart-compare-grid-row">
                  <span className="chart-compare-y-label">{tick.formatted}</span>
                  <span className="chart-compare-grid-line" />
                </div>
              ))}
            </div>

            <div className="chart-compare-groups">
              {points.map((point, index) => {
                const heightA = Math.max(4, (point.valueA / niceMax) * 100)
                const heightB = Math.max(4, (point.valueB / niceMax) * 100)
                return (
                  <div key={`${point.category}-${index}`} className="chart-compare-group">
                    <div className="chart-compare-bars">
                      <div
                        className="chart-compare-bar chart-compare-bar--before"
                        style={{ height: `${heightA}%` }}
                        title={`${seriesLabelA}: ${point.valueA}`}
                      />
                      <div
                        className="chart-compare-bar chart-compare-bar--after"
                        style={{ height: `${heightB}%` }}
                        title={`${seriesLabelB}: ${point.valueB}`}
                      />
                    </div>
                    <span className="chart-compare-x-label">{point.category}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="chart-compare-legend">
            <div className="chart-compare-legend-item">
              <span className="chart-compare-legend-swatch chart-compare-legend-swatch--before" />
              <span className="chart-compare-legend-text">{seriesLabelA}</span>
            </div>
            <div className="chart-compare-legend-item">
              <span className="chart-compare-legend-swatch chart-compare-legend-swatch--after" />
              <span className="chart-compare-legend-text">{seriesLabelB}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render Line Chart
  const renderLineChart = () => {
    const w = 800
    const h = 400
    const padding = 40
    
    return (
      <div className="relative w-full h-full flex items-center justify-center pb-8 pt-4 overflow-hidden">
        {/* Force aspect ratio to prevent "doubling" effect on wide screens */}
        <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '2 / 1', position: 'relative' }}>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-hidden">
            <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} stroke="var(--color-border)" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={h - padding} stroke="var(--color-border)" strokeWidth="2" />
            
            {chart.series.map((series, sIdx) => {
               const pointsData = (series.values || [])
                 .map((v, i) => {
                   if (v === null || v === undefined) return null;
                   const x = padding + (i * ((w - 2 * padding) / Math.max(1, chart.categories.length - 1)))
                   const y = (h - padding) - (((Number(v) || 0) / maxVal) * (h - 2 * padding))
                   return { x, y, v }
                 })
                 .filter(p => p !== null) as {x: number, y: number, v: any}[]
               
               const pointsString = pointsData.map(p => `${p.x},${p.y}`).join(' ')
               const color = seriesColors[sIdx % seriesColors.length]
               
               return (
                  <g key={sIdx}>
                    {pointsData.length > 1 && (
                      <polyline points={pointsString} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                    {pointsData.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="8" fill={color} className="cursor-pointer">
                        <title>{series.name}: {p.v}</title>
                      </circle>
                    ))}
                  </g>
               )
            })}
            
            {chart.categories.map((cat, i) => {
              const x = padding + (i * ((w - 2 * padding) / Math.max(1, chart.categories.length - 1)))
              return (
                <text key={i} x={x} y={h - 15} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="14" fontWeight="500">
                  {cat}
                </text>
              )
            })}
          </svg>
        </div>
      </div>
    )
  }

  // Render Pie Chart
  const renderPieChart = () => {
    const series = chart.series[0]
    if (!series) return null

    const values = chart.categories.map((_, index) => Math.max(0, Number(series.values[index]) || 0))
    const total = values.reduce((sum, current) => sum + current, 0) || 1
    const descriptionLines = (slide.body || [])
      .flatMap((block) => {
        if (block.type === 'paragraph' && block.text) return [block.text]
        if (block.type === 'bullet' && block.items) return block.items
        return []
      })
      .map((line) => line.trim())
      .filter(Boolean)

    let currentAngle = 0
    const slices = values.map((value, index) => {
      const percentage = (value / total) * 100
      const angle = (value / total) * 360
      const startAngle = currentAngle
      currentAngle += angle
      return {
        value,
        percentage,
        startAngle,
        angle,
        color: seriesColors[index % seriesColors.length] || '#888',
        label: chart.categories[index] || `Data Point ${index + 1}`,
        description: descriptionLines[index] || `Represents ${percentage.toFixed(1)}% of the total distribution.`,
      }
    })

    const itemCount = slices.length
    const densityClass = itemCount >= 6 ? 'pie-data-grid--dense' : itemCount <= 2 ? 'pie-data-grid--compact' : ''
    const gridClass =
      itemCount === 1
        ? 'pie-data-grid--one'
        : itemCount === 2
          ? 'pie-data-grid--two'
          : 'pie-data-grid--multi'

    let gradientString = 'conic-gradient('
    if (slices.length === 0) {
      gradientString = '#f1f5f9' 
    } else {
      slices.forEach((slice, index) => {
        gradientString += `${slice.color} ${slice.startAngle}deg ${slice.startAngle + slice.angle}deg${index < slices.length - 1 ? ', ' : ')'}`
      })
    }

    return (
      <div className="pie-layout-shell">
        <EditableText
          value={slide.title}
          tag="h2"
          className="pie-layout-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />

        <div className="pie-layout-main">
          <div className="pie-visual-wrap">
            <div className="pie-visual-ring">
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ borderRadius: '50%' }}>
                  {slices.length === 0 ? (
                    <circle r="50" cx="50" cy="50" fill="#f1f5f9" />
                  ) : (
                    slices.map((slice, index) => {
                      const cx = 50, cy = 50, r = 50;
                      const startRad = (slice.startAngle - 90) * Math.PI / 180;
                      const endRad = (slice.startAngle + slice.angle - 90) * Math.PI / 180;
                      
                      const x1 = cx + r * Math.cos(startRad);
                      const y1 = cy + r * Math.sin(startRad);
                      
                      const x2 = cx + r * Math.cos(endRad);
                      const y2 = cy + r * Math.sin(endRad);
                      
                      const largeArcFlag = slice.angle > 180 ? 1 : 0;
                      
                      let d = '';
                      if (slice.angle >= 360) {
                        d = `M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0`;
                      } else {
                        d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                      }
                      
                      return (
                        <path
                          key={index}
                          d={d}
                          fill={slice.color}
                        />
                      );
                    })
                  )}
                <circle r="26" cx="50" cy="50" fill="#ffffff" />
              </svg>
            </div>
          </div>

          <div className={`pie-data-grid ${gridClass} ${densityClass}`}>
            {slices.map((slice, index) => (
              <div className="pie-data-item" key={`${slice.label}-${index}`}>
                <span className="pie-data-dot" style={{ backgroundColor: slice.color }} />
                <div className="pie-data-copy">
                  <span className="pie-data-heading">{slice.label}</span>
                  <span className="pie-data-description">
                    {slice.description} ({slice.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pie-layout-caption pie-layout-caption--left">
          {slide.subtitle?.trim() || ''}
        </div>
        <div className="pie-layout-accent" />
        <div className="pie-layout-caption pie-layout-caption--right">
          {chart.title?.trim() || ''}
        </div>
      </div>
    )
  }

  if (chart.type === 'bar') {
    if (slide.layout === 'chart-bar-compare') {
      return (
        <div className="slide-card-inner">
          {renderCompareBarChart()}
        </div>
      )
    }

    return (
      <div className="slide-card-inner chart-aether-shell">
        <div className="chart-aether-card">
          {renderBarChart()}
        </div>
      </div>
    )
  }

  if (chart.type === 'pie') {
    return (
      <div className="slide-card-inner">
        {renderPieChart()}
      </div>
    )
  }

  return (
    <div className="slide-card-inner flex flex-col h-full overflow-hidden">
      <EditableText
        value={slide.title}
        tag="h2"
        className="slide-title"
        editable={editable}
        onChange={(v) => onUpdate?.({ ...slide, title: v })}
      />
      
      {chart.title && (
        <EditableText
          value={chart.title}
          tag="h3"
          className="slide-subtitle !text-center !opacity-80 -mt-2 mb-6"
          editable={editable}
          onChange={(v) => {
             const newChart = { ...chart, title: v };
             onUpdate?.({ ...slide, chart: newChart });
          }}
        />
      )}
      
      <div className="flex-1 w-full bg-[var(--color-surface-alt)] rounded-xl mt-4 p-8 flex flex-col overflow-hidden">
        {chart.type === 'line' && renderLineChart()}
        
        {/* Simple Legend for Bar and Line */}
        {(chart.type === 'line') && (
           <div className="flex w-full items-center justify-center gap-6 mt-4 pt-4 border-t border-[var(--color-border)]">
              {chart.series.map((series, sIdx) => {
                return (
                  <div key={sIdx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: seriesColors[sIdx % seriesColors.length] }}></div>
                    <span className="text-sm font-medium text-[var(--color-text)] truncate max-w-[200px]">{series.name}</span>
                  </div>
                )
              })}
           </div>
        )}
      </div>
    </div>
  )
}
