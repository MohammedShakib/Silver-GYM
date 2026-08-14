import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, Activity, QrCode, User, Bell, MapPin } from 'lucide-react';
import { mockUser } from '../services/mockData';

export default function MemberLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/member', label: 'Home', icon: Home },
    { path: '/member/explore', label: 'Explore', icon: Compass },
    { path: '/member/pass', label: 'Pass', icon: QrCode },
    { path: '/member/activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-subtle)' }}>
      {/* Desktop Top Nav */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'var(--color-bg-surface)', 
        borderBottom: '1px solid var(--color-border-default)',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container flex-row-between">
          <div className="flex-row-center" style={{ gap: 'var(--space-10)' }}>
            <Link to="/member" style={{ 
              fontFamily: 'var(--font-family-heading)', 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: 800, 
              color: 'var(--color-brand-primary)' 
            }}>
              FitPass
            </Link>

            <nav style={{ display: 'flex', gap: 'var(--space-6)' }}>
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    style={{ 
                      color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)', 
                      fontWeight: isActive ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <item.icon size={18} />
                    <span className="hidden-mobile">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-row-center" style={{ gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', backgroundColor: 'var(--color-bg-base)', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
              <MapPin size={14} />
              {mockUser.location}
            </div>
            <button className="btn-icon" style={{ backgroundColor: 'transparent', border: 'none' }}>
              <Bell size={20} color="var(--color-text-secondary)" />
            </button>
            <img 
              src={mockUser.avatar} 
              alt="Profile" 
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
            />
          </div>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: '80px' /* padding for mobile nav */ }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '72px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 50
      }} className="mobile-only-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const isPass = item.label === 'Pass';
          
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '4px',
                color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                textDecoration: 'none',
                position: isPass ? 'relative' : 'static'
              }}
            >
              {isPass ? (
                <div style={{ 
                  backgroundColor: 'var(--color-brand-primary)', 
                  color: 'white', 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transform: 'translateY(-20px)',
                  boxShadow: '0 8px 16px rgba(25, 195, 106, 0.4)'
                }}>
                  <item.icon size={28} />
                </div>
              ) : (
                <>
                  <item.icon size={24} />
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
        <Link to="/member/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <User size={24} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Profile</span>
        </Link>
      </nav>
      
      <style>{`
        @media (min-width: 768px) {
          .mobile-only-nav { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
