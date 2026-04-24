import { useRef, useState } from 'react'
import { sendContact } from '../api/portfolio'

export default function ContactPage() {
  const [step, setStep] = useState<'name' | 'email' | 'message' | 'confirm' | 'sent' | 'error'>('name')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [current, setCurrent] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const lines: string[] = []
  if (form.name)    lines.push(`name     » ${form.name}`)
  if (form.email)   lines.push(`email    » ${form.email}`)
  if (form.message) lines.push(`message  » ${form.message}`)

  const prompts: Record<string, string> = {
    name:    'enter your name:',
    email:   'enter your email:',
    message: 'enter your message:',
    confirm: 'send? [y/n]',
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const val = current.trim()

    if (step === 'name') {
      if (!val) return
      setForm(f => ({ ...f, name: val }))
      setCurrent('')
      setStep('email')
    } else if (step === 'email') {
      if (!val || !val.includes('@')) return
      setForm(f => ({ ...f, email: val }))
      setCurrent('')
      setStep('message')
    } else if (step === 'message') {
      if (!val) return
      setForm(f => ({ ...f, message: val }))
      setCurrent('')
      setStep('confirm')
    } else if (step === 'confirm') {
      if (val.toLowerCase() === 'y') {
        try {
          await sendContact({ ...form, message: form.message })
          setStep('sent')
        } catch {
          setStep('error')
        }
      } else {
        setStep('name')
        setForm({ name: '', email: '', message: '' })
        setCurrent('')
      }
    }
  }

  if (step === 'sent') {
    return (
      <div style={{ fontFamily: 'var(--font)' }}>
        {lines.map((l, i) => <p key={i} style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 2 }}>{l}</p>)}
        <p style={{ color: 'var(--green)', marginTop: 8 }}>✓ message sent. i'll get back to you soon.</p>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div style={{ fontFamily: 'var(--font)' }}>
        <p style={{ color: '#ff5f57' }}>✗ failed to send. check your connection and try again.</p>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--green-dim)', fontFamily: 'var(--font)', fontSize: 12, cursor: 'pointer', marginTop: 8 }}
          onClick={() => { setStep('name'); setForm({ name: '', email: '', message: '' }); setCurrent('') }}
        >
          [ retry ]
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'var(--font)' }}>
      {/* Previously entered lines */}
      {lines.map((l, i) => (
        <p key={i} style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 4 }}>{l}</p>
      ))}

      {/* Current prompt + input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: lines.length ? 8 : 0 }}>
        <span style={{ color: 'var(--green-dim)', fontSize: 12, whiteSpace: 'nowrap' }}>
          {prompts[step]}
        </span>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            ref={inputRef}
            value={current}
            onChange={e => setCurrent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            type={step === 'email' ? 'email' : 'text'}
            autoComplete="off"
            spellCheck={false}
            style={{
              position: 'absolute', opacity: 0, top: 0, left: 0,
              width: '100%', height: '100%', cursor: 'default',
            }}
          />
          <span style={{ color: 'var(--text)', fontSize: 13 }}>{current}</span>
          <span style={{
            display: 'inline-block', width: '0.6ch', height: '1em',
            background: 'var(--cursor)', verticalAlign: 'text-bottom',
            animation: 'blink 1.1s step-end infinite', marginLeft: 1,
          }} />
        </div>
      </div>
      <p style={{ color: 'var(--text-dim)', fontSize: 10, marginTop: 12 }}>
        press <span style={{ color: 'var(--green)' }}>Enter</span> to confirm each field
      </p>
    </div>
  )
}
