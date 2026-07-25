export default function StatsPanel({ indicators, symbol, loading, error }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Stat label="Symbol" value={symbol} />
      <Stat
        label="Trend"
        value={indicators?.trend ?? '—'}
        tone={indicators?.trend === 'bullish' ? 'up' : indicators?.trend === 'bearish' ? 'down' : 'neutral'}
      />
      <Stat label="SMA(20)" value={indicators?.sma_20 ?? '—'} />
      <Stat label="RSI(14)" value={indicators?.rsi_14 ?? '—'} />
      {loading && <div className="col-span-full text-xs text-slate-500">Loading market data…</div>}
      {error && <div className="col-span-full text-xs text-down">{error}</div>}
    </div>
  )
}

function Stat({ label, value, tone = 'neutral' }) {
  const toneClass =
    tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : 'text-slate-200'
  return (
    <div className="bg-panel border border-border rounded-lg px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <div className={`font-mono text-lg ${toneClass}`}>{value}</div>
    </div>
  )
}
