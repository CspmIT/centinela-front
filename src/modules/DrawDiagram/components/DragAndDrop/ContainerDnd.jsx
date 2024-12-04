import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function ContainerDnd({ id, children }) {
	const { attributes, setNodeRef, transform, transition } = useSortable({
		id: id,
		data: {
			type: 'container',
		},
	})

	return (
		<div
			{...attributes}
			ref={setNodeRef}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className='w-full h-full p-4 bg-gray-50 cursor-auto rounded-xl flex flex-col gap-y-4'
		>
			{children}
		</div>
	)
}

export default ContainerDnd
