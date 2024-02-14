import { useEffect } from 'react';
import CreateUserCard from '../../components/create-user-form';
import { authSelector } from '../../features/authSlice';
import { useAppSelector } from '../../redux/hooks';
import { UserRoles } from '../../types/user';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAppSelector(authSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === UserRoles.USER) navigate('/');
  }, []);

  return (
    <div className='w-full justify-center flex items-center h-[70vh] flex-col'>
      <h1 className='text-xl font-medium font-sans mb-5'>Admin can add user</h1>
      <CreateUserCard />
    </div>
  );
};

export default AdminPanel;
