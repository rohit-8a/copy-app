import { useState } from 'react'
import CandlestickChart from './components/CandlestickChart'
import ControlBar from './components/ControlBar'
import StatsPanel from './components/StatsPanel'
import { useOhlcv } from './hooks/useOhlcv'

export default function App() {
  const [symbol, setSymbol] = useState('BTC/USDT')
  const [timeframe, setTimeframe] = useState('1h')
  const { candles, indicators, loading, error, refetch } = useOhlcv({
    symbol,
    timeframe,
    exchange: 'kraken',
  })

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Trading Dashboard</h1>
          <p className="text-sm text-slate-500">Live candles, indicators, AI signals</p>
        </div>
      </header>

      <ControlBar
        symbol={symbol}
        setSymbol={setSymbol}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        onRefresh={refetch}
      />

      <StatsPanel indicators={indicators} symbol={symbol} loading={loading} error={error} />

      <CandlestickChart candles={candles} />
    </div>
  )
}
