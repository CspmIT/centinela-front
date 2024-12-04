import { useContext, useState } from 'react'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import TabsHome from '../components/TabHome'
import CardDashboard from '../components/CardDashboard/CardDashboard'
import { useMediaQuery } from '@mui/material'

const Home = () => {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const isMobile = useMediaQuery('(max-width: 600px)')
	const navigate = useNavigate()
	const newTabBoard = (data) => {
		const existingTabIndex = tabs.findIndex((tab) => tab.name === data.name && tab.id === data.id)
		if (existingTabIndex !== -1) {
			setTabCurrent(existingTabIndex)
		} else {
			setTabs((prevTabs) => [
				...prevTabs,
				{
					name: data.name,
					id: data.id,
					link: '/board',
					component: typeEquipment(data.type_recloser),
				},
			])
			setTabCurrent(tabs.length)
		}
		navigate('/tabs')
	}
	const tabsHome = [
		{
			id: 1,
			title: 'Sensores',
			component: (
				<>
					<h1>Hola</h1>
				</>
			),
		},
	]
	return (
		<div className='flex flex-col w-full pt-4'>
			{/* {!isMobile ? (
				<div className='flex flex-wrap gap-3 mb-5 px-3 max-sm:hidden'>
					<CardDashboard />
				</div>
			) : null} */}
			<TabsHome tabs={tabsHome} />
		</div>
	)
}

export default Home
