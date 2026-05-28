import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import DashboardPage from './pages/DashboardPage'
import MultiplesPage from './pages/MultiplesPage'
import DealsPage from './pages/DealsPage'
import TrendsPage from './pages/TrendsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-surface-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/multiples" element={<MultiplesPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/trends" element={<TrendsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
