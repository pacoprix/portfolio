import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionEntry from './SectionEntry'
import Cheatsheet from './Cheatsheet'
import ProjectsPage from '../../pages/ProjectsPage'
import SkillsPage from '../../pages/SkillsPage'
import ContactPage from '../../pages/ContactPage'
import { useTheme } from '../../context/ThemeContext'

const SECTIONS = ['projects', 'skills', 'contact'] as const
type Section = typeof SECTIONS[number]

const SECTION_CONTENT: Record<Section, React.ReactNode> = {
  projects: <ProjectsPage />,
  skills:   <SkillsPage />,
  contact:  <ContactPage />,
}

export default function TerminalWindow() {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { toggle: toggleTheme } = useTheme()

  const openSection = useCallback((section: Section) => {
    setActiveSection(section)
    setInputValue('')
  }, [])

  const goHome = useCallback(() => {
    setActiveSection(null)
    setFocusedIndex(0)
    setInputValue('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // Always keep the input focused so the browser never intercepts keystrokes
  useEffect(() => {
    inputRef.current?.focus()
  }, [activeSection])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (activeSection) {
      if (e.key === 'Escape') { e.preventDefault(); goHome() }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(i => (i + 1) % SECTIONS.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(i => (i - 1 + SECTIONS.length) % SECTIONS.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = inputValue.trim()
      if (cmd === '/dark') { toggleTheme(); setInputValue('') }
      else if (cmd === '/home') { goHome() }
      else if (cmd === '' || SECTIONS.includes(cmd as Section)) {
        if (cmd === '') openSection(SECTIONS[focusedIndex])
        else openSection(cmd as Section)
      } else {
        setInputValue('') // unknown command — clear
      }
    } else if (e.key === 'Escape') {
      setInputValue('')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeSection) setInputValue(e.target.value)
  }

  const prompt = activeSection
    ? `~/portfolio/${activeSection} $`
    : '~/portfolio $'

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-10"
      style={{ background: 'var(--bg)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal window */}
      <div
        className="w-full"
        style={{
          maxWidth: 700,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          overflow: 'hidden',
          fontFamily: 'var(--font)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--text-dim)' }}>
            ~/portfolio{activeSection ? `/${activeSection}` : ''}
          </span>
          {/* Back button — only shown inside a section */}
          {activeSection && (
            <button
              onClick={goHome}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-dim)', fontFamily: 'var(--font)', fontSize: 11,
                padding: '0 4px',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
            >
              ← back
            </button>
          )}
        </div>

        {/* Terminal body */}
        <div className="p-6" style={{ minHeight: 320 }}>
          {/* Prompt + live input */}
          <div className="flex items-center gap-2 mb-6" style={{ position: 'relative' }}>
            <span style={{ color: 'var(--green)', whiteSpace: 'nowrap' }}>{prompt}</span>
            {/* Invisible-but-real input — always focused to capture keystrokes */}
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => inputRef.current?.focus(), 100)}
                style={{
                  position: 'absolute', opacity: 0, top: 0, left: 0,
                  width: '100%', height: '100%', cursor: 'default',
                  pointerEvents: 'none',
                }}
                readOnly={!!activeSection}
                autoComplete="off"
                spellCheck={false}
              />
              {/* Visible typed text + blinking cursor */}
              <span style={{ color: 'var(--text)', fontSize: 13 }}>{inputValue}</span>
              <span
                style={{
                  display: 'inline-block', width: '0.6ch', height: '1em',
                  background: 'var(--cursor)', verticalAlign: 'text-bottom',
                  animation: 'blink 1.1s step-end infinite', marginLeft: 1,
                }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!activeSection ? (
              <motion.div
                key="selector"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex flex-col gap-1 pl-2">
                  {SECTIONS.map((s, i) => (
                    <SectionEntry
                      key={s}
                      label={s}
                      focused={focusedIndex === i}
                      onClick={() => openSection(s)}
                    />
                  ))}
                </div>
                <p style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 24 }}>
                  <span style={{ color: 'var(--green)' }}>↑↓</span> navigate ·{' '}
                  <span style={{ color: 'var(--green)' }}>Enter</span> open ·{' '}
                  <span style={{ color: 'var(--green)' }}>Esc</span> back
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {SECTION_CONTENT[activeSection]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Cheatsheet onHome={goHome} />
    </div>
  )
}
