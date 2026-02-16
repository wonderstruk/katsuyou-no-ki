import { useRef } from 'react'
import { SEASON_LEAF, SEASON_TRUNK } from '../lib/constants'

export default function TreeView({ stage, season, correctGrids, leafCycleActive, leafCycleCount, leafCycleTarget }) {
  const lc = SEASON_LEAF[season]
  const tc = SEASON_TRUNK[season]
  const allLeaves = []

  const addLeaves = (cx, cy, spread, count) => {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const r = Math.random() * spread
      allLeaves.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, s: 0.6 + Math.random() * 0.5 })
    }
  }

  if (stage >= 1) addLeaves(200, 150, 15, 4)
  if (stage >= 2) addLeaves(200, 145, 30, 6)
  if (stage >= 3) { addLeaves(175, 155, 20, 5); addLeaves(225, 155, 20, 5) }
  if (stage >= 4) { addLeaves(155, 170, 25, 6); addLeaves(245, 170, 25, 6) }
  if (stage >= 5) { addLeaves(140, 190, 25, 7); addLeaves(260, 190, 25, 7); addLeaves(200, 130, 20, 5) }
  if (stage >= 6) { addLeaves(125, 210, 28, 8); addLeaves(275, 210, 28, 8); addLeaves(200, 120, 25, 6) }
  if (stage >= 7) { addLeaves(115, 230, 30, 9); addLeaves(285, 230, 30, 9); addLeaves(170, 140, 22, 6); addLeaves(230, 140, 22, 6) }
  if (stage >= 8) { addLeaves(105, 245, 32, 10); addLeaves(295, 245, 32, 10); addLeaves(200, 110, 28, 7) }
  if (stage >= 9) { addLeaves(95, 258, 34, 11); addLeaves(305, 258, 34, 11); addLeaves(160, 130, 24, 7); addLeaves(240, 130, 24, 7) }
  if (stage >= 10) {
    addLeaves(85, 270, 36, 12); addLeaves(315, 270, 36, 12)
    addLeaves(200, 100, 30, 10); addLeaves(150, 160, 26, 8); addLeaves(250, 160, 26, 8)
  }

  let visibleCount = allLeaves.length
  if (leafCycleActive && leafCycleTarget > 0) {
    visibleCount = Math.floor((leafCycleCount / leafCycleTarget) * allLeaves.length)
  }

  const branches = []
  if (stage >= 3) {
    branches.push('M197,200 Q170,170 150,150')
    branches.push('M203,200 Q230,170 250,150')
  }
  if (stage >= 5) {
    branches.push('M195,240 Q155,210 130,195')
    branches.push('M205,240 Q245,210 270,195')
  }
  if (stage >= 7) {
    branches.push('M193,260 Q140,235 115,225')
    branches.push('M207,260 Q260,235 285,225')
    branches.push('M196,190 Q175,160 155,145')
    branches.push('M204,190 Q225,160 245,145')
  }
  if (stage >= 9) {
    branches.push('M191,275 Q125,255 100,250')
    branches.push('M209,275 Q275,255 300,250')
  }

  const atmos = []
  const atmosRef = useRef({ spring: null, winter: null, lastSeason: null })
  if (atmosRef.current.lastSeason !== season) {
    atmosRef.current.lastSeason = season
    atmosRef.current.spring = null
    atmosRef.current.winter = null
  }
  if (season === 0 && !atmosRef.current.spring) {
    atmosRef.current.spring = Array.from({ length: 8 }, () => ({
      cx: 80 + Math.random() * 240, cy: 40 + Math.random() * 120, r: 1.5 + Math.random() * 2,
      op: 0.3 + Math.random() * 0.3, cyEnd: 350 + Math.random() * 50, cxEnd: 60 + Math.random() * 280,
      durY: 8 + Math.random() * 6, durX: 10 + Math.random() * 8,
    }))
  }
  if (season === 3 && !atmosRef.current.winter) {
    atmosRef.current.winter = Array.from({ length: 12 }, () => ({
      cx: 60 + Math.random() * 280, cy: 20 + Math.random() * 80, r: 1 + Math.random() * 1.5,
      op: 0.4 + Math.random() * 0.3, cyStart: 20 + Math.random() * 40, cxEnd: 50 + Math.random() * 300,
      durY: 6 + Math.random() * 8, durX: 12 + Math.random() * 6,
    }))
  }
  if (season === 0 && atmosRef.current.spring) {
    atmosRef.current.spring.forEach((p, i) => atmos.push(
      <circle key={`petal-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="#da977c" opacity={p.op}>
        <animate attributeName="cy" values={`${p.cy};${p.cyEnd}`} dur={`${p.durY}s`} repeatCount="indefinite" />
        <animate attributeName="cx" values={`${p.cx};${p.cxEnd}`} dur={`${p.durX}s`} repeatCount="indefinite" />
      </circle>
    ))
  }
  if (season === 3 && atmosRef.current.winter) {
    atmosRef.current.winter.forEach((s, i) => atmos.push(
      <circle key={`snow-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill="#c6c5c3" opacity={s.op}>
        <animate attributeName="cy" values={`${s.cyStart};380`} dur={`${s.durY}s`} repeatCount="indefinite" />
        <animate attributeName="cx" values={`${s.cx};${s.cxEnd}`} dur={`${s.durX}s`} repeatCount="indefinite" />
      </circle>
    ))
  }

  const trunkHeight = Math.min(stage * 22 + 40, 250)
  const trunkWidth = Math.min(3 + stage * 1.2, 16)

  return (
    <svg viewBox="0 0 400 400" className="tree-svg" style={{ overflow: 'visible' }}>
      {atmos}
      <ellipse cx="200" cy="370" rx={60 + stage * 3} ry="18" fill="#ab5d3c" opacity="0.25" />
      <ellipse cx="200" cy="368" rx={55 + stage * 2.5} ry="14" fill="#da977c" opacity="0.2" />
      {stage >= 1 && <>
        <path
          d={`M${200 - trunkWidth / 2},370 Q${198 - trunkWidth / 3},${370 - trunkHeight * 0.5} ${197},${370 - trunkHeight}
              L${203},${370 - trunkHeight} Q${202 + trunkWidth / 3},${370 - trunkHeight * 0.5} ${200 + trunkWidth / 2},370 Z`}
          fill={tc} opacity="0.75"
        />
        <path
          d={`M${199},368 Q${199},${370 - trunkHeight * 0.6} ${199},${372 - trunkHeight}
              L${201},${372 - trunkHeight} Q${201},${370 - trunkHeight * 0.6} ${201},368 Z`}
          fill={tc} opacity="0.35"
        />
        {branches.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={tc} strokeWidth={2.5 - i * 0.1} opacity="0.6" strokeLinecap="round" />
        ))}
      </>}
      {allLeaves.slice(0, visibleCount).map((l, i) => (
        <ellipse key={i} cx={l.x} cy={l.y} rx={5 * l.s} ry={8 * l.s} fill={lc}
          opacity={0.65 + Math.random() * 0.2}
          transform={`rotate(${Math.random() * 60 - 30},${l.x},${l.y})`}
        />
      ))}
    </svg>
  )
}
