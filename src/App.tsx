import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CommandPalette from './components/CommandPalette'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'

const Admin = lazy(() => import('./admin/Admin'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain relative min-h-screen overflow-x-clip">
      <Navbar />
      <CommandPalette />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/projects/:slug" element={<PublicLayout><ProjectPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogIndex /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="grid min-h-screen place-items-center text-muted">Loading…</div>}>
              <Admin />
            </Suspense>
          }
        />
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  )
}
