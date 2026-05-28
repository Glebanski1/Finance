export function formatMoney(rubMn: number | null): string {
  if (rubMn === null || rubMn === undefined) return '—'
  if (rubMn >= 1_000_000) return `₽${(rubMn / 1_000_000).toFixed(2)} трлн`
  if (rubMn >= 100_000) return `₽${(rubMn / 1_000).toFixed(0)} млрд`
  if (rubMn >= 1_000) return `₽${(rubMn / 1_000).toFixed(1)} млрд`
  return `₽${rubMn.toFixed(0)} млн`
}

export function formatCapBn(rubBn: number): string {
  if (rubBn >= 1000) return `₽${(rubBn / 1000).toFixed(1)} трлн`
  return `₽${rubBn.toFixed(0)} млрд`
}

export function formatMultiple(v: number | null | undefined, suffix = 'x'): string {
  if (v === null || v === undefined || v === 0) return '—'
  return `${v.toFixed(1)}${suffix}`
}

export function formatPct(v: number, withSign = true): string {
  const sign = v > 0 && withSign ? '+' : ''
  return `${sign}${v.toFixed(2)}%`
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateRel(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  const now = Date.now()
  const diff = (now - d.getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)} сек назад`
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`
  return `${Math.floor(diff / 86400)} дн назад`
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
