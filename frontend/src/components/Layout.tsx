import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import Weather from './Weather';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar always on the left */}
      <Sidebar />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header at top */}
        <Header onUserSelected={() => {}} />

        {/* Weather placed at the top under the header */}
        <div style={{ padding: '10px 20px' }}>
          <Weather />
        </div>

        {/* Page-specific content */}
        <div style={{ padding: '20px', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;