import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { NavItem } from '@/types/nav';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { authSelector } from '../features/authSlice';
import { UserRoles } from '../types/user';

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const { user } = useAppSelector(authSelector);

  return (
    <div className='flex gap-6 md:gap-10'>
      <Link to='/' className='items-center space-x-2 hidden md:flex'>
        <Icons.laptop className='h-6 w-6' />
        <span className='inline-block font-bold'>{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className='flex gap-6'>
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground',
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
          {user.role === UserRoles.ADMIN && (
            <Link
              to={'/admin'}
              className={cn(
                'flex items-center text-sm font-medium text-muted-foreground'
              )}
            >
              Admin
            </Link>
          )}
        </nav>
      ) : null}
    </div>
  );
}
