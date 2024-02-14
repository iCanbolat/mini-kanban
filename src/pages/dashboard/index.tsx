import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Button } from '../../components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { CustomAddCard } from '../../components/custom-add-card';

import {
  boardSelector,
  deleteTask,
  getBoard,
  setCardOpen,
  setNewOrder,
  setTaskOrder,
} from '../../features/boardSlice';
import { useToast } from '../../components/ui/use-toast';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { BoardDragProps, IBoard } from '../../types/board';
import { cn } from '../../lib/utils';
import { authSelector } from '../../features/authSlice';

const onDragEnd = async (
  result: { destination: any; source?: any },
  columns: { [x: string]: any },
  setColumns: ActionCreatorWithPayload<BoardDragProps, 'board/setNewOrder'>,
  dispatch: any
) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    const {
      payload: { success },
    }: { payload: { success: boolean } } = await dispatch(
      setTaskOrder({
        droppableId: source.droppableId,
        droppableDestId: destination.droppableId,
        destItems,
        sourceItems,
      })
    );

    if (success) {
      dispatch(
        setColumns({
          droppableId: source.droppableId,
          droppableDestId: destination.droppableId,
          destItems,
          sourceItems,
          sourceColumn,
          destColumn,
          columns,
        })
      );
    }
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    const {
      payload: { success },
    } = await dispatch(
      setTaskOrder({
        droppableId: source.droppableId,
        sourceItems: copiedItems,
      })
    );

    if (success) {
      dispatch(
        setColumns({
          columns,
          droppableId: source.droppableId,
          column,
          sourceItems: copiedItems,
        })
      );
    }
  }
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const {
    isOpen,
    boards,
  }: { isOpen: { key?: string; value?: boolean } | any; boards: IBoard } =
    useAppSelector(boardSelector);
  const { user } = useAppSelector(authSelector);
  const { toast } = useToast();

  useEffect(() => {
    const postT = async () => {
      dispatch(getBoard());
    };
    postT();
  }, []);

  return (
    <section className='container flex flex-col items-center gap-6 pb-8 pt-6 md:py-10'>
      <div className='flex max-w-[980px] flex-col text-center gap-2 '>
        <h1 className='text-3xl font-extrabold leading-tight tracking-tighter md:text-3xl'>
          Welcome back, {user.name} !
        </h1>
        <p className='max-w-[700px] text-lg text-muted-foreground'>
          You can create task and drag it between columns like Kanban.{' '}
          <br className='hidden sm:inline' />
          Additionally only admins can add user & see/navigate to admin page.
        </p>
      </div>
      <div className='flex justify-center h-full max-w-7xl flex-wrap'>
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(result, boards, setNewOrder, dispatch)
          }
        >
          {Object.entries(boards).map(([columnId, column]) => {
            return (
              <div
                className='flex flex-col items-center relative'
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn(
                            'rounded-xl w-[250px] min-h-[500px] max-h-[500px] overflow-y-auto p-2',
                            snapshot.isDraggingOver
                              ? 'bg-gray-400'
                              : 'bg-gray-200'
                          )}
                        >
                          {column.items.map((item: any, index: any) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={cn(
                                        'p-4 text-white flex min-h-[50px] select-none mb-2 rounded-lg dark:drop-shadow-[0_4px_5px_rgba(0,0,0,0.7)]',
                                        snapshot.isDragging
                                          ? 'bg-slate-600'
                                          : 'bg-slate-800'
                                      )}
                                      style={{
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.content}
                                      <div className='ml-auto cursor-pointer p-0.5  '>
                                        <Trash2
                                          onClick={async () =>
                                            await dispatch(
                                              deleteTask({
                                                taskId: item.id,
                                                colId: columnId,
                                              })
                                            ).then((data: any) =>
                                              toast({
                                                title: data.payload.message,
                                                variant: data.payload.success
                                                  ? 'success'
                                                  : 'destructive',
                                              })
                                            )
                                          }
                                          size={18}
                                        />
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}

                          <div className='absolute bottom-5 left-4'>
                            {isOpen[columnId] && (
                              <CustomAddCard type='task' cardId={columnId} />
                            )}
                            {isOpen[columnId] !== true && (
                              <Button
                                onClick={() =>
                                  dispatch(
                                    setCardOpen({ id: columnId, value: true })
                                  )
                                }
                                size={'sm'}
                              >
                                <Plus size={16} />
                                Add Task
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}

          <div className='min-w-[250px] flex items-center justify-center h-[500px] mt-8'>
            {!isOpen['col'] && (
              <div
                onClick={() =>
                  dispatch(setCardOpen({ id: 'col', value: true }))
                }
                className='h-full w-full bg-gray-100 hover:bg-gray-200 dark:bg-[#ffffff4e] flex justify-center items-center rounded-xl hover:bg-[#ffffff3d] border border-solid cursor-pointer'
              >
                <Button size={'icon'}>
                  <Plus size={16} />
                </Button>
              </div>
            )}

            {isOpen['col'] && <CustomAddCard type='column' />}
          </div>
        </DragDropContext>
      </div>
    </section>
  );
};

export default Dashboard;
