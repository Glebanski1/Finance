import { useEffect, useRef, useState, useCallback } from 'react'

export interface LiveDataState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  isLive: boolean
  refetch: () => void
  setLive: (v: boolean) => void
}

interface Opts {
  intervalMs?: number
  enabled?: boolean
}

export function useLiveData<T>(
  fetcher: () => Promise<T>,
  opts: Opts = {},
): LiveDataState<T> {
  const { intervalMs = 60_000, enabled = true } = opts

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isLive, setLive] = useState(enabled)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const reqId = useRef(0)

  const run = useCallback(async () => {
    const id = ++reqId.current
    setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      if (id === reqId.current) {
        setData(result)
        setLastUpdated(new Date())
      }
    } catch (e: unknown) {
      if (id === reqId.current) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      }
    } finally {
      if (id === reqId.current) setLoading(false)
    }
  }, [])

  useEffect(() => { run() }, [run])

  useEffect(() => {
    if (!isLive) return
    const t = setInterval(() => { run() }, intervalMs)
    return () => clearInterval(t)
  }, [isLive, intervalMs, run])

  return { data, isLoading, error, lastUpdated, isLive, refetch: run, setLive }
}

export function useTick(intervalMs = 1000): number {
  const [, set] = useState(0)
  useEffect(() => {
    const t = setInterval(() => set(v => v + 1), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return Date.now()
}
