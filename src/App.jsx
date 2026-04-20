import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import KriterYonetimi from './pages/KriterYonetimi'
import EvDetay from './pages/EvDetay'
import Karsilastirma from './pages/Karsilastirma'

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kriterler" element={<KriterYonetimi />} />
          <Route path="/sablonlar" element={<KriterYonetimi />} />
          <Route path="/ev/:id" element={<EvDetay />} />
          <Route path="/karsilastirma" element={<Karsilastirma />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}