import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createCardSchema } from '../types/validation';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  boardSelector,
  createNewColumn,
  createTaskByColId,
  setCardOpen,
} from '../features/boardSlice';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

interface CustomAddCard {
  type: 'task' | 'column';
  cardId?: string;
  width?: string;
}

export function CustomAddCard({ type, cardId, width }: CustomAddCard) {
  const { toast } = useToast();

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(boardSelector);
  const form = useForm<z.infer<typeof createCardSchema>>({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      input: '',
      id: cardId,
    },
  });

  async function onSubmit(values: z.infer<typeof createCardSchema>) {
    let res: any;

    type === 'task'
      ? (res = dispatch(createTaskByColId(values)))
      : (res = dispatch(createNewColumn(values)));

    res.then(({ payload: { message, success } }: any) =>
      toast({
        variant: success ? 'success' : 'destructive',
        title: message,
      })
    );
  }

  return (
    <div className={cn('mx-3 border rounded-lg p-4 bg-slate-400', width)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
            control={form.control}
            name='input'
            render={({ field }) => (
              <FormItem>
                {type === 'column' && <FormLabel>Column Name</FormLabel>}

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-row'>
            <Button disabled={loading} size={'sm'} type='submit'>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Submit
            </Button>
            <Button
              className='ml-auto'
              onClick={() =>
                dispatch(setCardOpen({ id: cardId ?? 'col', value: false }))
              }
              size={'sm'}
              variant={'outline'}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
