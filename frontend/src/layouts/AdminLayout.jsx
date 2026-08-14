import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Settings, Building } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const menu = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Gyms', path: '/admin/gyms', icon: Building },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-base)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', backgroundColor: '#1A1D20', color: 'white', display: 'flex', flexDirection: 'column', padding: 'var(--space-6)' }}>
        <h2 style={{ color: 'var(--color-brand-primary)', marginBottom: 'var(--space-8)', fontSize: '20px' }}>FitPass Admin</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menu.map(item => (
            <Link key={item.name} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: location.pathname === item.path ? 'white' : '#868E96', backgroundColor: location.pathname === item.path ? '#2C3136' : 'transparent', fontWeight: 500 }}>
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          <LogOut size={20} /> Exit Admin
        </Link>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 'var(--space-8)', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
