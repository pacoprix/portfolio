import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getSkills, type Skill } from '../api/portfolio'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .finally(() => setLoading(false))
  }, [])

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category ?? 'other'
    acc[cat] = [...(acc[cat] ?? []), s]
    return acc
  }, {})

  if (loading) return <p style={{ color: 'var(--text-dim)' }}>loading...</p>

  if (skills.length === 0)
    return <p style={{ color: 'var(--text-dim)' }}>no skills found.</p>

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(grouped).map(([category, items], gi) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: gi * 0.08 }}
        >
          <p style={{ color: 'var(--green-dim)', fontSize: 11, marginBottom: 4 }}>
            # {category}
          </p>
          <div style={{ paddingLeft: 8 }}>
            {items.map(s => (
              <span key={s.id} style={{ color: 'var(--text)', fontSize: 13, marginRight: 16 }}>
                {s.name}
                {s.level != null && (
                  <span style={{ color: 'var(--text-dim)', fontSize: 10, marginLeft: 4 }}>
                    {'▪'.repeat(s.level)}{'▫'.repeat(5 - s.level)}
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
