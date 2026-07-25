import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

export function useOhlcv({ symbol, timeframe, exchange }) {
  const [candles, setCandles] = useState([])
  const [indicators, setIndicators] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.ohlcv({ symbol, timeframe, exchange })
      setCandles(data.candles)
      setIndicators(data.indicators)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [symbol, timeframe, exchange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { candles, indicators, loading, error, refetch: fetchData }
}
