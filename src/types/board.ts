export interface IBoard {
  id: string;
  name: string;
  items: ITask[];
}
export interface ITask {
  id: string;
  content: string;
}

export type BoardDragProps = {
  droppableId: string;
  sourceItems: any;
  columns: any;
  column?: any;
  droppableDestId?: string;
  destItems?: any;
  sourceColumn?: any;
  destColumn?: any;
};
