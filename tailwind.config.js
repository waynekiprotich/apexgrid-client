/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'shell': '40px',
        'panel': '24px',
      },
      colors: {
        // ── Base surfaces ──────────────────────────────────────────────────
        bg:         '#0a0a0a',
        surface:    '#131316',
        'surface-2':'#1c1c20',
        border:     '#232326',       // hairline — nothing floats edgeless
        'border-hover': '#3a3a3d',
        // ── Brand ──────────────────────────────────────────────────────────
        primary:       '#e10600',    // live indicators and primary actions only
        'primary-hover':'#c00500',
        'primary-muted':'rgba(225,6,0,0.12)',
        // ── Type ───────────────────────────────────────────────────────────
        text:   '#f5f5f7',
        muted:  '#8e8e93',
        'muted-2': '#636366',
        // ── F1 broadcast semantic colours ─────────────────────────────────
        // Use ONLY where they mean what they mean in an actual broadcast:
        purple:    '#9d4edd',  // fastest overall sector or lap — never decorative
        fastGreen: '#2bd576',  // personal best sector or lap — never decorative
        // ── Tyre compounds ────────────────────────────────────────────────
        tyreSoft:   '#ff3b30',
        tyreMedium: '#ffd60a',
        tyreHard:   '#f5f5f7',
        tyreInter:  '#34c759',
        tyreWet:    '#0a84ff',
        // ── Status ────────────────────────────────────────────────────────
        success: '#22c55e',
        warning: '#f59e0b',
        error:   '#ef4444',
        // ── Constructor livery colours ────────────────────────────────────
        // Keyed by team identifier — used as semantic left-border tabs
        // on timing rows, NOT as generic accent fills
        'ferrari':      '#e8002d',
        'mercedes':     '#00d2be',
        'redbull':      '#3671c6',
        'mclaren':      '#ff8000',
        'alpine':       '#0093cc',
        'astonmartin':  '#006f62',
        'williams':     '#64c4ff',
        'haas':         '#b6babd',
        'sauber':       '#52e252',
        'rb':           '#6692ff',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // hero-gradient removed — replaced by circuit texture + flat surface
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%)',
        'timing-row': 'linear-gradient(90deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
      },
      boxShadow: {
        'card':      '0 1px 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
        'card-hover':'0 4px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        'premium-panel': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'premium-card': '0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
        'premium-card-hover': '0 6px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
        'panel':     '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)',
        'glow-red':  '0 0 24px rgba(225,6,0,0.25)',
        'glow-purple':'0 0 16px rgba(157,78,221,0.3)',
      },
      animation: {
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-up':   'slideUp 0.35s ease-out',
        'fade-row':   'fadeRow 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 1.6s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeRow: { from: { opacity: '0', transform: 'translateX(-6px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
