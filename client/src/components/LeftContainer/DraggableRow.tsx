import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ListItemButton, ListItemText } from '@mui/material'
import { ContainerType, type IDragData } from '../../composable/types'

interface IProps {
  id: number
  onDoubleClick: () => void
  rowHeight: number
}

export function DraggableRow({ id, onDoubleClick, rowHeight }: IProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { container: ContainerType.Left, id } satisfies IDragData
    })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0 : 1,
        height: rowHeight,
        width: '100%'
      }}
      {...attributes}
      {...listeners}
    >
      <ListItemButton
        disableRipple
        onDoubleClick={onDoubleClick}
        sx={{ height: rowHeight }}
      >
        <ListItemText primary={id} />
      </ListItemButton>
    </div>
  )
}
