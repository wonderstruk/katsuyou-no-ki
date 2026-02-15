import { useState, useRef, useCallback } from 'react'
import { toHiragana } from 'wanakana'
import { useAuth } from '../contexts/AuthContext'
import { saveScore, saveSession } from '../lib/scores'
import { WHEEL, SEASONS, SEASON_BG_TINT, CELLS, CELL_LABELS } from '../lib/constants'
import { shuffle, norm, hexToRgba } from '../lib/helpers'
import { jmdictToWord } from '../lib/conjugation'
import { WORDS } from '../data/notionWords'
import { JMDICT_DATA } from '../data/jmdictWords'
import Wheel from './Wheel'
import TreeView from './TreeView'

export default function GameApp() {
  const { user, profile, preferences, signOut, updatePreferences } = useAuth()

  // Game state
  const [phase, setPhase] = useState('welcome')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [season, setSeason] = useState(0)
  const [treeStage, setTreeStage] = useState(0)
  const [correctGridsTotal, setCorrectGridsTotal] = useState(0)
  const [leafCycleActive, setLeafCycleActive] = useState(false)
  const [leafCycleCount, setLeafCycleCount] = useState(0)
  const [leafCycleTarget, setLeafCycleTarget] = useState(0)
  const [inputMode, setInputMode] = useState(preferences?.input_mode || 'romaji')
  const [showSettings, setShowSettings] = useState(false)

  // Word source settings
  const [wordSource, setWordSource] = useState('notion')
  const [jlptLevels, setJlptLevels] = useState({ 5: true, 4: true, 3: false, 2: false, 1: false })
  const toggleJlpt = (lv) => setJlptLevels((p) => ({ ...p, [lv]: !p[lv] }))
  const getActiveWords = () => {
    if (wordSource === 'notion') return WORDS
    return JMDICT_DATA.filter((d) => jlptLevels[d[4]]).map(jmdictToWord).filter(Boolean)
  }

  // Nobori color state
  const [noboriColor, setNoboriColor] = useState(null)
  const [noboriFlash, setNoboriFlash] = useState(false)

  // Per-word state
  const [queue, setQueue] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [mode, setMode] = useState('casual')
  const [wheelDone, setWheelDone] = useState(false)
  const [wheelFirstTry, setWheelFirstTry] = useState(true)
  const [answers, setAnswers] = useState({ presentPos: '', pastPos: '', presentNeg: '', pastNeg: '' })
  const [attempts, setAttempts] = useState({ presentPos: 0, pastPos: 0, presentNeg: 0, pastNeg: 0 })
  const [cellOk, setCellOk] = useState({ presentPos: false, pastPos: false, presentNeg: false, pastNeg: false })
  const [cellRevealed, setCellRevealed] = useState({ presentPos: false, pastPos: false, presentNeg: false, pastNeg: false })
  const [cellShake, setCellShake] = useState({})
  const [cellFlash, setCellFlash] = useState({})
  const [gridDone, setGridDone] = useState(false)
  const [wordScore, setWordScore] = useState(0)
  const [recentIds, setRecentIds] = useState([])
  const [wheelKey, setWheelKey] = useState(0)

  // Session tracking
  const sessionStartRef = useRef(null)
  const sessionStatsRef = useRef({ wordsPracticed: 0, correctAnswers: 0, totalAnswers: 0, leavesEarned: 0 })

  const inputRefs = useRef({})
  const word = queue[qIdx] || null
  const correct = word ? word[mode] : {}

  const startSession = useCallback(() => {
    const pool = getActiveWords()
    if (pool.length === 0) return
    const q = shuffle(pool)
    setQueue(q)
    setQIdx(0)
    sessionStartRef.current = Date.now()
    sessionStatsRef.current = { wordsPracticed: 0, correctAnswers: 0, totalAnswers: 0, leavesEarned: 0 }
    nextWord(q, 0, [])
  }, [wordSource, jlptLevels])

  const nextWord = (q, idx, recent) => {
    const m = Math.random() < 0.5 ? 'casual' : 'polite'
    const w = q[idx]
    let finalMode = m
    if (!w[m] || !w[m].presentPos) {
      finalMode = m === 'casual' ? 'polite' : 'casual'
    }
    setMode(finalMode)
    setPhase('classify')
    setWheelDone(false)
    setWheelFirstTry(true)
    setNoboriColor(null)
    setNoboriFlash(false)
    setAnswers({ presentPos: '', pastPos: '', presentNeg: '', pastNeg: '' })
    setAttempts({ presentPos: 0, pastPos: 0, presentNeg: 0, pastNeg: 0 })
    setCellOk({ presentPos: false, pastPos: false, presentNeg: false, pastNeg: false })
    setCellRevealed({ presentPos: false, pastPos: false, presentNeg: false, pastNeg: false })
    setCellShake({})
    setCellFlash({})
    setGridDone(false)
    setWordScore(0)
    setWheelKey((k) => k + 1)
  }

  const advanceWord = () => {
    let nIdx = qIdx + 1
    let nQueue = queue
    const newRecent = [...recentIds.slice(-3), word.id]
    setRecentIds(newRecent)
    if (nIdx >= nQueue.length) {
      const active = getActiveWords()
      let pool = active.filter((w) => !newRecent.includes(w.id))
      if (pool.length < 3) pool = active
      nQueue = shuffle(pool)
      nIdx = 0
      setQueue(nQueue)
    }
    setQIdx(nIdx)
    nextWord(nQueue, nIdx, newRecent)
  }

  // Wheel callback
  const onWheelSelect = (type, idx, ok) => {
    if (ok) {
      const segColor = WHEEL[idx].color
      setWheelDone(true)
      setNoboriColor(segColor)
      setNoboriFlash(true)
      setTimeout(() => setNoboriFlash(false), 900)
      setTimeout(() => setPhase('grid'), 700)
    } else {
      setWheelFirstTry(false)
    }
  }

  // Grid submit
  const onGridSubmit = () => {
    if (gridDone) return
    const newCellOk = { ...cellOk }
    const newAttempts = { ...attempts }
    const newRevealed = { ...cellRevealed }
    const newShake = {}
    const newFlash = {}
    let pts = 0

    CELLS.forEach((k) => {
      if (newCellOk[k] || newRevealed[k]) return
      const userAns = norm(answers[k])
      const rightAns = norm(correct[k])
      if (userAns === rightAns) {
        newCellOk[k] = true
        newFlash[k] = true
        const att = newAttempts[k] + 1
        newAttempts[k] = att
        if (att === 1) pts += 1
        else if (att === 2) pts += 0.5
        else if (att === 3) pts += 0.25
      } else {
        const att = newAttempts[k] + 1
        newAttempts[k] = att
        if (att >= 3) {
          newRevealed[k] = true
        } else {
          newShake[k] = true
        }
      }
    })

    setCellOk(newCellOk)
    setAttempts(newAttempts)
    setCellRevealed(newRevealed)
    setCellShake(newShake)
    setCellFlash(newFlash)
    setTimeout(() => setCellShake({}), 400)
    setTimeout(() => setCellFlash({}), 650)

    const allDone = CELLS.every((k) => newCellOk[k] || newRevealed[k])
    const allCorrect = CELLS.every((k) => newCellOk[k])
    const allFirstTry = CELLS.every((k) => newCellOk[k] && newAttempts[k] === 1)

    // Track session stats
    const correctCount = CELLS.filter((k) => newCellOk[k] && !cellOk[k]).length
    sessionStatsRef.current.correctAnswers += correctCount
    sessionStatsRef.current.totalAnswers += CELLS.filter((k) => !cellOk[k] && !cellRevealed[k]).length

    if (allDone) {
      if (allFirstTry) pts += 2
      if (wheelFirstTry) pts += 1

      setWordScore(pts)
      setScore((s) => s + pts)
      setGridDone(true)
      sessionStatsRef.current.wordsPracticed += 1

      if (allFirstTry) {
        setStreak((s) => { const n = s + 1; setBestStreak((b) => Math.max(b, n)); return n })
      } else {
        setStreak(0)
      }

      if (allCorrect) {
        const newTotal = correctGridsTotal + 1
        setCorrectGridsTotal(newTotal)
        sessionStatsRef.current.leavesEarned += 1

        // Save score to Supabase if logged in
        if (user) {
          saveScore({
            userId: user.id,
            word: word.hiragana,
            wordType: word.conjugationType,
            speechLevel: mode,
            correct: correctCount,
            total: CELLS.length,
          })
        }

        if (leafCycleActive) {
          const newLC = leafCycleCount + 1
          setLeafCycleCount(newLC)
          if (newLC >= leafCycleTarget) {
            setLeafCycleActive(false)
            setLeafCycleCount(0)
            setLeafCycleTarget(0)
            setSeason((s) => (s + 1) % 4)
          }
        } else {
          const gridsPerStage = 10
          const newStage = Math.min(Math.floor(newTotal / gridsPerStage), 10)
          if (newStage > treeStage) {
            setTreeStage(newStage)
            if (newStage >= 10 && !leafCycleActive) {
              setLeafCycleActive(true)
              setLeafCycleCount(0)
              setLeafCycleTarget(10)
            }
          }
        }
      }
    }
  }

  const onInputChange = (k, val) => {
    const converted = inputMode === 'romaji' ? toHiragana(val, { IMEMode: true }) : val
    setAnswers((a) => ({ ...a, [k]: converted }))
  }

  const onInputKey = (e, k) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault()
      if (e.key === 'Enter' && !e.shiftKey) {
        const allFilled = CELLS.every((c) => cellOk[c] || cellRevealed[c] || answers[c].trim())
        if (allFilled) { onGridSubmit(); return }
      }
      const idx = CELLS.indexOf(k)
      const nextIdx = (idx + 1) % CELLS.length
      const nextKey = CELLS[nextIdx]
      if (inputRefs.current[nextKey]) inputRefs.current[nextKey].focus()
    }
  }

  const resetAll = () => {
    setScore(0); setStreak(0); setBestStreak(0); setSeason(0); setTreeStage(0)
    setCorrectGridsTotal(0); setLeafCycleActive(false); setLeafCycleCount(0)
    setLeafCycleTarget(0); setRecentIds([]); setNoboriColor(null)
    setPhase('welcome'); setShowSettings(false)
  }

  const handleInputModeChange = (newMode) => {
    setInputMode(newMode)
    if (user) updatePreferences({ input_mode: newMode })
  }

  const seasonKanji = SEASONS[season]

  /* Nobori background style */
  const noboriStyle = {}
  if (noboriColor) {
    noboriStyle.backgroundColor = hexToRgba(noboriColor, 0.14)
  }

  return (
    <>
      {/* Top bar */}
      <div className="top-bar">
        <div className="season-badge">{seasonKanji}</div>
        <div className="stats">
          <div className="stat"><div className="stat-label">Score</div><div className="stat-val">{Math.floor(score)}</div></div>
          <div className="stat"><div className="stat-label">Streak</div><div className="stat-val streak-val">{streak}</div></div>
          <div className="stat"><div className="stat-label">Tree</div><div className="stat-val">{Math.min(treeStage, 10)}/10</div></div>
        </div>
        <button className="gear-btn" onClick={() => setShowSettings(true)} title="Settings">&#9881;</button>
      </div>

      <div className="main" style={{ background: SEASON_BG_TINT[season] }}>
        {/* ── Nobori Banner ── */}
        <div className={`nobori${noboriFlash ? ' flash' : ''}`} style={noboriStyle}>
          <div className="nobori-rod" />
          <div className="nobori-content">
            {/* Welcome */}
            {phase === 'welcome' && (
              <div className="welcome">
                <div className="app-title">活用の木</div>
                <div className="app-sub">The Conjugation Tree</div>
                {profile && (
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                    Welcome, {profile.display_name}
                  </div>
                )}
                <div className="welcome-stats">
                  Score: {Math.floor(score)} &nbsp;|&nbsp; Best streak: {bestStreak}<br />
                  Season: {seasonKanji} &nbsp;|&nbsp; Tree: stage {Math.min(treeStage, 10)}/10<br />
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    {wordSource === 'notion'
                      ? `Words: ${WORDS.length} from Notion WordBank`
                      : `Words: ${getActiveWords().length} from JMdict (${Object.entries(jlptLevels).filter(([, v]) => v).map(([k]) => 'N' + k).join(', ') || 'none selected'})`
                    }
                  </span>
                </div>
                {getActiveWords().length > 0 ? (
                  <button className="btn-begin" onClick={startSession}>始める — Begin</button>
                ) : (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(194,59,34,0.06)', borderRadius: '8px', border: '1px solid rgba(194,59,34,0.15)', maxWidth: '300px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Shippori Mincho',serif", fontSize: '1rem', color: 'var(--vermillion)', marginBottom: '0.4rem' }}>言葉がありません</div>
                    <div style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--ink)', opacity: 0.75 }}>
                      {wordSource === 'notion'
                        ? <>No words found in the WordBank with the <strong>App</strong> checkbox enabled. Open your Notion WordBank, check the App box on words with conjugation data, then ask Claude to refresh this app.</>
                        : <>No JLPT levels selected. Open Settings and check at least one level (N5–N1).</>
                      }
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Classify — word card on nobori */}
            {phase === 'classify' && word && (
              <div className="word-card">
                <div className="word-hira">{word.hiragana}</div>
                {word.kanji && word.kanji !== word.hiragana && <div className="word-kanji">{word.kanji}</div>}
                <div className="word-eng">{word.english}
                  {word.jlpt && <span className="jlpt-badge" style={{ background: ({ 5: '#4CAF50', 4: '#2196F3', 3: '#FF9800', 2: '#E91E63', 1: '#9C27B0' })[word.jlpt] }}>N{word.jlpt}</span>}
                </div>
                <div className="mode-badge">{mode === 'polite' ? '丁寧 Polite' : 'カジュアル Casual'}</div>
              </div>
            )}

            {/* Grid phase — word card + conjugation grid on nobori */}
            {phase === 'grid' && word && (
              <>
                <div className="word-card">
                  <div className="word-hira" style={{ fontSize: '2rem' }}>{word.hiragana}</div>
                  {word.kanji && word.kanji !== word.hiragana && <div className="word-kanji" style={{ fontSize: '1rem' }}>{word.kanji}</div>}
                  <div className="mode-badge" style={{ marginTop: '0.3rem' }}>{mode === 'polite' ? '丁寧 Polite' : 'カジュアル Casual'}</div>
                </div>

                <div className="grid-area">
                  <div className="conj-grid">
                    {CELLS.map((k) => {
                      const lb = CELL_LABELS[k]
                      const isOk = cellOk[k]
                      const isRevealed = cellRevealed[k]
                      const att = attempts[k]
                      const shaking = cellShake[k]
                      const flashing = cellFlash[k]
                      let cls = 'ginput'
                      if (isOk) cls += ' ok'
                      else if (isRevealed) cls += ' shown'
                      else if (shaking) cls += ' err'
                      if (flashing) cls += ' flash-ok'

                      return (
                        <div className="gcell" key={k}>
                          {isRevealed ? (
                            <div className={cls} style={{ padding: '0.4rem 0.35rem', textAlign: 'center' }}>{correct[k]}</div>
                          ) : (
                            <input
                              ref={(el) => { inputRefs.current[k] = el }}
                              className={cls}
                              value={isOk ? correct[k] : answers[k]}
                              onChange={(e) => !isOk && onInputChange(k, e.target.value)}
                              onKeyDown={(e) => onInputKey(e, k)}
                              disabled={isOk || gridDone}
                              placeholder={lb.placeholder}
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck="false"
                            />
                          )}
                          <div className={`gcell-hint ${isOk ? 'green' : att > 0 && !isRevealed ? 'red' : ''}`}>
                            {isOk ? '\u2713' : isRevealed ? 'revealed' : att > 0 ? `${3 - att} ${3 - att === 1 ? 'try' : 'tries'} left` : '\u00A0'}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {!gridDone ? (
                    <button className="btn-submit" onClick={onGridSubmit}>Check Answers</button>
                  ) : (
                    <>
                      <div className={`result-banner ${wordScore >= 7 ? 'perfect' : 'good'}`}>
                        {wordScore >= 7 ? 'Perfect! +7' : `+${wordScore.toFixed(1)} points`}
                        {CELLS.every((k) => cellOk[k] && attempts[k] === 1) && ' \u2014 All first try!'}
                      </div>
                      <button className="btn-next" onClick={advanceWord}>Next Word →</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Wheel (below nobori, during classify phase) ── */}
        {phase === 'classify' && word && (
          <Wheel
            key={wheelKey}
            onSelect={onWheelSelect}
            disabled={wheelDone}
            correctType={word.conjugationType}
          />
        )}

        {/* ── Tree (bottom) ── */}
        <div className="tree-section">
          <div className="tree-wrap">
            <div className="tree-info">
              {leafCycleActive
                ? `Re-growing: ${leafCycleCount}/${leafCycleTarget}`
                : `Stage ${Math.min(treeStage, 10)}/10`
              }
            </div>
            <TreeView
              stage={Math.min(treeStage, 10)}
              season={season}
              correctGrids={correctGridsTotal}
              leafCycleActive={leafCycleActive}
              leafCycleCount={leafCycleCount}
              leafCycleTarget={leafCycleTarget}
            />
            <div className="leaf-counter">
              {leafCycleActive
                ? `${leafCycleCount} / ${leafCycleTarget} leaves`
                : `${correctGridsTotal % 10} / 10 to next stage`
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── Settings Modal ── */}
      {showSettings && (
        <div className="overlay" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSettings(false)}>&times;</button>
            <h2>Settings</h2>

            {user && (
              <div className="sett-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                {profile?.avatar_url && (
                  <img src={profile.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{profile?.display_name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{user.email}</div>
                </div>
                <button
                  onClick={signOut}
                  style={{ marginLeft: 'auto', padding: '0.3rem 0.8rem', border: '1px solid #ccc', borderRadius: '4px', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Sign Out
                </button>
              </div>
            )}

            <div className="sett-row">
              <div className="sett-label">Word Source</div>
              <div className="sett-desc">Choose where practice words come from</div>
              <div className="sett-btns">
                <button className={`sbtn ${wordSource === 'notion' ? 'on' : ''}`} onClick={() => setWordSource('notion')}>Notion WordBank</button>
                <button className={`sbtn ${wordSource === 'jmdict' ? 'on' : ''}`} onClick={() => setWordSource('jmdict')}>JMdict Dictionary</button>
              </div>
              {wordSource === 'jmdict' && (<>
                <div className="sett-desc" style={{ marginTop: '0.6rem' }}>JLPT Levels (check all that apply)</div>
                <div className="sett-jlpt">
                  {[5, 4, 3, 2, 1].map((lv) => (
                    <label key={lv} className="sett-cb">
                      <input type="checkbox" checked={!!jlptLevels[lv]} onChange={() => toggleJlpt(lv)} />
                      N{lv}
                    </label>
                  ))}
                </div>
                <div className={`sett-word-ct ${getActiveWords().length === 0 ? 'zero' : ''}`}>
                  {getActiveWords().length} words available (verbs & adjectives only)
                </div>
              </>)}
              {wordSource === 'notion' && (
                <div className="sett-word-ct">{WORDS.length} words from Notion WordBank</div>
              )}
            </div>
            <hr className="sett-divider" />
            <div className="sett-row">
              <div className="sett-label">Input Mode</div>
              <div className="sett-desc">Romaji auto-converts to hiragana as you type</div>
              <div className="sett-btns">
                <button className={`sbtn ${inputMode === 'romaji' ? 'on' : ''}`} onClick={() => handleInputModeChange('romaji')}>Romaji</button>
                <button className={`sbtn ${inputMode === 'hiragana' ? 'on' : ''}`} onClick={() => handleInputModeChange('hiragana')}>ひらがな</button>
              </div>
            </div>
            <hr className="sett-divider" />
            <div className="sett-row">
              <div className="sett-label">Stats</div>
              <div className="sett-desc">
                Total score: {Math.floor(score)}<br />
                Best streak: {bestStreak}<br />
                Correct grids: {correctGridsTotal}<br />
                Season: {SEASONS[season]} ({['Spring', 'Summer', 'Autumn', 'Winter'][season]})
              </div>
            </div>
            <button className="btn-reset" onClick={resetAll}>Reset All Progress</button>
            {wordSource === 'jmdict' && (
              <div className="sett-attr">
                Dictionary data from <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noopener">JMdict</a> by Jim Breen, <a href="https://www.edrdg.org/" target="_blank" rel="noopener">EDRDG</a>. Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}