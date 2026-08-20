import {
  BookOpen, Droplet, Dumbbell, Sparkles, Sun, Moon, Brain, Heart,
  Music, Coffee, Pencil, Code, Leaf, Target, Timer, Hash, Wallet,
  Bike, Utensils, Bed, PenTool, GraduationCap,
} from 'lucide-react'

export const ICONS = {
  BookOpen, Droplet, Dumbbell, Sparkles, Sun, Moon, Brain, Heart,
  Music, Coffee, Pencil, Code, Leaf, Target, Timer, Hash, Wallet,
  Bike, Utensils, Bed, PenTool, GraduationCap,
}

export function getIcon(key) {
  return ICONS[key] || Target
}

// Tailwind-safe color classes (must exist as literal strings somewhere
// in source for the JIT compiler to pick them up — see safelist note
// in tailwind.config.js if new colors are added later).
export const COLOR_CLASSES = {
  purple: { text: 'text-purple', bg: 'bg-purple/10' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-400/10' },
  orange: { text: 'text-red-400', bg: 'bg-red-400/10' },
  teal: { text: 'text-teal', bg: 'bg-teal/10' },
  gold: { text: 'text-gold', bg: 'bg-gold/10' },
}

export function colorClasses(color) {
  return COLOR_CLASSES[color] || COLOR_CLASSES.teal
}
