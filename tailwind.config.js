/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#368bed',
				secondary: '#d8621d',
				accent: '#10B981',
			},
		},
	},
	darkMode: 'selector',
	plugins: [],
}
