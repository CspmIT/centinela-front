import { MenuItem, TextField, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import InputColor from '../../../../components/InputColor/InputColor'

function PropertyText({ data, AddText }) {
	const [info, setInfo] = useState(data)
	const [backgroundText, setColor] = useState(info.backgroundText)
	const [opacity, setOpacity] = useState(1) // Controlar la opacidad

	useEffect(() => {
		setInfo(data)
		const rgba = parseRgba(info.backgroundText)
		setColor(rgba.color)
		setOpacity(rgba.opacity)
	}, [data])

	const changeTitle = (string) => {
		data.setTitle(string)
		const infoUpdate = { ...info, title: string }
		setInfo(infoUpdate)
		AddText(infoUpdate)
	}

	const updateBackground = (rgbaColor) => {
		data.setBackgroundTextColor(rgbaColor)
		const infoUpdate = { ...info, backgroundText: rgbaColor }
		setInfo(infoUpdate)
		AddText(infoUpdate)
	}

	return (
		<div className='flex flex-col gap-4'>
			<TextField
				type='text'
				label='Titulo'
				id='title'
				name='title'
				onChange={(e) => changeTitle(e.target.value)}
				className='w-full'
				value={info.title || ''}
			/>
			<InputColor updateBackground={() => updateBackground} backgroundText={backgroundText} />
			<TextField
				select
				label='Posición del Texto'
				id='textPosition'
				name='textPosition'
				onChange={(e) => {
					const value = e.target.value
					data.setTextPosition(value)
					const infoUpdate = { ...info, textPosition: value }
					setInfo(infoUpdate)
					AddText(infoUpdate)
				}}
				className='w-full'
				value={info.textPosition || ''}
			>
				<MenuItem value='Top'>Arriba</MenuItem>
				<MenuItem value='Bottom'>Abajo</MenuItem>
				<MenuItem value='Left'>Izquierda</MenuItem>
				<MenuItem value='Right'>Derecha</MenuItem>
				<MenuItem value='Center'>Centro</MenuItem>
			</TextField>
		</div>
	)
}

// Utilidades para manejar colores
const hexToRgb = (hex) => {
	hex = hex.replace('#', '')
	const bigint = parseInt(hex, 16)
	const r = (bigint >> 16) & 255
	const g = (bigint >> 8) & 255
	const b = bigint & 255
	return [r, g, b]
}

const parseRgba = (rgba) => {
	if (!rgba.startsWith('rgba')) return { color: '#000000', opacity: 1 }
	const parts = rgba.match(/rgba?\((\d+), (\d+), (\d+), ([0-9.]+)\)/)
	if (!parts) return { color: '#000000', opacity: 1 }
	const [_, r, g, b, a] = parts
	return { color: rgbToHex(r, g, b), opacity: parseFloat(a) }
}

const rgbToHex = (r, g, b) => {
	const toHex = (c) => parseInt(c).toString(16).padStart(2, '0')
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export default PropertyText
