import { supabase } from './supabase'

/**
 * Upsert a score record after a practice round.
 * If a record exists for (user_id, word, speech_level), update it; otherwise insert.
 */
export async function saveScore({ userId, word, wordType, speechLevel, correct, total }) {
  // Try to find existing record
  const { data: existing } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', userId)
    .eq('word', word)
    .eq('speech_level', speechLevel)
    .single()

  if (existing) {
    const newStreak = correct === total ? existing.streak + 1 : 0
    const { data, error } = await supabase
      .from('scores')
      .update({
        correct: existing.correct + correct,
        total: existing.total + total,
        streak: newStreak,
        best_streak: Math.max(existing.best_streak, newStreak),
        leaves: existing.leaves + (correct === total ? 1 : 0),
        last_practiced_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()
    return { data, error }
  } else {
    const isPerfect = correct === total
    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: userId,
        word,
        word_type: wordType,
        speech_level: speechLevel,
        correct,
        total,
        streak: isPerfect ? 1 : 0,
        best_streak: isPerfect ? 1 : 0,
        leaves: isPerfect ? 1 : 0,
      })
      .select()
      .single()
    return { data, error }
  }
}

/**
 * Save a session summary.
 */
export async function saveSession({ userId, wordsPracticed, correctAnswers, totalAnswers, leavesEarned, durationSeconds }) {
  return supabase.from('sessions').insert({
    user_id: userId,
    words_practiced: wordsPracticed,
    correct_answers: correctAnswers,
    total_answers: totalAnswers,
    leaves_earned: leavesEarned,
    duration_seconds: durationSeconds,
  })
}

/**
 * Get aggregate stats for a user.
 */
export async function getUserStats(userId) {
  const { data: scores } = await supabase
    .from('scores')
    .select('correct, total, leaves, best_streak')
    .eq('user_id', userId)

  if (!scores || scores.length === 0) {
    return { totalCorrect: 0, totalAnswers: 0, totalLeaves: 0, bestStreak: 0, wordsStudied: 0 }
  }

  return {
    totalCorrect: scores.reduce((s, r) => s + r.correct, 0),
    totalAnswers: scores.reduce((s, r) => s + r.total, 0),
    totalLeaves: scores.reduce((s, r) => s + r.leaves, 0),
    bestStreak: Math.max(...scores.map(r => r.best_streak)),
    wordsStudied: scores.length,
  }
}