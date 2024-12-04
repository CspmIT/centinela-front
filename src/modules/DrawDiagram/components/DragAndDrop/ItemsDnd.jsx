import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function ItemsDnD({ id, children }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: id,
		data: {
			type: 'item',
		},
	})

	return (
		<div
			{...attributes}
			{...listeners}
			ref={setNodeRef}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={isDragging ? ' opacity-50' : ''}
		>
			{children}
		</div>
	)
}

export default ItemsDnD
