import { Add, Edit, Search } from '@mui/icons-material'
import {
	Box,
	Divider,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemText,
	TextField,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import ModalVar from '../../../../components/DataGenerator/ModalVar'
import { getVarsInflux } from './actions'

const floatingPanelSx = {
	borderRadius: '12px',
	border: '1px solid #a14b00',
	backgroundColor: '#f8fafc',
	boxShadow: '0 10px 30px rgba(15, 42, 68, 0.18)',
	'body.dark &': {
		border: '1px solid rgba(255, 255, 255, 0.06)',
		backgroundColor: 'rgba(17, 24, 39, 0.85)',
		boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
	},
}

const iconButtonPrimarySx = {
	width: 40,
	height: 40,
	borderRadius: '10px',
	color: '#ffffff',
	background: 'linear-gradient(135deg, #fb923c 0%, #e36a00 100%)',
	boxShadow: '0 4px 14px rgba(251, 146, 60, 0.35)',
	transition: 'box-shadow 0.2s ease, transform 0.2s ease',
	'&:hover': {
		background: 'linear-gradient(135deg, #fb923c 0%, #e36a00 100%)',
		boxShadow: '0 8px 24px rgba(251, 146, 60, 0.45)',
		transform: 'translateY(-1px)',
	},
	'&:active': { transform: 'translateY(0)' },
}

function ListField({ onSelectVariable, onClose }) {
	const [listVariable, setListVariable] = useState([])
	const [listfilter, setListfilter] = useState([])
	const [varSelected, setVarSelected] = useState(null)
	const [openModal, setOpenModal] = useState(false)

	const setVariables = async () => {
		const variables = await getVarsInflux()
		setListfilter(variables)
		setListVariable(variables)
	}

	useEffect(() => {
		setVariables()
	}, [openModal])

	const filter = (text) => {
		const lowered = text.toLowerCase()
		setListfilter(
			listVariable.filter((variable) => variable.name.toLowerCase().includes(lowered))
		)
	}

	return (
		<Box sx={floatingPanelSx} className='w-full p-3 flex flex-col gap-3'>
			<ModalVar openModal={openModal} setOpenModal={setOpenModal} data={varSelected} />

			<div className='flex items-center justify-between'>
				<Typography
					typography={'subtitle1'}
					className='uppercase !font-semibold !tracking-tight text-slate-800 dark:!text-gray-100'
				>
					Variables
				</Typography>
				<IconButton
					size='small'
					sx={iconButtonPrimarySx}
					onClick={() => {
						setOpenModal(true)
						setVarSelected(null)
					}}
				>
					<Add fontSize='small' />
				</IconButton>
			</div>

			<Divider />

			<TextField
				size='small'
				fullWidth
				onChange={(e) => filter(e.target.value)}
				label='Buscar'
				variant='outlined'
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<Search fontSize='small' />
						</InputAdornment>
					),
				}}
			/>

			{listVariable.length ? (
				<List dense className='overflow-y-auto max-h-[400px] !py-0'>
					{listfilter.map((variable, index) => (
						<ListItem
							key={index}
							button
							onClick={() => {
								onSelectVariable(variable)
								onClose?.()
							}}
							className='!rounded-md hover:!bg-[#e36a00]/10 dark:hover:!bg-[#fb923c]/15'
						>
							<ListItemText
								primary={variable.name}
								primaryTypographyProps={{
									className: 'text-slate-800 dark:!text-gray-100',
								}}
							/>
							<IconButton
								size='small'
								color='warning'
								className='!bg-yellow-100 dark:!bg-yellow-900/40'
								onClick={() => {
									setVarSelected(variable)
									setOpenModal(true)
								}}
							>
								<Edit fontSize='small' />
							</IconButton>
						</ListItem>
					))}
				</List>
			) : null}
		</Box>
	)
}

export default ListField
