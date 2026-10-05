import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ListItemButton, ListItemText } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

interface IProps {
  id: number
}

export function SortableRow({ id }: IProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
        opacity: isDragging ? 0.85 : 1
      }}
      {...attributes}
      {...listeners}
    >
      <ListItemButton disableRipple>
        <DragIndicatorIcon sx={{ mr: 1, color: 'text.disabled' }} />
        <ListItemText primary={id} />
      </ListItemButton>
    </div>
  )
}
