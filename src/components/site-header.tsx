import { MainNav } from '@/components/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { siteConfig } from '@/config/site';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { useAppDispatch } from '../redux/hooks';
import { logout, userLogout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

export function SiteHeader() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className='grid'>
      <header className='sticky top-0 z-40 w-full border-b bg-background'>
        <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
          <MainNav items={siteConfig.mainNav} />
          <div className='flex flex-1 items-center justify-end space-x-4'>
            <nav className='flex items-center space-x-1'>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut size={16} className='m-1' />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
