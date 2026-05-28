import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import DashboardPage from './pages/DashboardPage'
import MultiplesPage from './pages/MultiplesPage'
import DealsPage from './pages/DealsPage'
import CompaniesPage from './pages/CompaniesPage'
import CompanyPage from './pages/CompanyPage'
import NewsPage from './pages/NewsPage'
import MethodologyPage from './pages/MethodologyPage'
import IpoCalendarPage from './pages/IpoCalendarPage'

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
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/company/:id" element={<CompanyPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/ipo-calendar" element={<IpoCalendarPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
