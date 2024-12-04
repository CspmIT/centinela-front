import { arrayMove } from '@dnd-kit/sortable'
export const findItemById = (id, containers) => {
	for (const container of containers) {
		const item = container.items.find((item) => item.id === id)
		if (item) return { container, item }
	}
	return null
}

export function findValueOfItems(id, type, containers) {
	if (type === 'container') {
		return containers.find((item) => item.id === id)
	}
	if (type === 'item') {
		return containers.find((container) => container.items.find((item) => item.id === id))
	}
}
export const handleDragStart = (event, setActiveId) => {
	setActiveId(event.active.id)
}

export const handleDragMove = (event, containers, setContainers) => {
	const { active, over } = event
	if (!active || !over) return

	const activeId = active.id.toString()
	const overId = over.id.toString()

	const newContainers = [...containers] // Hacer una copia para evitar la mutabilidad directa

	if (activeId.includes('item') && overId.includes('item') && activeId !== overId) {
		const activeContainer = findValueOfItems(active.id, 'item', newContainers)
		const overContainer = findValueOfItems(over.id, 'item', newContainers)
		if (!activeContainer || !overContainer) return

		const activeContainerIndex = newContainers.findIndex((container) => container.id === activeContainer.id)
		const overContainerIndex = newContainers.findIndex((container) => container.id === overContainer.id)
		const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
		const overItemIndex = overContainer.items.findIndex((item) => item.id === over.id)

		// Mover el ítem en el mismo contenedor o entre contenedores
		if (activeContainerIndex === overContainerIndex) {
			newContainers[activeContainerIndex].items = arrayMove(
				newContainers[activeContainerIndex].items,
				activeItemIndex,
				overItemIndex
			)
		} else {
			const [removedItem] = newContainers[activeContainerIndex].items.splice(activeItemIndex, 1)
			newContainers[overContainerIndex].items.splice(overItemIndex, 0, removedItem)
		}
	}

	if (activeId.includes('item') && overId.includes('container') && activeId !== overId) {
		const activeContainer = findValueOfItems(active.id, 'item', newContainers)
		const overContainer = findValueOfItems(over.id, 'container', newContainers)
		if (!activeContainer || !overContainer) return

		const activeContainerIndex = newContainers.findIndex((container) => container.id === activeContainer.id)
		const overContainerIndex = newContainers.findIndex((container) => container.id === overContainer.id)
		const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

		// Mover ítem entre contenedores
		const [removedItem] = newContainers[activeContainerIndex].items.splice(activeItemIndex, 1)
		newContainers[overContainerIndex].items.push(removedItem)
	}

	// Actualizar el estado después de mover
	setContainers(newContainers)
}

export const handleDragEnd = (event, containers, setContainers, setActiveId) => {
	const { active, over } = event
	if (!active || !over) return

	const activeId = active.id.toString()
	const overId = over.id.toString()

	const newContainers = [...containers] // Copia de los contenedores

	if (activeId.includes('container') && overId.includes('container') && activeId !== overId) {
		const activeContainerIndex = newContainers.findIndex((container) => container.id === active.id)
		const overContainerIndex = newContainers.findIndex((container) => container.id === over.id)
		// Mover el contenedor
		newContainers = arrayMove(newContainers, activeContainerIndex, overContainerIndex)
	}

	if (activeId.includes('item') && overId.includes('item') && activeId !== overId) {
		const activeContainer = findValueOfItems(active.id, 'item', newContainers)
		const overContainer = findValueOfItems(over.id, 'item', newContainers)
		if (!activeContainer || !overContainer) return

		const activeContainerIndex = newContainers.findIndex((container) => container.id === activeContainer.id)
		const overContainerIndex = newContainers.findIndex((container) => container.id === overContainer.id)
		const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
		const overItemIndex = overContainer.items.findIndex((item) => item.id === over.id)

		// Mover ítem dentro de contenedores o entre contenedores
		if (activeContainerIndex === overContainerIndex) {
			newContainers[activeContainerIndex].items = arrayMove(
				newContainers[activeContainerIndex].items,
				activeItemIndex,
				overItemIndex
			)
		} else {
			const [removedItem] = newContainers[activeContainerIndex].items.splice(activeItemIndex, 1)
			newContainers[overContainerIndex].items.splice(overItemIndex, 0, removedItem)
		}
	}

	if (activeId.includes('item') && overId.includes('container') && activeId !== overId) {
		const activeContainer = findValueOfItems(active.id, 'item', newContainers)
		const overContainer = findValueOfItems(over.id, 'container', newContainers)
		if (!activeContainer || !overContainer) return

		const activeContainerIndex = newContainers.findIndex((container) => container.id === activeContainer.id)
		const overContainerIndex = newContainers.findIndex((container) => container.id === overContainer.id)
		const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

		// Mover ítem entre contenedores
		const [removedItem] = newContainers[activeContainerIndex].items.splice(activeItemIndex, 1)
		newContainers[overContainerIndex].items.push(removedItem)
	}

	// Actualizar el estado después del drag
	setContainers(newContainers)
	setActiveId(null)
}
