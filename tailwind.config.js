/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Audiowide", "cursive"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        // Premium Fintech Palette (Restored)
        brand: {
          dark: "#0B0E14",    // Rich black/blue background
          surface: "#151923", // Card background
          primary: "#3B82F6", // Royal Blue
          secondary: "#8B5CF6", // Deep Purple
          accent: "#F59E0B",  // Gold (Wealth)
          success: "#10B981", // Emerald (Growth)
          danger: "#EF4444",  // Red (Loss)
          muted: "#64748B",   // Slate text
        },
      },
      backgroundImage: {
        'premium-gradient': "linear-gradient(135deg, #0B0E14 0%, #151923 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.15)", // Subtle blue glow
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        'premium-gradient': "linear-gradient(135deg, #0B0E14 0%, #151923 100%)",
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};