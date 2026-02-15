/*
 * ═══════════════ NOTION WORDBANK DATA ═══════════════
 * Source: Notion Database 1c591d5f7b698098ad4dcd46f2ecc8e1
 * Collection: 1c591d5f-7b69-80e3-968e-000b0eb16143
 * Filter: App checkbox = checked, with conjugation data populated
 *
 * To refresh: ask Claude to re-fetch from the WordBank and regenerate
 * this WORDS array. Only words with App checkbox AND at least one complete
 * conjugation grid (casual or polite) will appear here.
 *
 * Last synced: 2026-02-13
 */
export const WORDS = [
  // くる — special verb
  {id:"kuru",hiragana:"くる",kanji:"来る",english:"to come (spatially or temporally), to approach, to arrive",conjugationType:"special verb",
   casual:{presentPos:"くる",presentNeg:"こない",pastPos:"きた",pastNeg:"こなかった"},
   polite:{presentPos:"きます",presentNeg:"きません",pastPos:"きました",pastNeg:"きませんでした"}},
  // つくる — godan verb
  {id:"tsukuru",hiragana:"つくる",kanji:"作る",english:"to make",conjugationType:"godan verb",
   casual:{presentPos:"つくる",presentNeg:"つくらない",pastPos:"つくった",pastNeg:"つくらなかった"},
   polite:{presentPos:"つくります",presentNeg:"つくりません",pastPos:"つくりました",pastNeg:"つくりませんでした"}},
  // おいしい — い adjective (polite forms not populated; casual-only)
  {id:"oishii",hiragana:"おいしい",kanji:"美味しい",english:"delicious; tasty",conjugationType:"い adjective",
   casual:{presentPos:"おいしい",presentNeg:"おいしくない",pastPos:"おいしかった",pastNeg:"おいしくなかった"},
   polite:null},
]