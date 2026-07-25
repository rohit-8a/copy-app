import { useState } from 'react'
import { api } from '../lib/api'

const TONE_STYLES = {
  bullish: 'text-up border-up/40 bg-up/10',
  bearish: 'text-down border-down/40 bg-down/10',
  neutral: 'text-slate-300 border-border bg-panel',
  unknown: 'text-slate-500 border-border bg-panel',
}

export default function SentimentPanel() {
  const [headlinesText, setHeadlinesText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    const headlines = headlinesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (headlines.length === 0) {
      setError('Add at least one headline, one per line.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await api.sentiment(headlines)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tone = TONE_STYLES[result?.sentiment] || TONE_STYLES.unknown

  return (
    <div className="bg-panel border border-border rounded-lg p-4 space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-200">AI Sentiment</h2>
        <p className="text-xs text-slate-500">
          Paste news headlines (one per line) and get an AI read on market sentiment.
        </p>
      </div>

      <textarea
        value={headlinesText}
        onChange={(e) => setHeadlinesText(e.target.value)}
        placeholder={'Fed signals rate pause amid cooling inflation\nBTC ETF inflows hit 3-month high'}
        rows={4}
        className="w-full bg-base border border-border rounded-md p-2 text-sm text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-accent"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-3 py-1.5 rounded-md text-sm bg-accent text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? 'Analyzing…' : 'Analyze Sentiment'}
      </button>

      {error && <p className="text-xs text-down">{error}</p>}

      {result && (
        <div className={`border rounded-md px-3 py-2 ${tone}`}>
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase text-sm">{result.sentiment}</span>
            <span className="text-xs text-slate-500">
              confidence: {Math.round((result.confidence ?? 0) * 100)}%
            </span>
          </div>
          {result.summary && <p className="text-sm mt-1 text-slate-300">{result.summary}</p>}
        </div>
      )}
    </div>
  )
}
