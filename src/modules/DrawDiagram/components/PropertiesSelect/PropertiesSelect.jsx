import { Typography } from '@mui/material'
import styles from '../../utils/css/style.module.css'
import { ImageDiagram } from '../../class/Image'
import FormPropImg from './FormPropImg'
function PropertiesSelect({ data, AddText, convertToImagenTopic }) {
	if (!data) return null
	return (
		<div className={`w-full pt-4 bg-gray-100 `}>
			<div className='flex w-full justify-center items-center border-b-2 mb-4'>
				<Typography className='text-center uppercase !font-bold ' typography={'h6'}>
					propiedades
				</Typography>
			</div>

			<div className={`w-full p-3 flex flex-col gap-3 ${styles.hMaxListImg}`}>
				{data instanceof ImageDiagram ? (
					<FormPropImg data={data} AddText={AddText} convertToImagenTopic={convertToImagenTopic} />
				) : null}
			</div>
		</div>
	)
}

export default PropertiesSelect
