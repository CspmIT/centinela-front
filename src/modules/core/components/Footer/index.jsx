function Footer() {
	return (
		<footer
			className='absolute bottom-0 h-10 hidden sm:flex justify-center items-center w-full z-50 px-4'
			style={{
				background: 'linear-gradient(150deg, #e36a00 0%, #a14b00 75%, #a14b00 100%)',
			}}
		>
			<p className='text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/80 truncate'>
				Copyright © IT & Development - COOPMORTEROS {new Date().getFullYear()}
			</p>
		</footer>
	)
}

export default Footer
