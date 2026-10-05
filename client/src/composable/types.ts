export enum ContainerType {
  Left = 'left',
  Right = 'right'
}

export interface IDragData {
  container: ContainerType
  id: number
}

export interface IDropData {
  container: ContainerType
}
