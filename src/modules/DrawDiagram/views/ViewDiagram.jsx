import * as fabric from 'fabric'
import { useEffect, useRef, useState } from 'react'
import CardCustom from '../../../components/CardCustom'
import styles from '../utils/css/style.module.css'
import { handleDrop } from '../components/DrawImage/utils/js/actionImage'
import { Button } from '@mui/material'
import { drawLine } from '../components/DrawLine/utils/js/line'
import { newText } from '../components/DrawText/utils/js'
import { drawPolyline } from '../components/DrawPolyLine/utils/js/polyline'
import ToolsCanvas from '../components/ToolsCanvas/ToolsCanvas'
import { saveDiagram, uploadCanvaDb } from '../utils/js/drawActions'
import { useParams } from 'react-router-dom'
import { Save } from '@mui/icons-material'
import { uploadDiagramDb } from '../utils/js/viewActionsDiagram'

function ViewDiagram() {
	const { id } = useParams()
	const canvasRef = useRef(null)
	const fabricCanvasRef = useRef(null)
	const activeToolRef = useRef(null)

	// Configuración inicial del canvas
	useEffect(() => {
		const canvasElement = canvasRef.current
		if (!canvasElement) return

		const parent = canvasElement.parentNode
		const canvas = new fabric.Canvas(canvasElement, {
			width: parent.offsetWidth,
			height: parent.offsetHeight,
			selection: false,
		})

		fabricCanvasRef.current = canvas
		fabricCanvasRef.current.defaultCursor = 'default'

		return () => canvas.dispose()
	}, [])

	// Configuración inicial del canvas
	useEffect(() => {
		if (id && fabricCanvasRef) {
			uploadDiagramDb(id, fabricCanvasRef)
		}
	}, [id, fabricCanvasRef])

	// Eliminar objetos con tecla Delete

	return (
		<CardCustom
			className={
				'w-full  h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'
			}
		>
			<div
				key={'canvasDiseno'}
				id={'canva'}
				className='flex w-full bg-slate-200 relative'
				onDrop={(e) => handleDrop(e, fabricCanvasRef, setSelectedObject, changeTool)}
				onDragOver={(e) => e.preventDefault()}
			>
				<div className={`flex w-full ${styles.hscreenCustom} `}>
					<canvas ref={canvasRef} width={1000} height={600} style={{ border: '1px solid black' }} />
				</div>
			</div>
		</CardCustom>
	)
}

export default ViewDiagram
