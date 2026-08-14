import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building, FileText, CreditCard, Activity, DollarSign, HeadphonesIcon, BarChart3, Settings, LogOut } from 'lucide-react';
import BrandLogo from '../components/brand/BrandLogo';

const ADMIN_LINKS = [
  { to: '/admin',                  label: 'Overview',      icon: LayoutDashboard },
  { to: '/admin/users',            label: 'Users',         icon: Users },
  { to: '/admin/gyms',             label: 'Gyms',          icon: Building },
  { to: '/admin/applications',     label: 'Applications',  icon: FileText },
  { to: '/admin/memberships',      label: 'Memberships',   icon: CreditCard },
  { to: '/admin/checkins',         label: 'Check-Ins',    icon: Activity },
  { to: '/admin/transactions',     label: 'Transactions',  icon: DollarSign },
  { to: '/admin/payouts',          label: 'Payouts',       icon: DollarSign },
  { to: '/admin/reports',          label: 'Reports',       icon: BarChart3 },
  { to: '/admin/settings',         label: 'Settings',      icon: Settings },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <aside style={{
        width: 'var(--sidebar-w)',
        flexShrink: 0,
        background: '#0D1117',
        display: 'flex', flexDirection: 'column',
        padding: 'var(--sp-6) 0',
        position: 'fixed', top: 0, bottom: 0, left: 0,
        zIndex: 50, overflowY: 'auto',
      }}>
        <div style={{ padding: '0 var(--sp-5) var(--sp-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BrandLogo variant="icon" size="sm" dark />
            <div>
              <BrandLogo variant="wordmark" size="sm" dark />
              <span className="badge badge-silver" style={{ marginLeft: 8, fontSize: 9 }}>ADMIN</span>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 var(--sp-3)' }}>
          {ADMIN_LINKS.map(({ to, label, icon: Icon }) => {
            const active = to === '/admin' ? pathname === '/admin' : pathname.startsWith(to);
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 14px', borderRadius: 'var(--r-md)', marginBottom: 2,
                fontSize: 'var(--text-sm)', fontWeight: 500,
                color: active ? 'white' : '#6B7280',
                background: active ? 'rgba(255,255,255,.06)' : 'transparent',
                textDecoration: 'none', transition: 'all .15s',
              }}>
                <Icon size={15} color={active ? 'var(--sg-green)' : 'currentColor'} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 'var(--sp-5)', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: '#6B7280', textDecoration: 'none' }}>
            <LogOut size={14} /> Exit Admin
          </Link>
        </div>
      </aside>

      <div style={{ marginLeft: 'var(--sidebar-w)', flex: 1 }}>
        <main style={{ padding: 'var(--sp-8)', maxWidth: 1200 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
