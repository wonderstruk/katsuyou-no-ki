/* ═══════════════ CONSTANTS ═══════════════ */

/* Wheel segments — labels use WordBank Conjugation Type values */
export const WHEEL = [
  { type: 'ichidan verb', color: '#728b76', line1: 'ichidan', line2: 'verb' },
  { type: 'godan verb', color: '#da977c', line1: 'godan', line2: 'verb' },
  { type: 'special verb', color: '#39326c', line1: 'special', line2: 'verb' },
  { type: 'な adjective', color: '#126881', line1: 'な', line2: 'adjective' },
  { type: 'い adjective', color: '#c14e3e', line1: 'い', line2: 'adjective' },
]

export const SEASONS = ['春', '夏', '秋', '冬']
export const SEASON_LEAF = { 0: '#da977c', 1: '#728b76', 2: '#ab5d3c', 3: '#c6c5c3' }
export const SEASON_TRUNK = { 0: '#494850', 1: '#494850', 2: '#ab5d3c', 3: '#494850' }
export const SEASON_BG_TINT = {
  0: 'rgba(218,151,124,0.04)',
  1: 'rgba(114,139,118,0.03)',
  2: 'rgba(171,93,60,0.04)',
  3: 'rgba(57,50,108,0.04)',
}

export const CELLS = ['presentPos', 'pastPos', 'presentNeg', 'pastNeg']
export const CELL_LABELS = {
  presentPos: { en: 'Present +', ja: '現在肯定', placeholder: 'Present Positive' },
  pastPos: { en: 'Past +', ja: '過去肯定', placeholder: 'Past Positive' },
  presentNeg: { en: 'Present −', ja: '現在否定', placeholder: 'Present Negative' },
  pastNeg: { en: 'Past −', ja: '過去否定', placeholder: 'Past Negative' },
}
