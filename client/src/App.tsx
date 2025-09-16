import { Outlet, useNavigation, useLocation } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './index.css'
import LogoLoader from './components/LogoLoader'

export default function App() {
  const navigation = useNavigation()
  const location = useLocation()
  const [overlay, setOverlay] = useState(false)
  useEffect(()=>{
    // Show overlay on every route change for at least 700ms
    setOverlay(true)
    const t = setTimeout(()=> setOverlay(false), 700)
    return ()=> clearTimeout(t)
  }, [location.pathname])
  return (
    <div className="min-h-screen relative overflow-hidden bg-base">
      <div className="prism-waves" />
      <div id="sweep" className="sweep-overlay" />
      <Navbar />
      {(navigation.state === 'loading' || overlay) && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 w-screen h-full">
          <LogoLoader />
        </div>
      )}
      <Suspense fallback={<LogoLoader />}>
        <Outlet />

      </Suspense>
      <Footer />
    </div>
  )
}
