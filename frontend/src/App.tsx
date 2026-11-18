import type { ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Placeholder from './pages/Placeholder'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DashboardPage from './pages/dashboard/DashboardPage'
import FamilyPage from './pages/family/FamilyPage'
import EventsPage from './pages/events/EventsPage'
import PhotosPage from './pages/photos/PhotosPage'
import CommunityPage from './pages/community/CommunityPage'
import DirectoryPage from './pages/directory/DirectoryPage'
import HeritagePage from './pages/heritage/HeritagePage'
import AIAssistantPage from './pages/ai/AIAssistantPage'
import SecurityPage from './pages/security/SecurityPage'
import { GenealogyProvider } from './pages/genealogy/GenealogyContext'
import GenealogyTree from './pages/genealogy/GenealogyTree'
import RelationshipsPage from './pages/genealogy/RelationshipsPage'
import { navItems } from './config/nav'

// Bảng ánh xạ đầy đủ tất cả các trang chức năng của FamilyConnect
const pages: Record<string, ReactElement> = {
  '/': <DashboardPage />,
  '/gia-dinh': <FamilyPage />,
  '/gia-pha': <GenealogyTree />,
  '/quan-he': <RelationshipsPage />,
  '/cong-dong': <CommunityPage />,
  '/su-kien': <EventsPage />,
  '/anh': <PhotosPage />,
  '/danh-ba': <DirectoryPage />,
  '/di-san': <HeritagePage />,
  '/tro-ly-ai': <AIAssistantPage />,
  '/bao-mat': <SecurityPage />,
}

export default function App() {
  return (
    <GenealogyProvider>
      <Routes>
        {/* Trang xác thực không có menu bên trái */}
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />

        {/* Các trang thuộc AppLayout chính */}
        <Route element={<AppLayout />}>
          {navItems.map((item) => (
            <Route
              key={item.to}
              path={item.to}
              element={pages[item.to] ?? <Placeholder title={item.label} />}
            />
          ))}
          {/* Fallback cho trang chủ nếu cần */}
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </GenealogyProvider>
  )
}
