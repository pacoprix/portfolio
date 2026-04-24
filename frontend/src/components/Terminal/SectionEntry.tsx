interface SectionEntryProps {
  label: string
  focused: boolean
  onClick: () => void
}

export default function SectionEntry({ label, focused, onClick }: SectionEntryProps) {
  return (
    <div
      className="flex items-center gap-3 py-0.5 cursor-pointer select-none"
      style={{ fontFamily: 'var(--font)' }}
      onClick={onClick}
    >
      <span
        style={{
          color: 'var(--green)',
          width: '1ch',
          display: 'inline-block',
          transition: 'opacity 0.1s',
          opacity: focused ? 1 : 0,
        }}
      >
        &gt;
      </span>
      <span
        style={{
          color: focused ? 'var(--text)' : 'var(--text-dim)',
          transition: 'color 0.15s',
        }}
      >
        {label}
      </span>
    </div>
  )
}
