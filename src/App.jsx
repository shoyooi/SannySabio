import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Rail from './components/Rail'
import ScrollManager from './components/ScrollManager'
import CustomCursor from './components/CustomCursor'
import ResumeModal from './components/ResumeModal'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

export default function App() {
  const [resumeOpen, setResumeOpen] = useState(false)
  const openResume = () => setResumeOpen(true)

  return (
    <>
      <CustomCursor />
      <ScrollManager />
      <Rail onOpenResume={openResume} />
      <main className="lyn-main">
        <Routes>
          <Route path="/" element={<Home onOpenResume={openResume} />} />
          <Route
            path="/about"
            element={<Home initialSection="about" onOpenResume={openResume} />}
          />
          <Route
            path="/works"
            element={<Home initialSection="projects" onOpenResume={openResume} />}
          />
          <Route
            path="/work"
            element={<Home initialSection="projects" onOpenResume={openResume} />}
          />
          <Route
            path="/projects"
            element={<Home initialSection="projects" onOpenResume={openResume} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  )
}
