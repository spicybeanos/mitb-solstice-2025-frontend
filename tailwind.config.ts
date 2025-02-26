/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
      extend: {
        animation: {
          grid: "grid 15s linear infinite",
          gradient: "gradient 8s linear infinite",
          text:'text 5s ease infinite',
        },
        keyframes: {
          grid: {
            "0%": { transform: "translateY(-50%)" },
            "100%": { transform: "translateY(0)" },
          },
          gradient: {
            to: {
              "background-position": "200% center",
            },
          text: {
              '0%, 100%': {
                'background-size':'200% 200%',
                'background-position': 'left center'
              },
              '50%': {
                'background-size':'200% 200%',
                'background-position': 'right center'
              }
            },
          },
        },
      },
    },
  };
  