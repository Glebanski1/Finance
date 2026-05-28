import Header from '../components/Layout/Header'
import { Construction } from 'lucide-react'

export default function TrendsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Тренды" subtitle="Анализ трендов и динамики рынка" />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <Construction size={48} className="text-text-muted mx-auto mb-4" />
          <div className="text-text-primary font-semibold text-lg">В разработке</div>
          <div className="text-text-muted text-sm mt-2">
            Скоро: динамика мультипликаторов, сравнение с EM-рынками, sector heatmap
          </div>
        </div>
      </div>
    </div>
  )
}
