/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0a',
        prism: {
          purple: '#8b5cf6',
          blue: '#22d3ee',
          green: '#34d399',
          yellow: '#fde047',
          pink: '#f472b6',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'prism-gradient': 'linear-gradient(135deg, #8b5cf6, #22d3ee, #34d399, #fde047, #f472b6)',
        'prism-radial': 'radial-gradient(1200px 600px at 10% 10%, rgba(139,92,246,0.25), transparent 60%), radial-gradient(1000px 500px at 90% 20%, rgba(34,211,238,0.20), transparent 60%), radial-gradient(900px 500px at 50% 100%, rgba(244,114,182,0.25), transparent 60%)',
      },
      boxShadow: {
        neon: '0 0 10px rgba(139,92,246,0.6), 0 0 20px rgba(34,211,238,0.5)',
        glass: '0 10px 30px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

