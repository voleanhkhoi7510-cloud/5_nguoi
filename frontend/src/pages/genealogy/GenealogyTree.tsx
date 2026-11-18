import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Maximize, ZoomIn, ZoomOut } from 'lucide-react'
import { useGenealogy } from './GenealogyContext'
import { lifeSpan } from './genealogyData'
import { buildLayout, NODE_H, NODE_W } from './treeLayout'
import { getFamilyOf } from './rules'
import PersonDetail from './PersonDetail'

const MIN_K = 0.3
const MAX_K = 2
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

interface View {
  x: number
  y: number
  k: number
}

const controlClass = 'rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50'

export default function GenealogyTree() {
  const { persons, relations } = useGenealogy()
  const layout = useMemo(() => buildLayout(persons, relations), [persons, relations])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 })
  const boxRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ moved: false, startX: 0, startY: 0, viewX: 0, viewY: 0 })

  const selected = persons.find((p) => p.id === selectedId) ?? null

  // Người có quan hệ trực tiếp với người đang chọn sẽ được viền xanh
  const related = useMemo(() => {
    if (!selectedId) return new Set<string>()
    const f = getFamilyOf(selectedId, persons, relations)
    return new Set([...f.parents, ...f.spouses, ...f.children].map((p) => p.id))
  }, [selectedId, persons, relations])

  const zoomAt = useCallback((factor: number, cx: number, cy: number) => {
    setView((v) => {
      const k = clamp(v.k * factor, MIN_K, MAX_K)
      const r = k / v.k
      return { k, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r }
    })
  }, [])

  const zoomCenter = (factor: number) => {
    const el = boxRef.current
    if (el) zoomAt(factor, el.clientWidth / 2, el.clientHeight / 2)
  }

  const fit = useCallback(() => {
    const el = boxRef.current
    if (!el) return
    const pad = 24
    const k = clamp((el.clientWidth - pad * 2) / layout.width, MIN_K, 1)
    setView({ k, x: (el.clientWidth - layout.width * k) / 2, y: pad })
  }, [layout.width])

  // Chỉ tự vừa khung lần đầu mở trang, sau đó giữ nguyên vị trí người dùng đang xem
  useEffect(() => {
    fit()
  }, [])

  // Giữ Ctrl (hoặc Cmd) và cuộn chuột để phóng to, thu nhỏ. Cuộn thường vẫn cuộn trang.
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX - r.left, e.clientY - r.top)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    const d = drag.current
    d.moved = false
    d.startX = e.clientX
    d.startY = e.clientY
    d.viewX = view.x
    d.viewY = view.y

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - d.startX
      const dy = ev.clientY - d.startY
      if (!d.moved && Math.hypot(dx, dy) < 4) return
      d.moved = true
      setView((v) => ({ ...v, x: d.viewX + dx, y: d.viewY + dy }))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Cây gia phả</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <div
            ref={boxRef}
            onPointerDown={onPointerDown}
            className="relative h-[65vh] min-h-[420px] cursor-grab touch-none select-none overflow-hidden rounded-xl border border-slate-200 bg-white active:cursor-grabbing"
          >
            <svg width="100%" height="100%" role="group" aria-label="Cây gia phả">
              <rect
                width="100%"
                height="100%"
                fill="transparent"
                onClick={() => {
                  if (!drag.current.moved) setSelectedId(null)
                }}
              />
              <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
                <path d={layout.paths.join(' ')} className="fill-none stroke-slate-300" strokeWidth={2} />
                {layout.nodes.map(({ person: p, x, y }) => {
                  const isSelected = p.id === selectedId
                  const isRelated = related.has(p.id)
                  return (
                    <g
                      key={p.id}
                      transform={`translate(${x} ${y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${p.name}, ${lifeSpan(p)}`}
                      aria-pressed={isSelected}
                      className="cursor-pointer"
                      onClick={() => {
                        if (!drag.current.moved) setSelectedId(p.id)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedId(p.id)
                        }
                      }}
                    >
                      <rect
                        width={NODE_W}
                        height={NODE_H}
                        rx={10}
                        strokeWidth={isSelected || isRelated ? 2 : 1.5}
                        className={
                          isSelected
                            ? 'fill-slate-900 stroke-slate-900'
                            : isRelated
                              ? 'fill-blue-50 stroke-blue-500'
                              : 'fill-white stroke-slate-300'
                        }
                      />
                      <rect width={6} height={NODE_H} rx={3} className={p.gender === 'Nam' ? 'fill-blue-600' : 'fill-rose-500'} />
                      <text x={20} y={24} className={`text-[13px] font-medium ${isSelected ? 'fill-white' : 'fill-slate-900'}`}>
                        {p.name}
                      </text>
                      <text x={20} y={43} className={`text-[12px] ${isSelected ? 'fill-slate-300' : 'fill-slate-500'}`}>
                        {lifeSpan(p)}
                      </text>
                    </g>
                  )
                })}
              </g>
            </svg>

            <div className="absolute right-3 top-3 flex flex-col gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
              <button onClick={() => zoomCenter(1.25)} className={controlClass} aria-label="Phóng to" title="Phóng to">
                <ZoomIn size={18} />
              </button>
              <button onClick={() => zoomCenter(0.8)} className={controlClass} aria-label="Thu nhỏ" title="Thu nhỏ">
                <ZoomOut size={18} />
              </button>
              <button onClick={fit} className={controlClass} aria-label="Vừa khung" title="Vừa khung">
                <Maximize size={18} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-2"><span className="h-3 w-1.5 rounded bg-blue-600" />Nam</span>
            <span className="flex items-center gap-2"><span className="h-3 w-1.5 rounded bg-rose-500" />Nữ</span>
            <span>Kéo để di chuyển. Giữ Ctrl và cuộn chuột để phóng to.</span>
          </div>
        </div>

        <PersonDetail person={selected} persons={persons} relations={relations} onSelect={setSelectedId} />
      </div>
    </div>
  )
}
