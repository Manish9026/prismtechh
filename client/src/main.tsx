import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RouteError from './components/RouteError'
import NotFound from './components/NotFound'
import './index.css'
import App from './App'
import { delayImport } from './utils/delayImport'
const Home = lazy(()=>delayImport(import('./pages/Home')))
const About = lazy(()=>delayImport(import('./pages/About')))
const Services = lazy(()=>delayImport(import('./pages/Services')))
const Projects = lazy(()=>delayImport(import('./pages/Projects')))
const Pricing = lazy(()=>delayImport(import('./pages/Pricing')))
const Contact = lazy(()=>delayImport(import('./pages/Contact')))
import { AuthProvider } from './admin/AuthContext'
import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import RequireAuth from './admin/RequireAuth'
import { useEffect } from 'react'
import LogoLoader from './components/LogoLoader'

const HomeManager = lazy(()=>import('./admin/HomeManager'))
const Dashboard = lazy(()=>import('./admin/Dashboard'))
const AboutManager = lazy(()=>import('./admin/AboutManager'))
const ServicesManager = lazy(()=>import('./admin/ServicesManager'))
const ProjectsManager = lazy(()=>import('./admin/ProjectsManager'))
const PricingManager = lazy(()=>import('./admin/PricingManager'))
const TeamManager = lazy(()=>import('./admin/TeamManager'))
const MessagesManager = lazy(()=>import('./admin/MessagesManager'))
const SettingsManager = lazy(()=>import('./admin/SettingsManager'))
const ContentManager = lazy(()=>import('./admin/ContentManager'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'projects', element: <Projects /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense> },
      { path: 'content', element: <Suspense fallback={<div>Loading...</div>}><ContentManager /></Suspense> },
      { path: 'home', element: <Suspense fallback={<div>Loading...</div>}><HomeManager /></Suspense> },
      { path: 'about', element: <Suspense fallback={<div>Loading...</div>}><AboutManager /></Suspense> },
      { path: 'services', element: <Suspense fallback={<div>Loading...</div>}><ServicesManager /></Suspense> },
      { path: 'projects', element: <Suspense fallback={<div>Loading...</div>}><ProjectsManager /></Suspense> },
      { path: 'pricing', element: <Suspense fallback={<div>Loading...</div>}><PricingManager /></Suspense> },
      { path: 'team', element: <Suspense fallback={<div>Loading...</div>}><TeamManager /></Suspense> },
      { path: 'messages', element: <Suspense fallback={<div>Loading...</div>}><MessagesManager /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<div>Loading...</div>}><SettingsManager /></Suspense> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function Root(){
  useEffect(()=>{
    const el = document.getElementById('sweep')
    if(!el) return
    el.innerHTML = ''
    const line = document.createElement('div')
    line.className = 'sweep-line'
    el.appendChild(line)
    const t = setTimeout(()=>{ if (el.contains(line)) el.removeChild(line) }, 700)
    return ()=> clearTimeout(t)
  })
  return (
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
