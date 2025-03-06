/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      animation: {
        grid: "grid 15s linear infinite",
        gradient: "gradient 8s linear infinite",
        text: 'text 5s ease infinite',
        "scroll-left": "scrollLeft 10s linear infinite",
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        scrollLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        gradient: {
          to: {
            "background-position": "200% center",
          },
          text: {
            '0%, 100%': {
              'background-size': '200% 200%',
              'background-position': 'left center'
            },
            '50%': {
              'background-size': '200% 200%',
              'background-position': 'right center'
            }
          },
        },
      },
    },
  },
};
