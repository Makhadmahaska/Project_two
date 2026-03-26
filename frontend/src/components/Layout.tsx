import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { User } from '../types';

interface LayoutProps {
  children: ReactNode;
  onUserSelected: (user: User) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onUserSelected }) => {
  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onUserSelected={onUserSelected} />
        <div style={{ padding: '20px', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
