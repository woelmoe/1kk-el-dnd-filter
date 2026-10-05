import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ListItemButton, ListItemText } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { ContainerType, type IDragData } from '../../composable/types'

interface IProps {
  id: number
  rowHeight: number
}

export function SortableRow({ id, rowHeight }: IProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    data: { container: ContainerType.Right, id } satisfies IDragData
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
        opacity: isDragging ? 0.85 : 1,
        height: rowHeight
      }}
      {...attributes}
      {...listeners}
    >
      <ListItemButton disableRipple sx={{ height: rowHeight }}>
        <DragIndicatorIcon sx={{ mr: 1, color: 'text.disabled' }} />
        <ListItemText primary={id} />
      </ListItemButton>
    </div>
  )
}
