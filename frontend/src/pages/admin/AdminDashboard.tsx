import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import type { Project, Skill } from '../../api/portfolio'

type Tab = 'projects' | 'skills' | 'messages'

interface Message {
  id: number
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

const emptyProject = (): Omit<Project, 'id'> => ({
  title: '', description: '', techStack: '', githubUrl: '', demoUrl: '', imageUrl: '', featured: false,
})
const emptySkill = (): Omit<Skill, 'id'> => ({ name: '', category: '', level: 3 })

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('projects')

  // Projects
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)

  // Skills
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null)

  // Messages
  const [messages, setMessages] = useState<Message[]>([])

  const logout = () => { localStorage.removeItem('jwt'); navigate('/admin/login') }

  useEffect(() => {
    if (!localStorage.getItem('jwt')) { navigate('/admin/login'); return }
    loadAll()
  }, [])

  async function loadAll() {
    const [p, s, m] = await Promise.all([
      api.get<Project[]>('/api/projects'),
      api.get<Skill[]>('/api/skills'),
      api.get<Message[]>('/api/admin/messages'),
    ])
    setProjects(p.data)
    setSkills(s.data)
    setMessages(m.data)
  }

  // ── Project CRUD ──────────────────────────────────
  async function saveProject() {
    if (!editingProject) return
    if (editingProject.id) {
      await api.put(`/api/admin/projects/${editingProject.id}`, editingProject)
    } else {
      await api.post('/api/admin/projects', editingProject)
    }
    setEditingProject(null)
    const { data } = await api.get<Project[]>('/api/projects')
    setProjects(data)
  }

  async function deleteProject(id: number) {
    await api.delete(`/api/admin/projects/${id}`)
    setProjects(ps => ps.filter(p => p.id !== id))
  }

  // ── Skill CRUD ────────────────────────────────────
  async function saveSkill() {
    if (!editingSkill) return
    if (editingSkill.id) {
      await api.put(`/api/admin/skills/${editingSkill.id}`, editingSkill)
    } else {
      await api.post('/api/admin/skills', editingSkill)
    }
    setEditingSkill(null)
    const { data } = await api.get<Skill[]>('/api/skills')
    setSkills(data)
  }

  async function deleteSkill(id: number) {
    await api.delete(`/api/admin/skills/${id}`)
    setSkills(ss => ss.filter(s => s.id !== id))
  }

  // ── Shared styles ─────────────────────────────────
  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '4px 0', borderBottom: '1px solid var(--border)',
    fontSize: 12,
  }
  const btnStyle = (color = 'var(--text-dim)'): React.CSSProperties => ({
    background: 'none', border: 'none', color, fontFamily: 'var(--font)',
    fontSize: 11, cursor: 'pointer', padding: 0,
  })
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent',
    border: '1px solid var(--border)', color: 'var(--text)',
    fontFamily: 'var(--font)', fontSize: 12, padding: '4px 8px', outline: 'none', marginBottom: 6,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font)', padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <span style={{ color: 'var(--green)', fontSize: 13 }}>~/portfolio/admin $</span>
        <button style={btnStyle('#ff5f57')} onClick={logout}>[ logout ]</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        {(['projects', 'skills', 'messages'] as Tab[]).map(t => (
          <button key={t} style={{ ...btnStyle(), color: tab === t ? 'var(--green)' : 'var(--text-dim)', fontWeight: tab === t ? 700 : 400 }}
            onClick={() => setTab(t)}>
            {tab === t ? `> ${t}` : `  ${t}`}
          </button>
        ))}
      </div>

      {/* ── PROJECTS ── */}
      {tab === 'projects' && (
        <div>
          <button style={{ ...btnStyle('var(--green)'), marginBottom: 16 }}
            onClick={() => setEditingProject(emptyProject())}>[ + new project ]</button>

          {editingProject && (
            <div style={{ border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
              <p style={{ color: 'var(--green-dim)', fontSize: 11, marginBottom: 8 }}>
                {editingProject.id ? 'edit project' : 'new project'}
              </p>
              {(['title', 'description', 'techStack', 'githubUrl', 'demoUrl', 'imageUrl'] as const).map(f => (
                <div key={f}>
                  <label style={{ color: 'var(--text-dim)', fontSize: 10 }}>{f}</label>
                  <input style={inputStyle} value={(editingProject as Record<string, string>)[f] ?? ''}
                    onChange={e => setEditingProject(p => ({ ...p, [f]: e.target.value }))} />
                </div>
              ))}
              <label style={{ color: 'var(--text-dim)', fontSize: 10 }}>
                <input type="checkbox" checked={editingProject.featured ?? false}
                  onChange={e => setEditingProject(p => ({ ...p, featured: e.target.checked }))} />
                {' '}featured
              </label>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button style={btnStyle('var(--green)')} onClick={saveProject}>[ save ]</button>
                <button style={btnStyle()} onClick={() => setEditingProject(null)}>[ cancel ]</button>
              </div>
            </div>
          )}

          {projects.map(p => (
            <div key={p.id} style={rowStyle}>
              <span style={{ flex: 1, color: 'var(--text)' }}>{p.title}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>{p.techStack}</span>
              <button style={btnStyle('var(--green-dim)')} onClick={() => setEditingProject(p)}>edit</button>
              <button style={btnStyle('#ff5f57')} onClick={() => deleteProject(p.id)}>del</button>
            </div>
          ))}
        </div>
      )}

      {/* ── SKILLS ── */}
      {tab === 'skills' && (
        <div>
          <button style={{ ...btnStyle('var(--green)'), marginBottom: 16 }}
            onClick={() => setEditingSkill(emptySkill())}>[ + new skill ]</button>

          {editingSkill && (
            <div style={{ border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
              <p style={{ color: 'var(--green-dim)', fontSize: 11, marginBottom: 8 }}>
                {editingSkill.id ? 'edit skill' : 'new skill'}
              </p>
              {(['name', 'category'] as const).map(f => (
                <div key={f}>
                  <label style={{ color: 'var(--text-dim)', fontSize: 10 }}>{f}</label>
                  <input style={inputStyle} value={(editingSkill as Record<string, string>)[f] ?? ''}
                    onChange={e => setEditingSkill(s => ({ ...s, [f]: e.target.value }))} />
                </div>
              ))}
              <label style={{ color: 'var(--text-dim)', fontSize: 10 }}>level (1–5)</label>
              <input type="number" min={1} max={5} style={{ ...inputStyle, width: 60 }}
                value={editingSkill.level ?? 3}
                onChange={e => setEditingSkill(s => ({ ...s, level: Number(e.target.value) }))} />
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button style={btnStyle('var(--green)')} onClick={saveSkill}>[ save ]</button>
                <button style={btnStyle()} onClick={() => setEditingSkill(null)}>[ cancel ]</button>
              </div>
            </div>
          )}

          {skills.map(s => (
            <div key={s.id} style={rowStyle}>
              <span style={{ flex: 1, color: 'var(--text)' }}>{s.name}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>{s.category}</span>
              <span style={{ color: 'var(--green-dim)', fontSize: 10 }}>{'▪'.repeat(s.level ?? 0)}</span>
              <button style={btnStyle('var(--green-dim)')} onClick={() => setEditingSkill(s)}>edit</button>
              <button style={btnStyle('#ff5f57')} onClick={() => deleteSkill(s.id)}>del</button>
            </div>
          ))}
        </div>
      )}

      {/* ── MESSAGES ── */}
      {tab === 'messages' && (
        <div>
          {messages.length === 0 && <p style={{ color: 'var(--text-dim)' }}>no messages.</p>}
          {messages.map(m => (
            <div key={m.id} style={{ ...rowStyle, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <span style={{ color: 'var(--green-dim)' }}>{m.name}</span>
                <span style={{ color: 'var(--text-dim)' }}>&lt;{m.email}&gt;</span>
                <span style={{ color: 'var(--text-dim)', marginLeft: 'auto', fontSize: 10 }}>
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
                {!m.read && <span style={{ color: 'var(--green)', fontSize: 10 }}>[new]</span>}
              </div>
              <p style={{ color: 'var(--text)', paddingLeft: 8, fontSize: 12 }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
