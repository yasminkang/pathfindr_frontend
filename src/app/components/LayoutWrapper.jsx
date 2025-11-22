'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './sidebar.jsx';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isEnterPage = pathname === '/enter';
  const isRootPage = pathname === '/';

  if (isLoginPage || isEnterPage || isRootPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundImage: 'url(/layoutbg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      boxSizing: 'border-box'
    }}>
      <Sidebar />
      
      <main style={{ 
        flex: 1,
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '1rem',
        margin: '1rem',
        marginTop: '1rem',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)'
      }}>
        {children}
      </main>
    </div>
  );
}

