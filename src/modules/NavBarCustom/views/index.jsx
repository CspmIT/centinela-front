import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { ListItemText, ListItemIcon, ListItemButton, ListItem, IconButton, Divider, List, Toolbar, useMediaQuery, Badge } from '@mui/material'
import DropdownImage from '../../core/components/DropdownImage'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ButtonModeDark from '../../core/components/ButtonModeDark'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AppBarCustom from '../components/AppBarCustom'
import DrawerCustom from '../components/DrawerCustom'
import DrawerHeaderCustom from '../components/DrawerHeaderCustom'
import SubMenuCustom from '../components/SubMenuCustom'
import { MainContext } from '../../../context/MainContext'
import BottonApps from '../../LoginApp/utils/components/BottonApps/BottonApps'
import { storage } from '../../../storage/storage'
import { getPermissionDb } from '../utils/js'
import { PiTabsFill } from 'react-icons/pi'
import ListIcon from '../../../components/ListIcon'
import styles from '../utils/css/styles.module.css'
import Logo from '/src/assets/img/Logo/LogoTextCentinela.png'
import { list_menu } from '../../ConfigMenu/components/PermissionMenu/components/data'
import { isTauri } from '@tauri-apps/api/core'
import ButtonDownloads from '../../core/components/ButtonDownloads'

function NavBarCustom({ setLoading }) {
	const [open, setOpen] = useState(false)
	const [nameCoop, setNameCoop] = useState('')
	const { tabActive, tabs, infoNav, permission, setPermission, unreadCount } = useContext(MainContext)
	const navigate = useNavigate()
	const NavBarRef = useRef(null)
	const { pathname } = useLocation()
	const locationTAbs = pathname.split('/')[1] || '/DashBoard'
	const location = pathname
	const [buttonActive, setButtonActive] = useState(location)
	const isMobile = useMediaQuery('(max-width: 600px)')

	const handleDrawerOpen = () => {
		setOpen(true)
	}
	const handleDrawerClose = () => {
		setOpen(false)
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (NavBarRef.current && !NavBarRef.current.contains(event.target)) {
				handleDrawerClose()
			}
		}
		document.addEventListener('mouseup', handleClickOutside)
		return () => {
			document.removeEventListener('mouseup', handleClickOutside)
		}
	}, [])
	const [newEvent, setNewEvent] = useState(false)

	// useEffect(() => {
	// 	const socket = io(front['Mas Agua'], { path: '/api/socket.io', query: { token: Cookies.get('token') } })

	// 	socket.on('alert-active', (data) => {
	// 		setNewEvent(data.active)
	// 	})
	// 	return () => socket.disconnect()
	// }, [])

	useEffect(() => {
		setButtonActive(location)
		if (location === '/DashBoard') {
			setButtonActive('/home')
		}
		if (infoNav != '') {
			setButtonActive(typeof infoNav == 'object' ? infoNav[0].link : infoNav)
		}
		if (location === '/' || location === '/Home' || location === '') {
			setButtonActive('/home')
		}
		if ((locationTAbs.includes('Abm') || locationTAbs.includes('AbmDevice')) && infoNav == '') {
			navigate('/Home')
		}
	}, [location, locationTAbs])

	const activeButton = useCallback(
		(id) => {
			navigate(id)
		},
		[navigate]
	)
	const [menuSideBar, setMenuSideBar] = useState([])
	const groupedMenu = async (data) => {
		const result = data.reduce((acc, menu) => {
			const groupMenuId = parseInt(menu.group_menu)
			if (!acc[groupMenuId]) {
				acc[groupMenuId] = { ...menu, subMenus: [] }
			}
			if (menu.sub_menu) {
				const parentMenu = acc[groupMenuId]
				const subMenu = { ...menu, subMenus: [] }
				const findAndAddSubMenu = (parent, sub) => {
					if (parent.id === sub.sub_menu) {
						parent.subMenus.push(sub)
					} else {
						for (let i = 0; i < parent.subMenus.length; i++) {
							findAndAddSubMenu(parent.subMenus[i], sub)
						}
					}
				}
				findAndAddSubMenu(parentMenu, subMenu)
			}
			return acc
		}, [])
		result.sort((a, b) => a.order - b.order)
		setMenuSideBar(result.filter((item) => Object.values(item).length))
	}

	const getPermissions = async () => {
		const permiso = import.meta.env.VITE_WIFI == 'sin' ? list_menu : await getPermissionDb()
		setPermission(permiso)
		await groupedMenu(permiso)
		setLoading(true)
	}

	useEffect(() => {
		const user = storage.get('usuario')
		const coop = storage.get('usuarioCooptech')

		if (!coop) return

		const clienteName =
			user?.cliente?.[0]?.name ||	 // 
			coop?.cliente?.find?.((item) => item.selected) ||
			coop?.cliente?.name ||
			''

		if (clienteName) setNameCoop(clienteName)
		getPermissions()
	}, [])


	return (
		<>
			<AppBarCustom className='!max-h-11 flex justify-center' position='fixed' open={open}>
				<Toolbar className='!pl-0'>
					{!isMobile && !open && (
						<div className='w-[57px] flex justify-center shrink-0'>
							<IconButton
								color='inherit'
								aria-label='open drawer'
								onClick={handleDrawerOpen}
								size='small'
								sx={{ boxShadow: 'none' }}
							>
								<MenuIcon />
							</IconButton>
						</div>
					)}

					<img
						onClick={() => navigate('home')}
						className={`max-h-10 cursor-pointer ${isMobile || open ? 'ml-4' : ''}`}
						src={Logo}
					/>
					<div className='absolute right-5 flex flex-row items-center'>
						<span className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-1 mr-2 text-white/95 text-sm font-medium tracking-wide select-none ${isMobile ? 'hidden' : ''}`}>
							{nameCoop}
						</span>
						{!isTauri() && (
							<ButtonDownloads />
						)}
						<BottonApps />
						{/* <ButtonModeDark /> */}
						<DropdownImage />
					</div>
				</Toolbar>
			</AppBarCustom>
			<DrawerCustom
				variant='permanent'
				open={open}
				ref={NavBarRef}
				sx={{
					...(isMobile && {
						position: 'fixed',
						bottom: 'calc(12px + env(safe-area-inset-bottom))',
						left: 12,
						right: 12,
						width: 'auto',
						height: 60,
						zIndex: 1200,
						'& .MuiDrawer-paper': {
							position: 'absolute',
							inset: 0,
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-around',
							padding: 0,
							borderRadius: '999px',
							overflow: 'hidden',
							border: '1px solid rgba(15, 42, 68, 0.06)',
							boxShadow: 'none',
						},
					}),
				}}
			>
				<div className='bg-white dark:bg-gray-800 h-full w-full flex flex-col sm:border-r border-slate-200 dark:border-slate-700'>
					<DrawerHeaderCustom className='!min-h-11 !h-11 shrink-0' style={{ display: isMobile ? 'none' : '' }}>
						<IconButton onClick={handleDrawerClose}>
							<ChevronLeftIcon className='dark:text-white' />
						</IconButton>
					</DrawerHeaderCustom>
					<Divider className='shrink-0 hidden sm:block' />

					<List
						className='navbar-scroll'
						sx={{
							flex: 1,
							minHeight: 0,
							py: 0.5,
							overflowY: 'auto',
							overflowX: 'hidden',
							'&::-webkit-scrollbar': { width: 6 },
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: 'rgba(208, 94, 0, 0.35)',
								borderRadius: 3,
							},
							'&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
							...(isMobile && {
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-around',
								alignItems: 'center',
								width: '100%',
								height: '100%',
								padding: 0,
							}),
						}}
					>
						{menuSideBar.map((item, index) => {
							if (item.name.includes('ABM') && (item.link == '' || infoNav == '')) {
								return null
							}
							if (!permission.some((perm) => perm.name == item.name)) {
								return null
							}
							const listIcon = ListIcon()
							const componentIcon = listIcon.filter((icono) => icono.name === item.icon)?.[0] || ''
							const isActive = buttonActive?.includes(item.link)

							return (
								<ListItem
									key={index}
									disablePadding
									sx={{
										overflow: 'hidden',
										...(isMobile && {
											flexGrow: 1,
											flexBasis: 0,
											maxWidth: 60
										}),
									}}
								>
									{item.subMenus.length ? (
										<SubMenuCustom
											item={item}
											className={`dark:text-white`}
											openSideBar={open}
											buttonActive={buttonActive}
											activeButton={activeButton}
										/>
									) : (
										<Link to={item.link} className={`!w-full text-black dark:text-white`}>
											<ListItemButton
												sx={{
													minHeight: 32,
													position: 'relative',
													justifyContent: !isMobile && open ? 'initial' : 'center',
													padding: !isMobile ? '1rem' : '0.2rem',
													py: 1.2,
													transition: 'background-color 180ms ease',
													backgroundColor:
														!isMobile && isActive
															? 'rgba(208, 94, 0, 0.08)'
															: 'transparent',
													'&:hover': {
														backgroundColor: !isMobile
															? isActive
																? 'rgba(208, 94, 0, 0.12)'
																: 'rgba(208, 94, 0, 0.05)'
															: 'transparent',
													},
													...(!isMobile &&
														isActive && {
															'&::before': {
																content: '""',
																position: 'absolute',
																left: 0,
																top: '22%',
																bottom: '22%',
																width: '3px',
																borderRadius: '0 3px 3px 0',
																background:
																	'linear-gradient(180deg, #e36a00 0%, #a14b00 100%)',
																boxShadow: '0 0 6px rgba(227, 106, 0, 0.45)',
															},
														}),
													...(isMobile && {
														borderRadius: '999px',
														mx: 0.75,
													}),
												}}
												className={`!w-full ${item.link === '/Alert' && newEvent ? styles.backgroundAlert : ''
													}`}
												onClick={() => activeButton(item.link)}
											>
												<ListItemIcon
													className={`${!isMobile && open ? '!mr-3' : ''}`}
													sx={{
														overflow: 'visible',
														position: 'relative',
														zIndex: 2000,
														minWidth: 0,
														justifyContent: 'center',
														color: isActive ? '#d05e00' : '#64748b',
														transition: 'color 180ms ease',
														'& svg': { fontSize: 24 },
														'body.dark &': {
															color: isActive ? '#d05e00' : '#94a3b8',
														},
													}}
												>
													{item.link === 'alert' ? (
														<Badge
															badgeContent={unreadCount}
															invisible={!unreadCount || unreadCount === 0}
															overlap="circular"
															anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
															sx={{
																pointerEvents: 'none',
																'& .MuiBadge-badge': {
																	backgroundColor: '#d05e00',
																	color: '#fff',
																},
															}}
														>
															{componentIcon.icon}
														</Badge>
													) : (
														componentIcon.icon
													)}
												</ListItemIcon>

												<ListItemText
													primary={item.name}
													primaryTypographyProps={{
														fontSize: '0.95rem',
														fontWeight: isActive ? 600 : 500,
													}}
													sx={{
														color: isActive ? '#d05e00' : '',
														display: !isMobile && open ? 'block' : 'none',
													}}
												/>
											</ListItemButton>
										</Link>
									)}
								</ListItem>
							)
						})}
						{tabs.length == 0 && !locationTAbs.includes('tabs') ? null : (
							<ListItem
								key={'tabs'}
								disablePadding
								sx={{
									...(isMobile && {
										flexGrow: 1,
										flexBasis: 0,
										justifyContent: 'center',
										display: 'flex',
									}),
								}}
							>
								<Link to={'/tabs'} className={`!w-full text-black dark:text-white`}>
									<ListItemButton
										sx={{
											minHeight: 48,
											justifyContent: !isMobile && open ? 'initial' : 'center',
											px: 2.5,
											py: 1.8,
										}}
										className='!w-full'
										onClick={() => activeButton('/tabs')}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: !isMobile && open ? 3 : 0,
												justifyContent: 'center',
												color: buttonActive == '/tabs' ? '#d05e00' : '#64748b',
												transition: 'color 180ms ease',
												'& svg': { fontSize: 24 },
												'body.dark &': {
													color: buttonActive == '/tabs' ? '#d05e00' : '#94a3b8',
												},
											}}
										>
											<Badge badgeContent={tabActive} color='primary'>
												<PiTabsFill className='dark:text-white text-3xl' />
											</Badge>
										</ListItemIcon>
										<ListItemText
											primary={'Paginas'}
											sx={{
												color: buttonActive == '/tabs' ? '#d05e00' : '',
												display: !isMobile && open ? 'block' : 'none',
											}}
										/>
									</ListItemButton>
								</Link>
							</ListItem>
						)}
					</List>
				</div>
			</DrawerCustom>
		</>
	)
}

export default NavBarCustom
