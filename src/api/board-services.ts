import { z } from 'zod';
import { createCardSchema } from '../types/validation';
import { axiosInstance } from './auth-services';
import { v4 as uuidv4 } from 'uuid';
import { BoardDragProps, IBoard } from '../types/board';
import { ApiResponseType } from '../types/api';

export const createColumn = async (
  values: z.infer<typeof createCardSchema>
): Promise<ApiResponseType<IBoard>> => {
  try {
    const { input } = values;

    const response = await axiosInstance.post('board', {
      id: uuidv4(),
      name: input,
      items: [],
    });

    return {
      success: true,
      data: response.data,
      message: 'Column Successfully Created!',
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const createTask = async (
  values: z.infer<typeof createCardSchema>
): Promise<ApiResponseType<IBoard>> => {
  const { id, input } = values;
  const column: IBoard[] = (
    await axiosInstance.get('board', { params: { id } })
  ).data;

  if (!column) {
    return { success: false, message: 'Board not found.' };
  }

  column[0].items?.push({ id: uuidv4(), content: input });

  const response = await axiosInstance.patch(`board/${id}`, {
    items: column[0].items,
  });

  return {
    success: true,
    data: response.data,
    message: 'Task Created!',
    boardId: id,
  };
};

export const setNewTaskOrder = async (
  values: any
): Promise<ApiResponseType> => {
  try {
    const { droppableId, copiedItems } = values;

    await axiosInstance.patch(`board/${droppableId}`, {
      items: copiedItems,
    });
    return { success: true, message: 'Task Reordered' };
  } catch (error) {
    return { success: false, message: 'Task Cant Reordered' };
  }
};
export const setNewTaskColOrder = async (
  values: Partial<BoardDragProps>
): Promise<ApiResponseType> => {
  try {
    const { droppableId, sourceItems, destItems, droppableDestId } = values;

    const updateSourceCol = axiosInstance.patch(`board/${droppableId}`, {
      items: sourceItems,
    });
    const updateDestCol = axiosInstance.patch(`board/${droppableDestId}`, {
      items: destItems,
    });
    Promise.all([updateSourceCol, updateDestCol]).then((value) => {
      return { success: true, message: 'Cols Drag Updated' };
    });
    return { success: true, message: 'Task Reordered' };
  } catch (error) {
    return { success: false, message: 'Task Cant Reordered' };
  }
};

export const deleteTaskById = async (
  values: any
): Promise<ApiResponseType<IBoard>> => {
  try {
    const { taskId, colId } = values;

    const column: IBoard[] = (
      await axiosInstance.get(`board`, { params: { id: colId } })
    ).data;

    const { data } = await axiosInstance.patch(`board/${colId}`, {
      items: column[0].items.filter((el) => el.id !== taskId),
    });
    return { success: true, message: 'Task deleted.', data, boardId: colId };
  } catch (error) {
    return { success: false, message: 'Task cant deleted.' };
  }
};

export const getTasks = async (): Promise<ApiResponseType<IBoard>> => {
  const { data } = await axiosInstance.get('board');
  const obj: any = {};

  for (const task of data) {
    obj[task.id] = { name: task.name, items: task.items };
  }
  return obj;
};
const boardService = {
  getTasks,
  createColumn,
  createTask,
  deleteTaskById,
  setNewTaskColOrder,
  setNewTaskOrder,
};

export default boardService;
