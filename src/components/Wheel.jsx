import { useState } from 'react'
import { WHEEL } from '../lib/constants'
import { hexToRgba } from '../lib/helpers'

export default function Wheel({ onSelect, disabled, correctType }) {
  const n = WHEEL.length
  const segAngle = 360 / n
  const correctIdx = WHEEL.findIndex((w) => w.type === correctType)

  /* Random offset (1..n-1 segments away from correct) */
  const [rotation, setRotation] = useState(() => {
    let off
    do { off = Math.floor(Math.random() * n) } while (off === 0 && n > 1)
    return off * segAngle
  })
  const [fbClass, setFbClass] = useState('')

  /* Which segment is currently at the top position */
  const topIdx = ((correctIdx - Math.round(rotation / segAngle)) % n + n) % n
  const selectedType = WHEEL[topIdx].type

  const rotate = (dir) => {
    if (disabled) return
    setRotation((r) => r + dir * segAngle)
  }

  const handleConfirm = () => {
    if (disabled) return
    const ok = selectedType === correctType
    if (ok) {
      setFbClass('ok')
      setTimeout(() => {
        setFbClass('')
        onSelect(selectedType, WHEEL.findIndex((w) => w.type === selectedType), true)
      }, 650)
    } else {
      setFbClass('no')
      setTimeout(() => setFbClass(''), 400)
      onSelect(selectedType, WHEEL.findIndex((w) => w.type === selectedType), false)
    }
  }

  const cx = 110, cy = 110, r = 100

  /* Build pie slices. Correct slice at 12-o'clock (top). */
  const offsetDeg = -correctIdx * segAngle

  /* Tap the wheel to spin — left half rotates left, right half rotates right */
  const handleSvgClick = (e) => {
    if (disabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const mid = rect.width / 2
    rotate(x < mid ? 1 : -1)
  }

  return (
    <div className={`wheel-section ${fbClass}`}>
      <button className="wheel-confirm" onClick={handleConfirm} disabled={disabled}>
        Choose: {selectedType}
      </button>
      <svg className="wheel-svg" viewBox="0 0 220 220" onClick={handleSvgClick}
        style={{ cursor: disabled ? 'default' : 'pointer' }}>
        <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="#494850" strokeWidth="2" opacity="0.12" />
        {/* Rotating group */}
        <g style={{
          transform: `rotate(${offsetDeg + rotation}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {WHEEL.map((w, i) => {
            const halfSeg = segAngle / 2
            const a1 = (i * segAngle - 90 - halfSeg) * Math.PI / 180
            const a2 = ((i + 1) * segAngle - 90 - halfSeg) * Math.PI / 180
            const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
            const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2)
            const mid = (a1 + a2) / 2
            const tx = cx + r * 0.55 * Math.cos(mid), ty = cy + r * 0.55 * Math.sin(mid)
            const la = segAngle > 180 ? 1 : 0
            const counterRot = -(offsetDeg + rotation)
            const isTop = i === topIdx
            return (
              <g key={i}>
                <path
                  d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${la} 1 ${x2},${y2} Z`}
                  fill={isTop ? w.color : hexToRgba(w.color.replace(/^#/, '#'), 1)}
                  stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" opacity="1"
                />
                {/* Dark overlay to dim non-selected slices */}
                {!isTop && (
                  <path
                    d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${la} 1 ${x2},${y2} Z`}
                    fill="rgba(0,0,0,0.45)" stroke="none"
                    style={{ transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1)' }}
                  />
                )}
                <g style={{
                  transform: `rotate(${counterRot}deg)`,
                  transformOrigin: `${tx}px ${ty}px`,
                  transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)',
                }}>
                  <text x={tx} y={ty - 5} textAnchor="middle" dominantBaseline="central"
                    fill="#fff" fontFamily="'Zen Kaku Gothic New',sans-serif" fontWeight="700" fontSize="9"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)', opacity: isTop ? 1 : 0.4, transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1)' }}>
                    {w.line1}
                  </text>
                  <text x={tx} y={ty + 7} textAnchor="middle" dominantBaseline="central"
                    fill="#fff" fontFamily="'Zen Kaku Gothic New',sans-serif" fontWeight="600" fontSize="8"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)', opacity: isTop ? 1 : 0.4, transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1)' }}>
                    {w.line2}
                  </text>
                </g>
              </g>
            )
          })}
        </g>
        <circle cx={cx} cy={cy} r="5" fill="#494850" opacity="0.18" />
      </svg>
    </div>
  )
}
