import { useTheme } from '../../context/ThemeContext'

interface Command {
  key: string
  description: string
  action?: () => void
}

interface CheatsheetProps {
  onHome: () => void
  extraCommands?: Command[]
}

export default function Cheatsheet({ onHome, extraCommands = [] }: CheatsheetProps) {
  const { toggle } = useTheme()

  const commands: Command[] = [
    { key: '/home', description: 'back to menu', action: onHome },
    { key: '/dark', description: 'toggle theme',  action: toggle },
    ...extraCommands,
  ]

  return (
    <div
      className="fixed bottom-5 left-5 select-none"
      style={{ fontFamily: 'var(--font)', fontSize: '11px', color: 'var(--text-dim)' }}
    >
      {commands.map(cmd => (
        <div key={cmd.key} className="flex gap-2">
          <button
            onClick={cmd.action}
            style={{ color: 'var(--green-dim)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--green-dim)')}
          >
            {cmd.key}
          </button>
          <span>→ {cmd.description}</span>
        </div>
      ))}
    </div>
  )
}
