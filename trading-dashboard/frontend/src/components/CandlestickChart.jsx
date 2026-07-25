import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

export default function CandlestickChart({ candles = [] }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#12151c' },
        textColor: '#94a3b8',
        fontFamily: 'JetBrains Mono, monospace',
      },
      grid: {
        vertLines: { color: '#1f2430' },
        horzLines: { color: '#1f2430' },
      },
      width: containerRef.current.clientWidth,
      height: 420,
      timeScale: { borderColor: '#1f2430' },
      rightPriceScale: { borderColor: '#1f2430' },
      crosshair: { mode: 0 },
    })

    const series = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    chartRef.current = chart
    seriesRef.current = series

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (seriesRef.current && candles.length) {
      seriesRef.current.setData(candles)
      chartRef.current?.timeScale().fitContent()
    }
  }, [candles])

  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden border border-border" />
}
