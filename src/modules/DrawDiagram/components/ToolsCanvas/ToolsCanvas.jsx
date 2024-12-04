import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useEffect, useState } from 'react'
import { IoImagesOutline, IoRemoveOutline } from 'react-icons/io5'
import { MdOutlinePolyline } from 'react-icons/md'
import { RiText } from 'react-icons/ri'
import MenuObject from '../MenuObject/MenuObject'
import PropertiesSelect from '../PropertiesSelect/PropertiesSelect'
function ToolsCanvas({ selectedObject, AddText, convertToImagenTopic }) {
	const [alignment, setAlignment] = useState('web')

	const handleChange = (event, newAlignment) => {
		setAlignment(newAlignment)
	}
	useEffect(() => {
		setAlignment(selectedObject ? 'SelectImage' : null)
	}, [selectedObject])
	return (
		<>
			<ToggleButtonGroup
				className='bg-white'
				color='primary'
				value={alignment}
				exclusive
				onChange={handleChange}
				aria-label='Platform'
			>
				<ToggleButton value='Line'>
					<IoRemoveOutline />
				</ToggleButton>
				<ToggleButton value='PoliLine'>
					<MdOutlinePolyline />
				</ToggleButton>
				<ToggleButton value='Text'>
					<RiText />
				</ToggleButton>
				<ToggleButton value='Image'>
					<IoImagesOutline />
				</ToggleButton>
			</ToggleButtonGroup>
			{alignment == 'Image' ? <MenuObject /> : null}
			{alignment == 'SelectImage' ? (
				<PropertiesSelect data={selectedObject} AddText={AddText} convertToImagenTopic={convertToImagenTopic} />
			) : null}
		</>
	)
}

export default ToolsCanvas
