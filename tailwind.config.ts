import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#03030A",
        surface: "#0B1020",
        card: "#111827",
        galaxy: {
          purple: "#6B21A8",
          pink: "#DB2777",
          red: "#E11D48",
          orange: "#EA580C"
        },
        aurora: {
          blue: "#0284C7",
          cyan: "#06B6D4",
          green: "#059669"
        },
        content: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
          muted: "#4B5563"
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-galaxy': 'linear-gradient(to right right, #6B21A8, #DB2777, #EA580C)',
        'gradient-surface': 'linear-gradient(180deg, rgba(11,16,32,0.8) 0%, rgba(3,3,10,0.9) 100%)',
        'glow-red': 'radial-gradient(circle at center, rgba(225,29,72,0.15) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
