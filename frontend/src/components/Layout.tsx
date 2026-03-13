import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import Weather from './Weather';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout" style={{ display: 'flex' }}>
      <Sidebar /> {/* Always on the side */}
      <div style={{ flex: 1 }}>
        {/* Pass a no-op function to satisfy Header's required prop */}
        <Header onUserSelected={() => {}} />
        <div style={{ padding: '20px' }}>
          {children} {/* Page-specific content */}
        </div>
        <Weather /> {/* Always at bottom */}
      </div>
    </div>
  );
};

export default Layout;