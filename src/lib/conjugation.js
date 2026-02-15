/* ═══════════════ CONJUGATION ENGINE ═══════════════ */

const GODAN_MAP = {
  'う': ['わ', 'い'], 'く': ['か', 'き'], 'ぐ': ['が', 'ぎ'], 'す': ['さ', 'し'],
  'つ': ['た', 'ち'], 'ぬ': ['な', 'に'], 'ぶ': ['ば', 'び'], 'む': ['ま', 'み'], 'る': ['ら', 'り'],
}

const GODAN_TA = {
  'う': 'った', 'く': 'いた', 'ぐ': 'いだ', 'す': 'した',
  'つ': 'った', 'ぬ': 'んだ', 'ぶ': 'んだ', 'む': 'んだ', 'る': 'った',
}

export const POS_TO_TYPE = {
  'v1': 'ichidan verb', 'v5u': 'godan verb', 'v5k': 'godan verb', 'v5g': 'godan verb',
  'v5s': 'godan verb', 'v5t': 'godan verb', 'v5n': 'godan verb', 'v5b': 'godan verb',
  'v5m': 'godan verb', 'v5r': 'godan verb', 'vk': 'special verb', 'vs': 'special verb',
  'adj-i': 'い adjective', 'adj-ix': 'い adjective', 'adj-na': 'な adjective',
}

export function conjugate(reading, pos) {
  if (pos === 'vk') return {
    casual: { presentPos: 'くる', presentNeg: 'こない', pastPos: 'きた', pastNeg: 'こなかった' },
    polite: { presentPos: 'きます', presentNeg: 'きません', pastPos: 'きました', pastNeg: 'きませんでした' },
  }
  if (pos === 'vs') {
    const st = reading.endsWith('する') ? reading.slice(0, -2) : ''
    return {
      casual: { presentPos: st + 'する', presentNeg: st + 'しない', pastPos: st + 'した', pastNeg: st + 'しなかった' },
      polite: { presentPos: st + 'します', presentNeg: st + 'しません', pastPos: st + 'しました', pastNeg: st + 'しませんでした' },
    }
  }
  if (pos === 'v1') {
    const st = reading.slice(0, -1)
    return {
      casual: { presentPos: reading, presentNeg: st + 'ない', pastPos: st + 'た', pastNeg: st + 'なかった' },
      polite: { presentPos: st + 'ます', presentNeg: st + 'ません', pastPos: st + 'ました', pastNeg: st + 'ませんでした' },
    }
  }
  if (pos.startsWith('v5')) {
    const lc = reading.slice(-1), st = reading.slice(0, -1), row = GODAN_MAP[lc]
    if (!row) return null
    const neg = reading === 'ある' ? 'ない' : st + row[0] + 'ない'
    const negPast = reading === 'ある' ? 'なかった' : st + row[0] + 'なかった'
    const ta = reading === 'いく' ? st + 'った' : st + GODAN_TA[lc]
    return {
      casual: { presentPos: reading, presentNeg: neg, pastPos: ta, pastNeg: negPast },
      polite: { presentPos: st + row[1] + 'ます', presentNeg: st + row[1] + 'ません', pastPos: st + row[1] + 'ました', pastNeg: st + row[1] + 'ませんでした' },
    }
  }
  if (pos === 'adj-ix') return {
    casual: { presentPos: 'いい', presentNeg: 'よくない', pastPos: 'よかった', pastNeg: 'よくなかった' },
    polite: null,
  }
  if (pos === 'adj-i') {
    const st = reading.slice(0, -1)
    return {
      casual: { presentPos: reading, presentNeg: st + 'くない', pastPos: st + 'かった', pastNeg: st + 'くなかった' },
      polite: null,
    }
  }
  if (pos === 'adj-na') return {
    casual: { presentPos: reading + 'だ', presentNeg: reading + 'じゃない', pastPos: reading + 'だった', pastNeg: reading + 'じゃなかった' },
    polite: { presentPos: reading + 'です', presentNeg: reading + 'じゃありません', pastPos: reading + 'でした', pastNeg: reading + 'じゃありませんでした' },
  }
  return null
}

export function jmdictToWord(e) {
  const [rd, kj, en, pos, lv] = e
  const forms = conjugate(rd, pos)
  if (!forms) return null
  return {
    id: 'jm-' + rd,
    hiragana: rd,
    kanji: kj || rd,
    english: en,
    conjugationType: POS_TO_TYPE[pos],
    casual: forms.casual,
    polite: forms.polite,
    jlpt: lv,
  }
}