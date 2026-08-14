import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Activity, CreditCard, User, Bell, MapPin, QrCode } from 'lucide-react';
import { mockUser } from '../services/mockData';

const TOP_NAV = [
  { to: '/member',            label: 'Home',       icon: Home },
  { to: '/member/explore',    label: 'Explore',    icon: Compass },
  { to: '/member/activity',   label: 'Activity',   icon: Activity },
  { to: '/member/membership', label: 'Membership', icon: CreditCard },
];

const BOT_NAV = [
  { to: '/member',            label: 'Home',    icon: Home },
  { to: '/member/explore',    label: 'Explore', icon: Compass },
  { to: '/member/pass',       label: 'Pass',    icon: QrCode,   isCenter: true },
  { to: '/member/activity',   label: 'Activity',icon: Activity },
  { to: '/member/profile',    label: 'Profile', icon: User },
];

export default function MemberLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (to) => {
    if (to === '/member') return pathname === '/member';
    return pathname.startsWith(to);
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-10)' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, background: 'var(--sg-charcoal)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--sg-green)', fontWeight: 900, fontSize: 12, fontFamily: 'var(--font-heading)' }}>SG</span>
              </div>
              <span className="hide-tablet" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', letterSpacing: '-.02em', color: 'var(--text-primary)' }}>
                Silver GYM
              </span>
            </Link>

            <nav style={{ display: 'flex', gap: 2 }} className="hide-mobile">
              {TOP_NAV.map(({ to, label, icon: Icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to} to={to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '.45rem .875rem',
                      borderRadius: 'var(--r-md)',
                      fontSize: 'var(--text-sm)', fontWeight: active ? 600 : 500,
                      color: active ? 'var(--sg-green)' : 'var(--text-secondary)',
                      background: active ? 'var(--sg-green-light)' : 'transparent',
                      transition: 'all .15s',
                    }}
                  >
                    <Icon size={15} /> {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            {/* Location */}
            <button
              className="hide-mobile"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '.4rem .875rem', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-full)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500 }}
            >
              <MapPin size={13} color="var(--sg-green)" /> {mockUser.location.split(',')[0]}
            </button>

            {/* My Pass CTA */}
            <Link to="/member/pass" className="btn btn-primary btn-sm hide-mobile" style={{ gap: 6 }}>
              <QrCode size={14} /> My Pass
            </Link>

            {/* Notifications */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 6, borderRadius: 'var(--r-full)' }}>
              <Bell size={18} color="var(--text-secondary)" />
              <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, background: 'var(--status-error)', borderRadius: '50%', border: '2px solid white' }} />
            </button>

            {/* Avatar */}
            <Link to="/member/profile">
              <img
                src={mockUser.avatar}
                alt="Profile"
                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: '2px solid var(--sg-green-muted)' }}
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
      <nav className="show-mobile" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 68,
        background: 'rgba(255,255,255,.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        zIndex: 200,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {BOT_NAV.map(({ to, label, icon: Icon, isCenter }) => {
          const active = isActive(to);
          return (
            <Link
              key={to} to={to}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', position: 'relative' }}
            >
              {isCenter ? (
                <div style={{ width: 52, height: 52, background: 'var(--sg-charcoal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(28,33,40,.35)', marginTop: -20 }}>
                  <Icon size={24} color="var(--sg-green)" />
                </div>
              ) : (
                <>
                  <Icon size={20} color={active ? 'var(--sg-green)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: active ? 'var(--sg-green)' : 'var(--text-muted)' }}>
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
