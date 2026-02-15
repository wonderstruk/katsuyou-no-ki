/* ═══════════════ CONSTANTS ═══════════════ */

/* Wheel segments — labels use WordBank Conjugation Type values */
export const WHEEL = [
  { type: 'ichidan verb', color: '#9E9E9E', line1: 'ichidan', line2: 'verb' },
  { type: 'godan verb', color: '#FF9D43', line1: 'godan', line2: 'verb' },
  { type: 'special verb', color: '#9B6BA8', line1: 'special', line2: 'verb' },
  { type: 'な adjective', color: '#6B9E3D', line1: 'な', line2: 'adjective' },
  { type: 'い adjective', color: '#D84C4C', line1: 'い', line2: 'adjective' },
]

export const SEASONS = ['春', '夏', '秋', '冬']
export const SEASON_LEAF = { 0: '#F4B4C0', 1: '#2E8B2E', 2: '#E07020', 3: '#C8DDE8' }
export const SEASON_TRUNK = { 0: '#7A5C30', 1: '#5B3A1E', 2: '#5B3A1E', 3: '#5F5248' }
export const SEASON_BG_TINT = {
  0: 'rgba(255,182,193,0.04)',
  1: 'rgba(34,139,34,0.03)',
  2: 'rgba(255,140,0,0.04)',
  3: 'rgba(200,220,240,0.05)',
}

export const CELLS = ['presentPos', 'pastPos', 'presentNeg', 'pastNeg']
export const CELL_LABELS = {
  presentPos: { en: 'Present +', ja: '現在肯定', placeholder: 'Present Positive' },
  pastPos: { en: 'Past +', ja: '過去肯定', placeholder: 'Past Positive' },
  presentNeg: { en: 'Present −', ja: '現在否定', placeholder: 'Present Negative' },
  pastNeg: { en: 'Past −', ja: '過去否定', placeholder: 'Past Negative' },
}