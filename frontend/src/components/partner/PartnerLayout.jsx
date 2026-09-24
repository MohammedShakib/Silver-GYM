import { Outlet, Link, useLocation } from 'react-router-dom';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, Scan, BarChart2, DollarSign, Settings, Star, UserPlus, LogOut, ChevronDown } from 'lucide-react';
import Skeleton from '../ui/Skeleton';

export default function PartnerLayout() {
  const { availableGyms, selectedGym, staffRole, isLoading, changeGym, hasPermission } = usePartnerGym();
  const { logout, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <div style={{ padding: 40 }}><Skeleton height={400} /></div>;

  if (!selectedGym) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'white' }}>
        <h2>No Gym Access</h2>
        <p>You do not have access to any partner gyms.</p>
        <button className="btn btn-secondary" onClick={logout} style={{ marginTop: 20 }}>Log out</button>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/partner', icon: <LayoutDashboard size={20} />, roles: ['OWNER', 'MANAGER', 'RECEPTIONIST'] },
    { label: 'Reception Scanner', path: '/partner/reception', icon: <Scan size={20} />, roles: ['OWNER', 'MANAGER', 'RECEPTIONIST'] },
    { label: 'Check-Ins', path: '/partner/check-ins', icon: <Users size={20} />, roles: ['OWNER', 'MANAGER', 'RECEPTIONIST'] },
    { label: 'Analytics', path: '/partner/analytics', icon: <BarChart2 size={20} />, roles: ['OWNER', 'MANAGER'] },
    { label: 'Revenue', path: '/partner/revenue', icon: <DollarSign size={20} />, roles: ['OWNER'] },
    { label: 'Reviews', path: '/partner/reviews', icon: <Star size={20} />, roles: ['OWNER', 'MANAGER'] },
    { label: 'Gym Profile', path: '/partner/profile', icon: <Settings size={20} />, roles: ['OWNER', 'MANAGER', 'RECEPTIONIST'] },
    { label: 'Staff Management', path: '/partner/staff', icon: <UserPlus size={20} />, roles: ['OWNER'] },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1117' }}>
      {/* Sidebar */}
      <aside style={{ width: 280, background: '#161B22', borderRight: '1px solid #30363D', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #30363D' }}>
          <h2 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '20px' }}>Silver GYM</h2>
          <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 'bold' }}>PARTNER PORTAL</span>
        </div>

        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.filter(item => hasPermission(item.roles)).map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 8,
                  color: isActive ? 'white' : '#8B949E',
                  background: isActive ? '#21262D' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #30363D' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#30363D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: '#8B949E', fontSize: 12 }}>{staffRole}</div>
            </div>
          </div>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F85149', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0 }}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{ height: 72, background: '#161B22', borderBottom: '1px solid #30363D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          
          {/* Branch Selector */}
          <div style={{ position: 'relative' }}>
            {availableGyms.length > 1 ? (
              <select 
                value={selectedGym.id} 
                onChange={(e) => changeGym(e.target.value)}
                style={{ appearance: 'none', background: '#21262D', color: 'white', border: '1px solid #30363D', padding: '8px 40px 8px 16px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', outline: 'none' }}
              >
                {availableGyms.map(g => (
                  <option key={g.gym.id} value={g.gym.id}>{g.gym.name}</option>
                ))}
              </select>
            ) : (
              <div style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>
                {selectedGym.name}
              </div>
            )}
            {availableGyms.length > 1 && (
              <ChevronDown size={16} color="white" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            )}
          </div>

          <div style={{ color: '#8B949E', fontSize: 14 }}>
            Status: <span style={{ color: selectedGym.status === 'ACTIVE' ? '#22c55e' : '#F85149', fontWeight: 600 }}>{selectedGym.status}</span>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
