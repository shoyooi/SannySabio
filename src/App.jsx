import { Routes, Route } from 'react-router-dom'
import Rail from './components/Rail'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import AboutPage from './pages/About'
import WorksPage from './pages/Works'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <ScrollManager />
      <Rail />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/work" element={<WorksPage />} />
          <Route path="/projects" element={<WorksPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
