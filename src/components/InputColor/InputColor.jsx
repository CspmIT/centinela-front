import { Slider, TextField } from '@mui/material'
import React, { useState } from 'react'
import { hexToRgb } from './utils'

function InputColor({ updateBackground, backgroundText }) {
	const [color, setColor] = useState(backgroundText)
	const [opacity, setOpacity] = useState(1) // Controlar la opacidad
	const changeColorBackground = (newColor) => {
		const rgbaColor = `rgba(${hexToRgb(newColor).join(', ')}, ${opacity})`
		setColor(newColor)
		updateBackground(rgbaColor)
	}

	const changeOpacity = (newOpacity) => {
		const rgbaColor = `rgba(${hexToRgb(color).join(', ')}, ${newOpacity})`
		setOpacity(newOpacity)
		updateBackground(rgbaColor)
	}
	return (
		<div className='flex w-full gap-3'>
			<TextField
				type='color'
				label='Color de fondo'
				id='backgroundcolor'
				name='backgroundcolor'
				onChange={(e) => changeColorBackground(e.target.value)}
				className='w-2/6'
				value={color || ''}
			/>
			<Slider
				value={opacity}
				min={0}
				max={1}
				step={0.01}
				onChange={(e, value) => changeOpacity(value)}
				aria-labelledby='opacity-slider'
				className='w-4/6'
			/>
		</div>
	)
}

export default InputColor
