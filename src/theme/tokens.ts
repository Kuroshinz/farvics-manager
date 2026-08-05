export const DesignTokens = {
  colors: {
    background: '#03030A',
    surface: '#0B1020',
    card: '#111827',
    primary: '#6B21A8',
    text: { primary: '#FFFFFF', secondary: '#9CA3AF', muted: '#4B5563' },
    border: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: 'var(--font-inter)',
    sizes: {
      display: '4rem',
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      caption: '0.875rem',
      tiny: '0.75rem'
    },
    weights: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 }
  },
  zIndexes: {
    base: 0,
    elevated: 10,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    popover: 500,
    toast: 600,
    tooltip: 700
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px'
  },
  blurs: {
    glass: '12px',
    overlay: '24px',
    ambient: '120px'
  }
};
