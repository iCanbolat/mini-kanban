import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import { Toaster } from '@/components/ui/toaster';
import AdminPanel from './pages/admin';
import { authSelector } from './features/authSlice';
import { useAppSelector } from './redux/hooks';

const PrivateRoute = () => {
  const { user } = useAppSelector(authSelector);

  return user.email ? <Outlet /> : <Navigate to={'/login'} replace />;
};

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/admin' element={<AdminPanel />} />
          </Route>
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
