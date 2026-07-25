const SYMBOLS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
const TIMEFRAMES = ['5m', '15m', '1h', '4h', '1d']

export default function ControlBar({ symbol, setSymbol, timeframe, setTimeframe, onRefresh }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1 bg-panel border border-border rounded-lg p-1">
        {SYMBOLS.map((s) => (
          <button
            key={s}
            onClick={() => setSymbol(s)}
            className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
              symbol === s ? 'bg-accent text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-1 bg-panel border border-border rounded-lg p-1">
        {TIMEFRAMES.map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
              timeframe === t ? 'bg-accent text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <button
        onClick={onRefresh}
        className="px-3 py-1.5 rounded-md text-sm bg-panel border border-border text-slate-300 hover:border-accent transition-colors"
      >
        Refresh
      </button>
    </div>
  )
}
