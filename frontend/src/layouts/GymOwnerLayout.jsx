import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, LogOut } from 'lucide-react';

export default function GymOwnerLayout() {
  const location = useLocation();
  const menu = [
    { name: 'Overview', path: '/partner', icon: LayoutDashboard },
    { name: 'Check-Ins', path: '/partner/checkins', icon: Activity },
    { name: 'Members', path: '/partner/members', icon: Users },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-base)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', padding: 'var(--space-6)' }}>
        <h2 style={{ color: 'white', marginBottom: 'var(--space-8)' }}>FitPass Partner</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menu.map(item => (
            <Link key={item.name} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: location.pathname === item.path ? 'white' : '#94a3b8', backgroundColor: location.pathname === item.path ? '#1e293b' : 'transparent', fontWeight: 500 }}>
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#ef4444', fontWeight: 500 }}>
          <LogOut size={20} /> Exit
        </Link>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 'var(--space-8)', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
