import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Users, BarChart3, DollarSign, Star, Building, Settings, LogOut } from 'lucide-react';
import BrandLogo from '../components/brand/BrandLogo';

const SIDEBAR_LINKS = [
  { to: '/partner',           label: 'Overview',     icon: LayoutDashboard },
  { to: '/partner/reception', label: 'Reception',    icon: ScanLine },
  { to: '/partner/checkins',  label: 'Check-Ins',   icon: Users },
  { to: '/partner/analytics', label: 'Analytics',   icon: BarChart3 },
  { to: '/partner/revenue',   label: 'Revenue',     icon: DollarSign },
  { to: '/partner/reviews',   label: 'Reviews',     icon: Star },
  { to: '/partner/profile',   label: 'Gym Profile', icon: Building },
  { to: '/partner/settings',  label: 'Settings',    icon: Settings },
];

export default function GymOwnerLayout() {
  const { pathname } = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-w)',
        flexShrink: 0,
        background: 'var(--bg-dark)',
        display: 'flex', flexDirection: 'column',
        padding: 'var(--sp-6) 0',
        position: 'fixed', top: 0, bottom: 0, left: 0,
        overflowY: 'auto',
        zIndex: 50,
      }}>
        <div style={{ padding: '0 var(--sp-5) var(--sp-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BrandLogo variant="icon" size="sm" dark />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'white', letterSpacing: '-.01em' }}>Partner</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 var(--sp-3)' }}>
          {SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => {
            const active = to === '/partner' ? pathname === '/partner' : pathname.startsWith(to);
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                borderRadius: 'var(--r-lg)',
                marginBottom: 2,
                fontSize: 'var(--text-sm)', fontWeight: 500,
                color: active ? 'white' : 'var(--text-on-dark-muted)',
                background: active ? 'rgba(255,255,255,.08)' : 'transparent',
                transition: 'all .15s', textDecoration: 'none',
              }}>
                <Icon size={16} color={active ? 'var(--sg-green)' : 'currentColor'} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 'var(--sp-6) var(--sp-5) 0', borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-on-dark-muted)', textDecoration: 'none' }}>
            <LogOut size={15} /> Exit to Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: 'var(--sp-8) var(--sp-8)', maxWidth: 1200 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
