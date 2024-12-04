import { useEffect, useState } from 'react'
import { DndContext, DragOverlay, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KeyboardSensor, PointerSensor } from '@dnd-kit/core'
import ContainerDnd from './ContainerDnd'
import ItemsDnD from './ItemsDnd'
import { findItemById, handleDragMove, handleDragStart, handleDragEnd } from './utils/dndHandlers'

function DndComponent({ children }) {
	const [containers, setContainers] = useState([])

	const [activeId, setActiveId] = useState(null)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	// Modificar para evitar efectos secundarios innecesarios
	const containerList = children.map((child) => ({
		id: child.key,
		title: child.key,
		items: [{ component: child, id: 'item-' + child.key }],
	}))
	useEffect(() => {
		setContainers(containerList)
	}, [])

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={rectIntersection}
			onDragStart={(event) => handleDragStart(event, setActiveId)}
			onDragMove={(event) => handleDragMove(event, containers, setContainers)}
			onDragEnd={(event) => handleDragEnd(event, containers, setContainers, setActiveId)}
		>
			<div className='flex flex-col w-full gap-3'>
				<SortableContext items={containers.map((container) => container.id)}>
					{containers.map((container) => (
						<ContainerDnd className={'w-1/2'} key={container.id} id={container.id}>
							<div className='flex flex-wrap gap-3 w-full'>
								<SortableContext items={container.items.map((item) => item.id)}>
									{container.items.map((item) => (
										<div key={item.id}>{item.component}</div>
									))}
								</SortableContext>
							</div>
						</ContainerDnd>
					))}
				</SortableContext>
				<DragOverlay>
					{activeId && findItemById(activeId, containers)?.item && (
						<ItemsDnD id={activeId} control={findItemById(activeId, containers).item[0].component} />
					)}
				</DragOverlay>
			</div>
		</DndContext>
	)
}

export default DndComponent
