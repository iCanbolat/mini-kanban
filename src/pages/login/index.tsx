import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { loginSchema } from '../../types/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import { authSelector, userLogin } from '../../features/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(authSelector);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await dispatch(userLogin(values)).then((f: any) =>
      f.payload.success ? navigate('/') : null
    );
  }
  return (
    <div className='w-full flex items-center justify-center h-screen '>
      <Card className='w-[350px]'>
        <CardHeader className='text-center'>
          <CardTitle>Kanban App</CardTitle>
          {error && (
            <div className='bg-red-600 p-1 rounded-xl'>
              <p className='text-sm font-medium text-white italic'>{error}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid w-full items-center gap-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{' '}
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={loading} className='mt-5 w-full'>
                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
