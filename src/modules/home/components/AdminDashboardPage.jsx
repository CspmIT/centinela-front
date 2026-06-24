import { useEffect, useMemo, useState } from 'react'
import { Autocomplete, Avatar, Box, Container, TextField } from '@mui/material'
import { PersonOutline } from '@mui/icons-material'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import PageHeader from '../../../components/PageHeader'
import Home from '../views/index'

const selectorShellSx = {
	borderRadius: '12px',
	border: '1px solid rgba(15, 42, 68, 0.06)',
	backgroundColor: '#ffffff',
	p: { xs: 1.25, sm: 1.5 },
	mb: 1.5,
	display: 'flex',
	flexDirection: { xs: 'column', md: 'row' },
	alignItems: { xs: 'stretch', md: 'center' },
	gap: { xs: 1.25, md: 2 },
	'body.dark &': {
		border: '1px solid rgba(255, 255, 255, 0.06)',
		backgroundColor: 'rgba(17, 24, 39, 0.6)',
	},
}

const widgetChipSx = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 0.5,
	px: 1,
	py: 0.15,
	borderRadius: '999px',
	fontSize: '0.7rem',
	fontWeight: 600,
	letterSpacing: '0.02em',
	backgroundColor: 'rgba(227, 106, 0, 0.1)',
	color: '#b45309',
	border: '1px solid rgba(227, 106, 0, 0.25)',
	marginLeft: 'auto',
	'body.dark &': {
		backgroundColor: 'rgba(251, 146, 60, 0.16)',
		color: '#fed7aa',
		border: '1px solid rgba(251, 146, 60, 0.3)',
	},
}

const emptyStateSx = {
	borderRadius: '16px',
	border: '1px dashed rgba(15, 42, 68, 0.14)',
	backgroundColor: '#ffffff',
	py: { xs: 6, sm: 10 },
	px: 3,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 2,
	opacity: 0,
	transform: 'translateY(6px)',
	animation: 'adminEmptyIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
	'@keyframes adminEmptyIn': {
		'0%': { opacity: 0, transform: 'translateY(6px)' },
		'100%': { opacity: 1, transform: 'translateY(0)' },
	},
	'body.dark &': {
		border: '1px dashed rgba(255, 255, 255, 0.12)',
		backgroundColor: 'rgba(17, 24, 39, 0.4)',
	},
}

const dashboardShellSx = {
	borderRadius: '14px',
	border: '1px solid rgba(15, 42, 68, 0.06)',
	backgroundColor: 'rgba(248, 250, 252, 0.6)',
	p: { xs: 1, sm: 1.5 },
	'body.dark &': {
		border: '1px solid rgba(255, 255, 255, 0.06)',
		backgroundColor: 'rgba(17, 24, 39, 0.4)',
	},
}

export default function AdminDashboardPage() {
	const [users, setUsers] = useState([])
	const [selectedUser, setSelectedUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchUsers()
	}, [])

	async function fetchUsers() {
		try {
			const { data } = await request(`${backend['Centinela']}/admin/users`, 'GET')
			setUsers(data)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const userInitial = useMemo(
		() => selectedUser?.name?.charAt(0).toUpperCase() ?? '',
		[selectedUser]
	)

	return (
		<Container maxWidth={false} disableGutters className='w-full sm:px-5 pt-2 pb-4'>
			<PageHeader
				title='Administrador de Dashboard'
			/>

			<Box sx={selectorShellSx}>
				<Autocomplete
					options={users}
					loading={loading}
					value={selectedUser}
					onChange={(_, newValue) => setSelectedUser(newValue)}
					getOptionLabel={(user) => `${user.name} — ${user.email}`}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					sx={{ width: { xs: '100%', md: 360 } }}
					renderOption={(props, user) => (
						<li {...props} key={user.id}>
							<div className='flex items-center gap-2.5 w-full'>
								<Avatar
									sx={{
										width: 28,
										height: 28,
										fontSize: 12,
										background:
											'linear-gradient(135deg, #e36a00 0%, #a14b00 100%)',
									}}
								>
									{user.name?.charAt(0).toUpperCase()}
								</Avatar>
								<div className='min-w-0'>
									<div className='text-[13px] font-semibold text-slate-900 dark:text-gray-100 truncate'>
										{user.name}
									</div>
									<div className='text-[11px] text-slate-500 dark:text-gray-400 truncate'>
										{user.email}
									</div>
								</div>
								<Box component='span' sx={widgetChipSx}>
									{user.widgetCount} widgets
								</Box>
							</div>
						</li>
					)}
					renderInput={(params) => (
						<TextField
							{...params}
							label='Buscar usuario'
							size='small'
							placeholder='Nombre o email...'
						/>
					)}
				/>

				{selectedUser && (
					<div className='flex items-center gap-2.5 min-w-0'>
						<Avatar
							sx={{
								width: 36,
								height: 36,
								fontSize: 14,
								background:
									'linear-gradient(135deg, #e36a00 0%, #a14b00 100%)',
								boxShadow: '0 4px 14px rgba(227, 106, 0, 0.3)',
							}}
						>
							{userInitial}
						</Avatar>
						<div className='min-w-0'>
							<div className='text-sm font-semibold text-slate-900 dark:text-gray-100 truncate'>
								{selectedUser.name}
							</div>
							<div className='text-xs text-slate-500 dark:text-gray-400 truncate'>
								{selectedUser.email} · {selectedUser.widgetCount} widgets
							</div>
						</div>
					</div>
				)}
			</Box>

			{selectedUser ? (
				<Box sx={dashboardShellSx}>
					<Home key={selectedUser.id} targetUserId={selectedUser.id} />
				</Box>
			) : (
				<Box sx={emptyStateSx}>
					<div
						className='flex items-center justify-center rounded-full shadow-[0_10px_30px_-8px_rgba(227,106,0,0.45)]'
						style={{
							width: 72,
							height: 72,
							background:
								'linear-gradient(135deg, #e36a00 0%, #a14b00 100%)',
						}}
					>
						<PersonOutline sx={{ fontSize: 36, color: '#ffffff' }} />
					</div>
					<div className='text-center max-w-sm'>
						<div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e36a00] dark:text-[#fb923c] mb-1.5'>
							Sin selección
						</div>
						<div className='text-base font-semibold text-slate-700 dark:text-gray-200 mb-1'>
							Ningún usuario seleccionado
						</div>
						<div className='text-sm text-slate-500 dark:text-gray-400'>
							Seleccione un usuario para visualizar y editar su dashboard personalizado.
						</div>
					</div>
				</Box>
			)}
		</Container>
	)
}
