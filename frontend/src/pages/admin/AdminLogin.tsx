import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/portfolio'

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const resp = await login(creds.username, creds.password)
      localStorage.setItem('jwt', resp.data.token)
      navigate('/admin')
    } catch {
      setError('invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text)',
    fontFamily: 'var(--font)',
    fontSize: 13,
    padding: '4px 0',
    outline: 'none',
    marginBottom: 16,
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
      <div style={{
        width: 360,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: 32,
        fontFamily: 'var(--font)',
      }}>
        <p style={{ color: 'var(--green)', marginBottom: 24, fontSize: 13 }}>
          ~/portfolio/admin $
        </p>
        <form onSubmit={handleSubmit}>
          <label style={{ color: 'var(--text-dim)', fontSize: 11 }}>username</label>
          <input
            style={inputStyle}
            value={creds.username}
            onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
            autoFocus
            required
          />
          <label style={{ color: 'var(--text-dim)', fontSize: 11 }}>password</label>
          <input
            type="password"
            style={{ ...inputStyle, marginBottom: 20 }}
            value={creds.password}
            onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
            required
          />
          {error && (
            <p style={{ color: '#ff5f57', fontSize: 11, marginBottom: 12 }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--green)',
              fontFamily: 'var(--font)',
              fontSize: 12,
              padding: '6px 16px',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--green)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {loading ? 'authenticating...' : '[ login ]'}
          </button>
        </form>
      </div>
    </div>
  )
}
