import { ExternalLink, Clock } from 'lucide-react'
import type { NewsItem } from '../../lib/news'
import { formatDateRel } from '../../lib/format'

interface Props {
  item: NewsItem
  compact?: boolean
}

export default function NewsCard({ item, compact = false }: Props) {
  if (compact) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-surface-3 border border-border-subtle/50 rounded-lg p-3 hover:border-accent/40 transition-colors group"
      >
        <div className="flex items-center gap-2 text-xs mb-1.5">
          <span className="text-accent font-medium">{item.source}</span>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted flex items-center gap-1">
            <Clock size={10} /> {formatDateRel(item.pubDate)}
          </span>
        </div>
        <div className="text-text-primary text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {item.title}
        </div>
      </a>
    )
  }

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-surface-2 border border-border-subtle rounded-xl p-5 hover:border-accent/30 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-accent font-medium px-2 py-0.5 bg-accent-muted rounded-md">
            {item.source}
          </span>
          {item.category && (
            <span className="text-text-muted px-2 py-0.5 bg-surface-3 rounded-md">
              {item.category}
            </span>
          )}
          <span className="text-text-muted flex items-center gap-1">
            <Clock size={11} /> {formatDateRel(item.pubDate)}
          </span>
        </div>
        <ExternalLink size={14} className="text-text-muted group-hover:text-accent transition-colors" />
      </div>
      <div className="text-text-primary font-semibold text-base leading-snug group-hover:text-accent transition-colors mb-2">
        {item.title}
      </div>
      {item.description && (
        <div className="text-text-secondary text-sm leading-relaxed line-clamp-3">
          {item.description}
        </div>
      )}
    </a>
  )
}
