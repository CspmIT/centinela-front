import { Accordion, AccordionDetails, AccordionSummary, Checkbox, TextField } from '@mui/material'
import PropertyText from './PropertyText'
import { useEffect, useState } from 'react'
import PropertyTopic from './PropertyTopic'

function FormPropImg({ data, AddText, convertToImagenTopic }) {
	const [info, setInfo] = useState(data)
	const [checkBoxText, setCheckBoxText] = useState(Boolean(info.statusTitle))
	const [checkBoxTopic, setCheckBoxTopic] = useState(Boolean(info.statusTopic))
	const activeTitle = (status) => {
		setCheckBoxText(Boolean(status))
		setInfo((prev) => ({ ...prev, statusTitle: Boolean(status) }))
		AddText(info)
		data.setStatusTitle(status)
	}
	const activeTopic = async (status) => {
		setCheckBoxTopic(Boolean(status))
		setInfo((prev) => ({ ...prev, statusTopic: Boolean(status) }))
		await convertToImagenTopic(data.id, status)
	}

	useEffect(() => {
		setInfo(data) // Actualiza el estado `info` cuando `data` cambia
		setCheckBoxText(Boolean(data.statusTitle))
		setCheckBoxTopic(Boolean(data.statusTopic))
	}, [data])

	const changeName = (string) => {
		data.setName(string)
		setInfo((prev) => ({ ...prev, name: string }))
	}
	return (
		<>
			<TextField
				type='text'
				label='Nombre'
				id='name'
				name='name'
				onChange={(e) => changeName(e.target.value)}
				className='w-full'
				value={info.name}
			/>
			<Accordion className='!mb-0' expanded={checkBoxText} onChange={() => activeTitle(!checkBoxText)}>
				<AccordionSummary aria-controls='panel1-content' id='panel1-header'>
					<div className='flex justify-start items-center'>
						<Checkbox key={'text'} checked={checkBoxText} /> Texto
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<PropertyText AddText={AddText} data={data} />
				</AccordionDetails>
			</Accordion>
			<Accordion className='!mt-0' expanded={checkBoxTopic} onChange={() => activeTopic(!checkBoxTopic)}>
				<AccordionSummary aria-controls='panel1-content' id='panel1-header'>
					<div className='flex justify-start items-center'>
						<Checkbox key={'topic'} checked={checkBoxTopic} /> Conexion Influx
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<PropertyTopic data={data} />
				</AccordionDetails>
			</Accordion>
		</>
	)
}

export default FormPropImg
