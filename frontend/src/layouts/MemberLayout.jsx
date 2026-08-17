import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, Activity, CreditCard, User, Bell, MapPin, QrCode } from 'lucide-react';
import { mockUser } from '../services/mockData';
import BrandLogo from '../components/brand/BrandLogo';

const TOP_NAV = [
  { to: '/member',            label: 'Home',       icon: Home,       exact: true },
  { to: '/member/explore',    label: 'Explore',    icon: Compass,    exact: false },
  { to: '/member/activity',   label: 'Activity',   icon: Activity,   exact: false },
  { to: '/member/membership', label: 'Membership', icon: CreditCard, exact: false },
];

const BOT_NAV = [
  { to: '/member',            label: 'Home',     icon: Home,     exact: true },
  { to: '/member/explore',    label: 'Explore',  icon: Compass,  exact: false },
  { to: '/member/pass',       label: 'My Pass',  icon: QrCode,   isCenter: true },
  { to: '/member/activity',   label: 'Activity', icon: Activity, exact: false },
  { to: '/member/profile',    label: 'Profile',  icon: User,     exact: false },
];

export default function MemberLayout() {
  const { pathname, hash } = useLocation();

  const isActive = (to, exact = false) => {
    if (exact || to === '/member') return pathname === '/member';
    return pathname.startsWith(to);
  };

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const scrollTargetId = hash.replace('#', '');
    window.setTimeout(() => {
      const target = document.getElementById(scrollTargetId);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }, [hash, pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ─── Desktop Top Nav ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 'var(--header-h)',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo + Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
            <Link to="/member" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BrandLogo variant="icon" size="sm" />
              <BrandLogo variant="wordmark" size="sm" className="hide-tablet" />
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-mobile" aria-label="Member Navigation">
              {TOP_NAV.map(({ to, label, icon: Icon, exact }) => {
                const active = isActive(to, exact);
                return (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--r-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: active ? 600 : 500,
                      color: active ? 'var(--sg-green)' : 'var(--text-secondary)',
                      background: active ? 'var(--sg-green-light)' : 'transparent',
                      transition: 'all .15s ease',
                    }}
                  >
                    <Icon size={16} strokeWidth={active ? 2.3 : 1.9} color={active ? 'var(--sg-green)' : 'currentColor'} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            {/* Location selector */}
            <Link
              to="/member/explore"
              className="hide-mobile"
              title="Change area"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.4rem 0.85rem',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--r-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                transition: 'border-color .15s, background .15s',
              }}
            >
              <MapPin size={13} color="var(--sg-green)" />
              <span>{mockUser.location}</span>
            </Link>

            {/* My Pass CTA */}
            <Link
              to="/member/pass"
              className="btn btn-primary btn-sm hide-mobile"
              style={{ gap: 6, fontWeight: 700 }}
            >
              <QrCode size={14} strokeWidth={2.2} />
              <span>My Pass</span>
            </Link>

            {/* Notifications */}
            <Link
              to="/member/activity"
              title="Recent alerts & activity"
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                position: 'relative',
                width: 36,
                height: 36,
                borderRadius: 'var(--r-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'background .15s',
              }}
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                background: 'var(--status-error)',
                borderRadius: '50%',
                border: '1.5px solid white'
              }} />
            </Link>

            {/* Avatar */}
            <Link to="/member/profile" title="My Account" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={mockUser.avatar}
                alt="Alex Rahman"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: '2px solid var(--sg-green-muted)',
                }}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Page Content ─── */}
      <main style={{ flex: 1, paddingBottom: 80 }}>
        <Outlet />
      </main>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="show-mobile" aria-label="Mobile Navigation" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 68,
        background: 'rgba(255,255,255,.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        zIndex: 200,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {BOT_NAV.map(({ to, label, icon: Icon, isCenter, exact }) => {
          const active = isActive(to, exact);
          return (
            <Link
              key={to}
              to={to}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', position: 'relative' }}
            >
              {isCenter ? (
                <div style={{
                  width: 50,
                  height: 50,
                  background: 'var(--sg-charcoal)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(16,23,34,.3)',
                  marginTop: -22,
                  border: '2px solid white',
                }}>
                  <Icon size={22} color="var(--sg-green)" strokeWidth={2.2} />
                </div>
              ) : (
                <>
                  <Icon size={19} strokeWidth={active ? 2.3 : 1.8} color={active ? 'var(--sg-green)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? 'var(--sg-green)' : 'var(--text-muted)' }}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

