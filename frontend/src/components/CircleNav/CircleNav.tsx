import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface NavNode {
  label: string
  path: string
  angle: number
}

const NODES: NavNode[] = [
  { label: 'Home',     path: '/',         angle: 270 },
  { label: 'Projects', path: '/projects', angle: 0   },
  { label: 'Skills',   path: '/skills',   angle: 90  },
  { label: 'Contact',  path: '/contact',  angle: 180 },
]

const RADIUS = 160   // px — circle radius
const NODE_SIZE = 80 // px — button diameter
const CENTER = RADIUS + NODE_SIZE / 2

function toXY(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  }
}

export default function CircleNav() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<number | null>(null)
  const svgSize = (RADIUS + NODE_SIZE / 2) * 2

  const positions = NODES.map(n => toXY(n.angle))

  return (
    <div className="relative flex items-center justify-center" style={{ width: svgSize, height: svgSize }}>
      {/* SVG layer: connecting lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={svgSize}
        height={svgSize}
      >
        {NODES.map((_, i) => {
          const next = (i + 1) % NODES.length
          const a = positions[i]
          const b = positions[next]
          const isActive = hovered === i || hovered === next
          return (
            <motion.line
              key={i}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke={isActive ? '#c0c0c0' : '#333'}
              strokeWidth={isActive ? 1.5 : 0.8}
              animate={{ opacity: isActive ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            />
          )
        })}
      </svg>

      {/* Buttons */}
      {NODES.map((node, i) => {
        const { x, y } = positions[i]
        return (
          <motion.button
            key={node.path}
            className="absolute chrome-border rounded-full flex items-center justify-center cursor-pointer select-none"
            style={{
              width: NODE_SIZE,
              height: NODE_SIZE,
              left: x - NODE_SIZE / 2,
              top:  y - NODE_SIZE / 2,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #111 100%)',
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            onClick={() => navigate(node.path)}
          >
            <span
              className="text-xs font-semibold tracking-wider uppercase liquid-metal"
              style={{ WebkitTextFillColor: 'transparent' }}
            >
              {node.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
