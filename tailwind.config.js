/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			body: ['Lora', 'Georgia', 'serif'],
  			water: ['Cinzel Decorative', 'serif'],
  			folk: ['Playfair Display', 'Georgia', 'serif'],
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
  			popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
  			primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
  			secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
  			muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
  			accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
  			destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			goral: {
  				50:  '#faf6f0',
  				100: '#f2e8d5',
  				200: '#e2ceab',
  				300: '#cfae78',
  				400: '#bc8f52',
  				500: '#a67840',
  				600: '#8b6135',
  				700: '#6e4c2b',
  				800: '#4a3220',
  				900: '#2e1f12',
  			},
  			river: {
  				100: '#d0eaf7',
  				200: '#a2d5ef',
  				300: '#6db8e0',
  				400: '#3d9bce',
  				500: '#2381b5',
  				600: '#1a6390',
  				700: '#134970',
  			},
  			forest: {
  				100: '#d5e8d0',
  				200: '#a8cf9e',
  				300: '#74b067',
  				400: '#4f9142',
  				500: '#3a7231',
  				600: '#2a5524',
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))', '2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))', '4': 'hsl(var(--chart-4))', '5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))', foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))', 'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))', 'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))', ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
  			'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
  			'float': { '0%, 100%': { transform: 'translateY(0px) rotate(3deg)' }, '50%': { transform: 'translateY(-12px) rotate(0deg)' } },
  			'ripple': { '0%': { transform: 'scale(0)', opacity: '1' }, '100%': { transform: 'scale(4)', opacity: '0' } },
  			'slide-up': { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
  			'flow': { '0%': { backgroundPosition: '0% 0%' }, '100%': { backgroundPosition: '0% 100%' } },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'float': 'float 4s ease-in-out infinite',
  			'ripple': 'ripple 2s ease-out infinite',
  			'slide-up': 'slide-up 0.7s ease-out forwards',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}