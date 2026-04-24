import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProjects, type Project } from '../api/portfolio'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: 'var(--text-dim)' }}>loading...</p>

  if (projects.length === 0)
    return <p style={{ color: 'var(--text-dim)' }}>no projects found.</p>

  return (
    <div className="flex flex-col gap-5">
      {projects.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: 'var(--green)' }}>›</span>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>{p.title}</span>
            {p.featured && (
              <span style={{ color: 'var(--green-dim)', fontSize: 10 }}>[featured]</span>
            )}
          </div>
          {p.description && (
            <p style={{ color: 'var(--text-dim)', fontSize: 12, paddingLeft: 16, marginBottom: 4 }}>
              {p.description}
            </p>
          )}
          {p.techStack && (
            <p style={{ color: 'var(--text-dim)', fontSize: 11, paddingLeft: 16 }}>
              stack: <span style={{ color: 'var(--green-dim)' }}>{p.techStack}</span>
            </p>
          )}
          <div style={{ paddingLeft: 16, marginTop: 4, fontSize: 11 }}>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noreferrer"
                 style={{ color: 'var(--text-dim)', marginRight: 12 }}
                 onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
                 onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
                [github]
              </a>
            )}
            {p.demoUrl && (
              <a href={p.demoUrl} target="_blank" rel="noreferrer"
                 style={{ color: 'var(--text-dim)' }}
                 onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
                 onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
                [demo]
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
