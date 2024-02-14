import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';
import { createCardSchema } from '../types/validation';
import { z } from 'zod';
import boardService, { createColumn, createTask } from '../api/board-services';
import { BoardDragProps, IBoard } from '../types/board';

interface BoardState {
  loading: boolean;
  boards: Partial<IBoard> | any;
  error: string;
  isOpen: { key?: string; value?: boolean } | any;
  message: string | unknown;
  success: boolean | undefined;
}

const initialState: BoardState = {
  loading: false,
  boards: {},
  error: '',
  isOpen: {},
  message: '',
  success: undefined,
};

export const createTaskByColId = createAsyncThunk(
  'board/createTaskByColId',
  async (values: z.infer<typeof createCardSchema>, { rejectWithValue }) => {
    try {
      return await createTask(values);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const createNewColumn = createAsyncThunk(
  'board/createNewColumn',
  async (values: z.infer<typeof createCardSchema>, { rejectWithValue }) => {
    try {
      return await createColumn(values);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const setTaskOrder = createAsyncThunk(
  'board/setTaskOrder',
  async (values: Partial<BoardDragProps>, { rejectWithValue }) => {
    try {
      const { droppableDestId } = values;
      if (!droppableDestId) return boardService.setNewTaskOrder(values);
      return boardService.setNewTaskColOrder(values);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteTask = createAsyncThunk(
  'board/deleteTask',
  async (values: any, { rejectWithValue }) => {
    try {
      return await boardService.deleteTaskById(values);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getBoard = createAsyncThunk('board/fetch', async () => {
  return await boardService.getTasks();
});

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  extraReducers(builder) {
    builder.addCase(createNewColumn.pending, (state) => {
      state.error = '';
    });
    builder.addCase(getBoard.pending, (state) => {
      state.error = '';
    });
    builder.addCase(createTaskByColId.pending, (state) => {
      state.error = '';
      state.loading = true;
    });
    builder.addCase(getBoard.fulfilled, (state, action) => {
      state.loading = false;
      state.boards = action.payload;
    });
    builder.addCase(
      deleteTask.fulfilled,
      (state, { payload: { boardId, data } }) => {
        state.boards[boardId ?? ''] = state.boards[boardId ?? ''].items = data;
      }
    );
    builder.addCase(
      createTaskByColId.fulfilled,
      (state, { payload: { boardId, message, data, success } }) => {
        state.boards[boardId ?? ''] = state.boards[boardId ?? ''].items = data;
        state.message = message;
        state.success = success;
        state.isOpen[boardId ?? ''] = false;
        state.loading = false;
      }
    );
    builder.addCase(
      createNewColumn.fulfilled,
      (state, { payload: { success, message, data } }) => {
        if (data) {
          state.boards[data.id] = {
            name: data.name,
            items: data.items,
          };
          state.success = success;
          state.message = message;
        }
        state.isOpen['col'] = false;
      }
    );
  },
  reducers: {
    setCardOpen: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {
      state.isOpen[action.payload.id] = action.payload.value;
    },
    setNewOrder: (state, action: PayloadAction<BoardDragProps>) => {
      if (!action.payload.droppableDestId) {
        state.boards = {
          ...action.payload.columns,
          [action.payload.droppableId]: {
            ...action.payload.column,
            items: action.payload.sourceItems,
          },
        };
      } else {
        state.boards = {
          ...action.payload.columns,
          [action.payload.droppableId]: {
            ...action.payload.sourceColumn,
            items: action.payload.sourceItems,
          },
          [action.payload.droppableDestId]: {
            ...action.payload.destColumn,
            items: action.payload.destItems,
          },
        };
      }
    },
  },
});
export const boardSelector = (state: RootState) => state.board;
export const { setCardOpen, setNewOrder } = boardSlice.actions;

export default boardSlice.reducer;
