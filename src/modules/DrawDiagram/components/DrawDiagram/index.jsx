import * as fabric from 'fabric'
import { useEffect, useRef, useState } from 'react'
import CardCustom from '../../../../components/CardCustom'
import styles from '../../utils/css/style.module.css'
import ToolsCanvas from '../ToolsCanvas/ToolsCanvas'
import { ImageDiagram, ImageTopic } from '../../class/Image'
import Swal from 'sweetalert2'
import { Button } from '@mui/material'
function DrawDiagram() {
	const canvasRef = useRef(null) // Referencia al elemento canvas
	const fabricCanvasRef = useRef(null) // Referencia al lienzo de Fabric
	const [selectedObject, setSelectedObject] = useState(null) // Estado del objeto seleccionado

	const [images, setImages] = useState([])
	useEffect(() => {
		const canvasElement = canvasRef.current
		if (canvasElement) {
			const parent = canvasElement.parentNode
			const fabricCanvas = new fabric.Canvas(canvasElement, {
				width: parent.offsetWidth,
				height: parent.offsetHeight,
			})
			fabricCanvasRef.current = fabricCanvas
			// Ajustar el tamaño inicial del lienzo
			fabricCanvas.on('mouse:down', (e) => {
				const selected = e.target
				if (selected && selected.metadata) {
					setSelectedObject(selected.metadata) // Actualiza el estado con el objeto relacionado
				} else {
					setSelectedObject(null)
				}
			})

			fabricCanvas.on('object:modified', (e) => {
				const selected = e.target

				if (selected && selected.metadata) {
					selected.metadata.move(selected.top, selected.left)
					selected.metadata.resize(selected.width * selected.scaleX, selected.height * selected.scaleY)
					addText(selected.metadata)
				} else {
					setSelectedObject(null)
				}
			})

			fabricCanvas.renderAll() // Renderiza el canvas
		}

		// Cleanup cuando el componente se desmonte
		return () => {
			if (fabricCanvasRef.current) {
				fabricCanvasRef.current.dispose() // Limpia el lienzo
			}
		}
	}, [])

	const handleConvertToImagenTopic = async (id, status) => {
		const fabricCanvas = fabricCanvasRef.current
		const object = fabricCanvas.getObjects().find((obj) => obj.metadata.id === id)

		if (object) {
			const imageChange = images.find((img) => img.id == id)
			let newImagen
			if (status) {
				newImagen = new ImageTopic(imageChange, {})
				newImagen.setStatusTopic(1)
			} else {
				newImagen = new ImageDiagram(imageChange)
			}
			setSelectedObject(newImagen)
			object.metadata = newImagen
			setImages((prevImages) => prevImages.map((img) => (img.id === id ? newImagen : img)))
		}
	}

	const handleDrop = (e) => {
		try {
			e.preventDefault()
			const imageSrc = e.dataTransfer.getData('text/plain') // URL de la imagen
			const imageName = e.dataTransfer.getData('name') // URL de la imagen
			const fabricCanvas = fabricCanvasRef.current
			if (!fabricCanvas || !imageSrc) return

			const imgNode = new Image()
			imgNode.src = imageSrc

			const left = e.nativeEvent.offsetX - 50
			const top = e.nativeEvent.offsetY - 50
			const id = images.length + 1
			const imgnueva = new ImageDiagram({
				id,
				name: imageName,
				src: imageSrc,
				left: left,
				top: top,
				width: imgNode.width * 0.25,
				height: imgNode.height * 0.25,
			})

			imgNode.onload = () => {
				// Crear una imagen de Fabric.js con las dimensiones correctas
				const img = new fabric.FabricImage(imgNode, {
					left, // Coordenadas iniciales
					top,
					scaleX: 0.25, // Escala predeterminada
					scaleY: 0.25,
					opacity: 1,
					id,
				})

				// Asocia el ImageDiagram al objeto de Fabric.js
				img.metadata = imgnueva

				// Añadir la imagen al lienzo
				fabricCanvas.add(img)
			}

			setImages((prev) => [...prev, imgnueva])
		} catch (error) {
			Swal.fire({ title: 'Atención!', text: error, icon: 'warning' })
		}
	}

	useEffect(() => {
		function onKeyDownHandler(e) {
			const fabricCanvas = fabricCanvasRef.current
			switch (e.keyCode) {
				case 46: // delete
					const activeObject = fabricCanvas.getActiveObject()
					const group = fabricCanvas
						.getObjects()
						.find((obj) => obj.metadata === activeObject.metadata.id + 'group')
					if (activeObject) {
						if (group) {
							fabricCanvas.remove(group)
						}
						fabricCanvas.remove(activeObject)
						fabricCanvas.discardActiveObject()
						fabricCanvas.renderAll()

						// Elimina la imagen del array `images`
						const updatedImages = images.filter((img) => {
							return img.id !== activeObject.metadata.id
						})
						setImages(updatedImages) // Actualiza el estado de las imágenes
						setSelectedObject(null)
					}
					e.preventDefault()
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', onKeyDownHandler)
		return () => {
			window.removeEventListener('keydown', onKeyDownHandler)
		}
	}, [images]) // Asegúrate de que `images` esté actualizado

	const addText = async (props) => {
		if (!props.statusTitle) return
		const fabricCanvas = fabricCanvasRef.current

		// Buscar si ya existe un grupo con el metadata
		let group = fabricCanvas.getObjects().find((obj) => obj.metadata === props.id + 'group')

		if (group) {
			// Si el grupo ya existe, actualizar texto y fondo
			const textObj = group
				.getObjects()
				.find((obj) => obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox')
			const background = group.getObjects().find((obj) => obj.type === 'rect')
			if (textObj) {
				textObj.set('text', props.title)
				textObj.set('fontSize', props.sizeText || textObj.fontSize)
				textObj.set('fill', props.colorText || textObj.fill)
			}

			if (background) {
				background.set('width', textObj.width + 20)
				background.set('height', textObj.height + 10)
				background.set('fill', props.backgroundText || background.fill)
			}

			const { left, top } = await ubicationText(props, textObj)
			group.set('width', background.width)
			group.set('height', background.height)
			group.set('left', left)
			group.set('top', top)
			// Renderizar el canvas para reflejar los cambios
			await fabricCanvas.renderAll()
		} else {
			// Si el grupo no existe, crearlo
			const text = new fabric.Textbox(props.title, {
				fontSize: props.sizeText || 20,
				fill: props.colorText || 'black',
				maxWidth: 150,
				textAlign: 'center',
				originX: 'center',
				originY: 'center',
			})
			text.metadata = props.id + 'text'

			const background = new fabric.Rect({
				width: text.width + 20,
				height: text.height + 10,
				fill: props.backgroundText || 'white',
				originX: 'center',
				originY: 'center',
			})
			background.metadata = props.id + 'background'
			const { left, top } = await ubicationText(props, text)
			const group = new fabric.Group([background, text], {
				left: left,
				top: top,
			})
			group.metadata = props.id + 'group'
			fabricCanvas.add(group)
			fabricCanvas.renderAll()
		}
	}
	const ubicationText = async (props, text) => {
		const leftImg = props.left
		const topImg = props.top
		const widthImg = props.width
		const heightImg = props.height

		let left = 0
		let top = 0
		// Ajuste en el cálculo de la posición del texto
		switch (props.textPosition) {
			case 'Left':
				left = leftImg - text.width - 40 // A la izquierda de la imagen
				top = topImg + heightImg / 2 - text.height / 2 // Centrado verticalmente respecto a la imagen
				break
			case 'Right':
				left = leftImg + widthImg + 20 // A la derecha de la imagen
				top = topImg + heightImg / 2 - text.height / 2 // Centrado verticalmente respecto a la imagen
				break
			case 'Top':
				left = leftImg + widthImg / 2 - text.width / 2 // Centrado horizontalmente sobre la imagen
				top = topImg - text.height - 10 // Arriba de la imagen
				break
			case 'Bottom':
				left = leftImg + widthImg / 2 - text.width / 2 // Centrado horizontalmente debajo de la imagen
				top = topImg + heightImg + 15 // Debajo de la imagen
				break
			case 'Center':
				left = leftImg + widthImg / 2 - text.width / 2 // Centrado horizontalmente sobre la imagen
				top = topImg + heightImg / 2 - text.height / 2 // Centrado verticalmente sobre la imagen
				break
			default:
				left = leftImg + widthImg / 2 - text.width / 2 // Centrado horizontalmente por defecto
				top = topImg + heightImg / 2 - text.height / 2 // Centrado verticalmente por defecto
				break
		}

		return { left, top }
	}

	return (
		<CardCustom
			className={
				'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'
			}
		>
			<div
				key={'canvasDiseno'}
				id={'canva'}
				className='flex w-full bg-slate-200 relative'
				onDrop={handleDrop} // Manejar el evento de soltar
				onDragOver={(e) => e.preventDefault()} // Permitir que las imágenes sean soltadas
			>
				<div className={`flex w-full ${styles.hscreenCustom} `}>
					<canvas ref={canvasRef} width={1000} height={600} style={{ border: '1px solid black' }} />
				</div>
				<div className='absolute top-2 left-2 w-1/4'>
					<ToolsCanvas
						selectedObject={selectedObject}
						AddText={addText}
						convertToImagenTopic={handleConvertToImagenTopic}
					/>
				</div>
			</div>
		</CardCustom>
	)
}

export default DrawDiagram
