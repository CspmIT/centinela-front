import { Checkbox, MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { animationDoblePolyline, updatePropertyPolyline } from './utils/js/polyline'

function PropertyPolyLineBase({ data, fabricCanvasRef }) {
	const [info, setInfo] = useState(data)
	const [showAnimation, setShowAnimation] = useState(info.animation?.animation)
	const [invertAnimation, setInvertAnimation] = useState(info.animation?.invertAnimation)
	const [canvas, setCanvas] = useState(fabricCanvasRef?.current)

	useEffect(() => {
		setInfo(data)
	}, [data])
	useEffect(() => {
		if (fabricCanvasRef) {
			setCanvas(fabricCanvasRef.current)
		}
	}, [fabricCanvasRef])

	const changeWidth = (width) => {
		const infoUpdate = { ...info }
		infoUpdate.appearance.strokeWidth = width
		setInfo(infoUpdate)
		data.setWidth(width)
		updatePropertyPolyline(infoUpdate, 'strokeWidth', canvas)
	}
	const changeColor = (color) => {
		const infoUpdate = { ...info }
		infoUpdate.appearance.stroke = color
		setInfo(infoUpdate)
		data.setStroke(color)
		updatePropertyPolyline(infoUpdate, 'stroke', canvas)
	}
	const activeDobleLine = (status) => {
		const infoUpdate = { ...info }
		infoUpdate.animation.animation = status
		setInfo(infoUpdate)
		setShowAnimation(status)
		data.setAnimation(status)
		animationDoblePolyline(canvas, info.polyline.id)
	}
	const changeAnimation = (val) => {
		const infoUpdate = { ...info }
		infoUpdate.animation.invertAnimation = val
		setInfo(infoUpdate)
		data.setInvertAnimation(val)
		setInvertAnimation(val)
		animationDoblePolyline(canvas, info.polyline.id)
	}
	return (
		<div className='flex flex-col gap-4'>
			<div className='w-full flex gap-2 justify-center'>
				<TextField
					type='number'
					label='Espesor de línea'
					id='strokeWidth'
					name='strokeWidth'
					onChange={(e) => changeWidth(e.target.value)}
					className='w-1/2'
					value={info?.appearance?.strokeWidth || ''}
				/>
				<TextField
					type='color'
					label='Color de la línea'
					id='stroke'
					name='stroke'
					onChange={(e) => changeColor(e.target.value)}
					className='w-1/2'
					value={info?.appearance?.stroke || '#000000'}
				/>
			</div>
			<div
				className='flex justify-start items-center cursor-pointer border border-zinc-300 rounded-md p-2 pl-4 hover:border-gray-500'
				onClick={() => activeDobleLine(!showAnimation)}
			>
				<Checkbox key={'animation'} checked={showAnimation} onChange={() => activeDobleLine(!showAnimation)} />
				Animación
			</div>
			{showAnimation && (
				<TextField
					select
					label='Invertir Animacón'
					onChange={(e) => changeAnimation(e.target.value)}
					value={invertAnimation}
				>
					<MenuItem value={true}>Sí</MenuItem>
					<MenuItem value={false}>No</MenuItem>
				</TextField>
			)}
		</div>
	)
}

export default PropertyPolyLineBase
